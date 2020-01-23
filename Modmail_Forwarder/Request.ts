import { request as stdRequest } from 'https';
import { RequestOptions, ClientRequest } from 'http';
import { URL } from 'url';

export module Request {
    export interface RequestResult<T> {
        request: ClientRequest;
        response: Promise<T>
    };

    export interface RequestParams {
        /** Indicates whether to parse the received response as a JSON object (defaults to true) */
        parseJson: boolean;
    };

    interface RequestParamsNoParse extends RequestParams {
        parseJson: false;
    };

    export function get(url: string, param: RequestParamsNoParse): RequestResult<string>;
    export function get<TResponse>(url: string, param?: RequestParams): RequestResult<TResponse>;
    export function get<TResponse>(url: string, { parseJson = true } = {} as {
        parseJson: boolean;
    }) {
        return Request.request({ method: "GET", url, parseJson });
    }

    export function post(url: string, param: RequestParamsNoParse): RequestResult<string>;
    export function post<TResponse>(url: string, param?: RequestParams): RequestResult<TResponse>;
    export function post(url: string, { parseJson = true } = {}) {
        return Request.request({ url, method: "POST", parseJson });
    };

    export function request<TResponse>({ url = null as string, method = null as string, parseJson = true } = {}) {
        let urlObj = new URL(url);
        let { request, response } = requester({

            path: urlObj.pathname,
            hostname: urlObj.hostname,
            host: urlObj.host,
            protocol: urlObj.protocol,
            method: method
        });

        let result = parseJson ? response.then(x => JSON.parse(x) as TResponse) : response as any as Promise<TResponse>;
        
        return { request, response: result };
    }

    const requester = (options: RequestOptions): ({ request: ClientRequest, response: Promise<string> }) => {
        let request = null as ClientRequest;
        let response = new Promise<string>((resolve, reject) => {
            try {
                request = stdRequest(options, message => {

                    let content = '';
                    message.on("data", chunk => void (content += chunk.toString()));
                    message.on("end", () => {
                        if (utils(Number).between(message.statusCode, 200, 300)) {
                            resolve(content);
                        }
                        else if (content)
                            reject(content);
                        else
                            reject(`${options.method.toUpperCase()} request to '${request.path}' failed with status code ${message.statusCode}`);
                    });
                });

                request.end();
            }
            catch (err) {
                reject(err);
            }

            if (options.timeout) {
                setTimeout(() => reject(`${options.method.toUpperCase()} request to '${request.path}' failed due to timeout`), options.timeout);
            }
        })

        return {
            request,
            response
        };
    }
}