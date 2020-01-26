import { Api } from "./api";
import { Request } from "../Request";
import { Forwarder } from "../Forwarder";

export module Message {

    export interface MessageRequest {
        api_type: "json";
        /** subreddit name */
        from_sr?: string;
        "g-recaptcha-response"?: any;
        /** a string no longer than 100 characters */
        subject: string;
        /** raw markdown text */
        text: string;
        /** the name of an existing user */
        to: string;
        /** a modhash (can also be provided via X-Modhash header) */
        uh?: string;
    }

    interface MessageResponse {
        json: {
            errors: any[];
        }
    }

    export async function send(apiParams: Api.Params, message: MessageRequest) {
        try {
            const endpoint = 'compose';
            let url = `${apiParams.url.split('/').filter(x => x).join('/')}/${endpoint}`;
            let { response } = Request.post<MessageResponse>(url, Request.formEncode(message), {
                parseJson: true,
                headers: [["Authorization", `Bearer ${apiParams.authToken.access_token}`]]
            });

            let result = await response;
            if (result?.json?.errors?.length > 0) {
                for (let error of result.json.errors)
                    console.error(error);

                throw new Error("One or more errors occurred in sending message");
            }

            console.log(result);
        }
        catch (err) {
            throw Object.assign(new Error("Failed to send message") as Forwarder.Error, { innerError: err });
        }
        
    }
}