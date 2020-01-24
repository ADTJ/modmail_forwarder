import { Auth } from './api/auth';

export class Forwarder {

    constructor(protected config: Forwarder.Config) {

    }

    protected authToken: Auth.AuthToken;

    async checkAuth() {
        if (!this.authToken)
            this.authToken = await Auth.getToken(this.config.authEndpointUrl, this.config.credentials);
    }

    async checkMessages() {
        await this.checkAuth();
    }
}

export module Forwarder {
    export interface Config {
        authEndpointUrl: string;
        endpointUrl: string;
        credentials: Auth.Credentials;
    }
}