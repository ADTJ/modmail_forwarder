import { Auth } from './api/auth';
import { Me } from './api/me';

export class Forwarder {

    constructor(protected config: Forwarder.Config) {

    }

    protected authToken: Auth.Token;

    async checkAuth() {
        if (!this.authToken)
            this.authToken = await Auth.getToken(this.config.authEndpointUrl, this.config.credentials);
    }

    async checkMessages() {
        await this.checkAuth();
        let user = await Me.get({ authToken: this.authToken, url: this.config.endpointUrl });
        console.log(user);
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