import { Request } from '../Request';

export module Auth {
    export interface Credentials {
        username: string;
        password: string;
        client_id: string;
        client_secret: string;
    }

    interface AuthRequest {
        grant_type: "password";
        username: string;
        password: string;
    }

    export interface Token {
        access_token: string;
        expires: Date;
        expires_in: number;
        scope: string;
        token_type: "bearer";
    }

    export function getBasicAuth(username: string, password: string) {
        return Buffer.from(`${username}:${password}`).toString("base64");
    }

    export async function getToken(baseUrl: string, credentials: Credentials) {
        const endpoint = 'access_token';

        let url = `${baseUrl.split('/').filter(x => x).join('/')}/${endpoint}`;
        let body = Request.formEncode({
            grant_type: "password",
            username: credentials.username,
            password: credentials.password
        } as AuthRequest);

        let clientAuth = Auth.getBasicAuth(credentials.client_id, credentials.client_secret);

        let { request, response } = Request.post<Token>(url, body, { parseJson: true, headers: [["Authorization", `Basic ${clientAuth}`]] });

        let result = await response;
        if (result["error"])
            throw new Error(result["error"]);

        const ONE_SECOND_MS = 1000;

        result.expires = new Date(Date.now() + (result.expires_in * ONE_SECOND_MS));

        return result;
    }
}