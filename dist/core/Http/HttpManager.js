"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const querystring = require("querystring");
class HttpError extends Error {
    constructor(message, response) {
        super(message);
        this.response = response;
    }
}
exports.HttpError = HttpError;
class HttpManager {
    async sendPostAsync(endpoint, headers, bodyParameters, callState) {
        const postData = querystring.stringify(bodyParameters);
        headers["content-type"] = "application/x-www-form-urlencoded";
        headers["content-length"] = Buffer.byteLength(postData).toString();
        const resp = await this.requestCommonAsync(endpoint, "POST", headers, postData, callState);
        return resp;
    }
    async sendPostWithContentAsync(endpoint, headers, body, callState) {
        const resp = await this.requestCommonAsync(endpoint, "POST", headers, body, callState);
        return resp;
    }
    async sendGetAsync(endpoint, headers, callState) {
        const resp = await this.requestCommonAsync(endpoint, "GET", headers, null, callState);
        return resp;
    }
    async sendPostForceResponseAsync(endpoint, headers, body, callState) {
        const resp = await this.requestCommonAsync(endpoint, "POST", headers, body, callState);
        return resp;
    }
    requestCommonAsync(url, method, headers, body, callState) {
        return new Promise((resolve, reject) => {
            const request = electron_1.net.request({
                url,
                method,
                headers,
            });
            request.on("response", (response) => {
                const datas = [];
                response.on("data", (chunk) => {
                    datas.push(chunk);
                });
                response.on("end", () => {
                    const bodyBuffer = Buffer.concat(datas);
                    const resp = {
                        headers: response.headers,
                        statusCode: response.statusCode,
                        body: bodyBuffer.toString("utf8"),
                    };
                    if (response.statusCode >= 400) {
                        return reject(new HttpError(`HTTP request failed with status ${response.statusCode}`, resp));
                    }
                    return resolve(resp);
                });
                response.on("error", (error) => {
                    return reject(error);
                });
            });
            if (body) {
                request.write(body, "utf8");
            }
            request.end();
        });
    }
}
exports.HttpManager = HttpManager;
//# sourceMappingURL=HttpManager.js.map