import { request as stdRequest } from 'https';
import { RequestOptions, ClientRequest, OutgoingHttpHeaders } from 'http';
import { URL } from 'url';

export module Request {
    export interface RequestResult<T> {
        request: ClientRequest;
        response: Promise<T>
    };

    export interface RequestParams {
        /** Indicates whether to parse the received response as a JSON object (defaults to true) */
        parseJson: boolean;
        /** Any headers that should be added to the request */
        headers?: [string, string][];
    };

    export interface ExtendedRequestParams extends RequestParams {
        body?: any;
        method: string;
        headers?: [string, string][];
        url: string;
    }

    interface RequestParamsNoParse extends RequestParams {
        parseJson: false;
    };

    export function get(url: string, param: RequestParamsNoParse): RequestResult<string>;
    export function get<TResponse>(url: string, param?: RequestParams): RequestResult<TResponse>;
    export function get<TResponse>(url: string, params?: RequestParams) {
        return Request.request({ method: "GET", url, ...params });
    }

    export function post(url: string, body: any, param: RequestParamsNoParse): RequestResult<string>;
    export function post<TResponse>(url: string, body: any, param?: RequestParams): RequestResult<TResponse>;
    export function post(url: string, body: any, params?: RequestParams) {
        return Request.request({ url, method: "POST", ...params, body });
    };

    export function request<TResponse>({ url = null as string, method = null as string, parseJson = true, body = null as any, headers = null as [string, string][] } = {} as ExtendedRequestParams) {
        let urlObj = new URL(url);
        let { request, response } = requester({

            path: urlObj.pathname,
            hostname: urlObj.hostname,
            host: urlObj.host,
            protocol: urlObj.protocol,
            method: method,
            headers: headers?.reduce((obj, [key, value]) => (obj[key] = value, obj), Object.create(null) as OutgoingHttpHeaders)
            
        }, body);

        let result = parseJson ? response.then(x => JSON.parse(x) as TResponse) : response as any as Promise<TResponse>;
        
        return { request, response: result };
    }

    const requester = (options: RequestOptions, body?: any): ({ request: ClientRequest, response: Promise<string> }) => {
        let request = null as ClientRequest;
        if (!("User-Agent" in options.headers))
            options.headers["User-Agent"] = "script:nytBls0ShM9Rkg:0.1 (by /u/daxianj)";

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

                if (body) {
                    if (typeof body !== "string" && !(body instanceof Buffer))
                        body = JSON.stringify(body);

                    request.write(body);
                }

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