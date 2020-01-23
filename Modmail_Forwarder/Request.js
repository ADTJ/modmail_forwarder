"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const url_1 = require("url");
var Request;
(function (Request) {
    ;
    ;
    ;
    function get(url, { parseJson = true } = {}) {
        return Request.request({ method: "GET", url, parseJson });
    }
    Request.get = get;
    function post(url, { parseJson = true } = {}) {
        return Request.request({ url, method: "POST", parseJson });
    }
    Request.post = post;
    ;
    function request({ url = null, method = null, parseJson = true } = {}) {
        let urlObj = new url_1.URL(url);
        let { request, response } = requester({
            path: urlObj.pathname,
            hostname: urlObj.hostname,
            host: urlObj.host,
            protocol: urlObj.protocol,
            method: method
        });
        let result = parseJson ? response.then(x => JSON.parse(x)) : response;
        return { request, response: result };
    }
    Request.request = request;
    const requester = (options) => {
        let request = null;
        let response = new Promise((resolve, reject) => {
            try {
                request = https_1.request(options, message => {
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
        });
        return {
            request,
            response
        };
    };
})(Request = exports.Request || (exports.Request = {}));
//# sourceMappingURL=Request.js.map