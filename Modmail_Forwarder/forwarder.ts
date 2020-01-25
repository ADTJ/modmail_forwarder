import { Auth } from './api/auth';
import { Me } from './api/me';
import { Mod } from './api/mod';

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

        console.log("The following groups have unread messages:");
        console.log(unreadMsgTypes.map(([key, value]) => `${key}: ${value.toString()}`).join('\r\n'));

        //TODO: Fetch most recent message?
        //let messages = await Mod.Conversations.get(this.apiParams, { sort: "unread", state: "all" });
        //console.log("Messages found:");
        //console.log(messages);
    }
}

export module Forwarder {
    export interface Config {
        authEndpointUrl: string;
        endpointUrl: string;
        credentials: Auth.Credentials;
        version: string;
    }
}