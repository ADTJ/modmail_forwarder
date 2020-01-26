import { Output } from './output';
import { Auth } from '../api/auth';
import { Message } from '../api/message';
import { Forwarder } from '../Forwarder';

export class Reddit implements Output.Provider {
    constructor(protected config: Forwarder.Config) {

    }

    protected authToken: Auth.Token;
    protected get apiParams() { return { authToken: this.authToken, url: this.config.endpointUrl } }


    protected async checkAuth() {
        if (!this.authToken)
            this.authToken = await Auth.getToken(this.config.authEndpointUrl, this.config.credentials);
    }

    async sendMessage(message: string) {
        await this.checkAuth();
        await Message.send(this.apiParams, {
            api_type: "json",
            subject: "unread mod messages",
            text: message,
            to: this.config.recipient
        });
    }
}