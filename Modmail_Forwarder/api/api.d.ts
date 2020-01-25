import { Auth } from "./auth";

declare module Api {
    export interface Params {
        url: string;
        authToken: Auth.Token;
    }
}