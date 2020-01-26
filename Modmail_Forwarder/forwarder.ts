import { Auth } from './api/auth';
import { Me } from './api/me';
import { Mod } from './api/mod';
import { Output } from './output/output';

export class Forwarder {

    constructor(protected config: Forwarder.Config) {

    }

    protected authToken: Auth.Token;
    protected user: Me.User;
    protected get apiParams() { return { authToken: this.authToken, url: this.config.endpointUrl } }

    async checkAuth() {
        if (!this.authToken)
            this.authToken = await Auth.getToken(this.config.authEndpointUrl, this.config.credentials);
    }

    async checkMessages() {
        await this.checkAuth();
        let user = this.user || (this.user = await Me.get(this.apiParams));
        if (!user.is_mod)
            throw new Error("Logged in user is not a moderator");

        let unreadMsgCount = await Mod.Conversations.Unread.count(this.apiParams);
        let unreadMsgTypes = Object.entries(unreadMsgCount).filter(([_, value]) => value > 0) as [keyof (typeof unreadMsgCount), number][];
        if (unreadMsgTypes.length < 1) {
            console.log("No unread messages found");
            return;
        }

        let outputMsg = `The following groups have unread messages:
        ${unreadMsgTypes.map(([key, value]) => `${key}: ${value.toString()}`).join('\r\n')}`;

        try {
            await this.config.outputProvider.sendMessage(outputMsg);
        }
        catch (err) {
            throw Object.assign(new Error("Failed to send output") as Forwarder.Error, {
                name: "Forwarder Error",
                innerError: err
            });
        }

        //TODO: Fetch most recent message(s)?
        //let messages = await Mod.Conversations.get(this.apiParams, { sort: "unread", state: "all" });
        //console.log("Messages found:");
        //console.log(messages);
    }
}

type LangErr = Error;
export module Forwarder {
    export interface Config {
        /** The base URL of the auth service API */
        authEndpointUrl: string;
        /** The base URL for API endpoints */
        endpointUrl: string;
        /** How frequently to check for new messages, a value of 0 indicates to only check once and then stop */
        checkInterval: number;
        /** The credentials required to obtain a token for the API */
        credentials: Auth.Credentials;
        /** The manner in which to send retrieved data ("Reddit"/"Console") */
        outputMode: string;
        /** Represents the provider instance set by the outputMode */
        outputProvider: Output.Provider;
        /** The recipient to whom results should be sent, if applicable i.e. a Reddit user */
        recipient: string;
        /** The version of this program */
        version: string;
    }

    export interface Error extends LangErr {
        innerError: LangErr;
    }
}


