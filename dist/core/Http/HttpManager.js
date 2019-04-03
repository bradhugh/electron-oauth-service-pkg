"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    sendPostAsync(endpoint, headers, bodyParameters, requestContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const postData = querystring.stringify(bodyParameters);
            headers["content-type"] = "application/x-www-form-urlencoded";
            headers["content-length"] = Buffer.byteLength(postData).toString();
            const resp = yield this.requestCommonAsync(endpoint, "POST", headers, postData, requestContext);
            return resp;
        });
    }
    sendPostWithContentAsync(endpoint, headers, body, requestContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.requestCommonAsync(endpoint, "POST", headers, body, requestContext);
            return resp;
        });
    }
    sendGetAsync(endpoint, headers, requestContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.requestCommonAsync(endpoint, "GET", headers, null, requestContext);
            return resp;
        });
    }
    sendPostForceResponseAsync(endpoint, headers, body, requestContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.requestCommonAsync(endpoint, "POST", headers, body, requestContext);
            return resp;
        });
    }
    requestCommonAsync(url, method, headers, body, _requestContext) {
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