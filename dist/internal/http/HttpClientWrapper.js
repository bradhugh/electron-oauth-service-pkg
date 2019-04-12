"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const Utils_1 = require("../../Utils");
const HttpRequestWrapperError_1 = require("../HttpRequestWrapperError");
const OAuthConstants_1 = require("../oauth2/OAuthConstants");
const RequestParameters_1 = require("../RequestParameters");
const HttpHeaderCollection_1 = require("./HttpHeaderCollection");
const HttpRequestAbortedError_1 = require("./HttpRequestAbortedError");
class HttpClientWrapper {
    constructor(uri, callState) {
        this._timeoutInMilliSeconds = 30000;
        this.uri = uri;
        this.headers = new HttpHeaderCollection_1.HttpHeaderCollection();
        this.callState = callState;
    }
    get timeoutInMilliSeconds() {
        return this._timeoutInMilliSeconds;
    }
    set timeoutInMilliSeconds(value) {
        this._timeoutInMilliSeconds = value;
    }
    async getResponseAsync() {
        const method = this.bodyParameters ? "POST" : "GET";
        let effectiveContentType = null;
        let bodyContent = null;
        if (this.bodyParameters) {
            if (this.bodyParameters instanceof RequestParameters_1.StringRequestParameters) {
                bodyContent = this.bodyParameters.toString();
                effectiveContentType = this.contentType;
            }
            else {
                bodyContent = this.bodyParameters.toString();
                effectiveContentType = "application/x-www-form-urlencoded";
            }
        }
        const addCorrelationId = this.callState && this.callState.correlationId
            && this.callState.correlationId !== Utils_1.Utils.guidEmpty;
        const webResponse = await this.electronRequestAsync(method, effectiveContentType, bodyContent, addCorrelationId);
        if (webResponse.statusCode >= 400) {
            throw new HttpRequestWrapperError_1.HttpRequestWrapperError(webResponse, new Error(`HTTP request failed with status ${webResponse.statusCode}`));
        }
        if (addCorrelationId) {
            this.verifyCorrelationIdHeaderInReponse(webResponse.headers);
        }
        return webResponse;
    }
    async electronRequestAsync(method, contentType, bodyContent, addCorrelationId) {
        return new Promise((resolve, reject) => {
            const request = electron.net.request({
                url: this.uri,
                method,
                headers: {
                    Accept: this.accept ? this.accept : "application/json",
                },
                timeout: this.timeoutInMilliSeconds,
            });
            if (bodyContent && contentType) {
                request.setHeader("Content-Type", contentType);
                request.setHeader("Content-Length", Buffer.byteLength(bodyContent));
            }
            for (const header of this.headers.getAllEntries()) {
                request.setHeader(header.name, header.value);
            }
            if (addCorrelationId) {
                request.setHeader(OAuthConstants_1.OAuthHeader.correlationId, this.callState.correlationId);
                request.setHeader(OAuthConstants_1.OAuthHeader.requestCorrelationIdInResponse, "true");
            }
            request.on("response", (response) => {
                const datas = [];
                response.on("data", (chunk) => {
                    datas.push(chunk);
                });
                response.on("end", () => {
                    const body = Buffer.concat(datas);
                    const resp = {
                        headers: HttpHeaderCollection_1.HttpHeaderCollection.fromElectronHeaders(response.headers),
                        statusCode: response.statusCode,
                        responseString: body.toString("utf8"),
                    };
                    resolve(resp);
                });
                response.on("error", (error) => {
                    const ex = new HttpRequestWrapperError_1.HttpRequestWrapperError(null, error);
                    reject(ex);
                });
                response.on("aborted", () => {
                    const ex = new HttpRequestWrapperError_1.HttpRequestWrapperError(null, new HttpRequestAbortedError_1.HttpRequestAbortedError());
                    reject(ex);
                });
            });
            if (bodyContent) {
                request.write(bodyContent, "utf8");
            }
            request.end();
        });
    }
    verifyCorrelationIdHeaderInReponse(headers) {
        const headerEntries = headers.getAllEntries();
        for (const header of headerEntries) {
            const reponseHeaderKey = header.name;
            const trimmedKey = reponseHeaderKey.trim();
            if (trimmedKey.toLowerCase() === OAuthConstants_1.OAuthHeader.correlationId) {
                const correlationIdHeader = headers.getFirst(trimmedKey).trim();
                if (correlationIdHeader !== this.callState.correlationId) {
                    const msg = `Returned correlation id '${correlationIdHeader}' does not match ` +
                        `the sent correlation id '${this.callState.correlationId}'`;
                    this.callState.logger.warning(msg);
                    this.callState.logger.warningPii(msg);
                }
                break;
            }
        }
    }
}
exports.HttpClientWrapper = HttpClientWrapper;
//# sourceMappingURL=HttpClientWrapper.js.map