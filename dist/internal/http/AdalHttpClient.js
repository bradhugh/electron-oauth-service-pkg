"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdalClaimChallengeError_1 = require("../../AdalClaimChallengeError");
const AdalErrorCode_1 = require("../../AdalErrorCode");
const AdalServiceError_1 = require("../../AdalServiceError");
const EncodingHelper_1 = require("../../helpers/EncodingHelper");
const Utils_1 = require("../../Utils");
const AdalIdHelper_1 = require("../helpers/AdalIdHelper");
const HttpRequestWrapperError_1 = require("../HttpRequestWrapperError");
const TokenResponse_1 = require("../oauth2/TokenResponse");
const HttpClientWrapper_1 = require("./HttpClientWrapper");
const HttpRequestAbortedError_1 = require("./HttpRequestAbortedError");
class AdalHttpClient {
    constructor(uri, callState) {
        this.callState = callState;
        this.resiliency = false;
        this.retryOnce = true;
        this.requestUri = AdalHttpClient.checkForExtraQueryParameter(uri);
        this.client = new HttpClientWrapper_1.HttpClientWrapper(this.requestUri, callState);
        this._callState = callState;
    }
    static checkForExtraQueryParameter(url) {
        const extraQueryParameter = null;
        const delimiter = (url.indexOf("?") > 0) ? "&" : "?";
        if (extraQueryParameter) {
            url += delimiter + extraQueryParameter;
        }
        return url;
    }
    async getResponseAsync(respondToDeviceAuthChallenge = true) {
        let typedResponse = null;
        let response;
        try {
            const adalIdHeaders = AdalIdHelper_1.AdalIdHelper.getAdalIdParameters();
            for (const kvp of adalIdHeaders.entries()) {
                this.client.headers.add(kvp["0"], kvp["1"]);
            }
            this.client.headers.add(AdalHttpClient.deviceAuthHeaderName, AdalHttpClient.deviceAuthHeaderValue);
            response = await this.client.getResponseAsync();
            typedResponse = EncodingHelper_1.EncodingHelper.deserializeResponse(response.responseString);
        }
        catch (error) {
            if (!(error instanceof HttpRequestWrapperError_1.HttpRequestWrapperError)) {
                throw error;
            }
            const ex = error;
            if (ex.innerError instanceof HttpRequestAbortedError_1.HttpRequestAbortedError) {
                this.resiliency = true;
                this._callState.logger.info(`Network timeout.`);
                this._callState.logger.infoPii(`Network timeout, Exception ${ex}`);
            }
            if (!this.resiliency && !ex.webResponse) {
                this._callState.logger.errorExPii(ex);
                throw new AdalServiceError_1.AdalServiceError(AdalErrorCode_1.AdalErrorCode.unknown, null, null, ex);
            }
            if (!this.resiliency && ex.webResponse.statusCode >= 500 && ex.webResponse.statusCode < 600) {
                this._callState.logger.info("HttpStatus code: " + ex.webResponse.statusCode + ", Exception type: <??>");
                this._callState.logger.infoPii("HttpStatus code: " + ex.webResponse.statusCode + ", Exception message: " +
                    ex.innerError ? ex.innerError.message : "");
                this.resiliency = true;
            }
            if (this.resiliency) {
                if (this.retryOnce) {
                    await Utils_1.Utils.delay(AdalHttpClient.delayTimePeriodMilliSeconds);
                    this.retryOnce = false;
                    const msg = "Retrying one more time..";
                    this._callState.logger.info(msg);
                    return await this.getResponseAsync(respondToDeviceAuthChallenge);
                }
                this._callState.logger.info("Retry Failed, Exception type: ???");
                this._callState.logger.infoPii("Retry Failed, Exception message: " + ex.innerError ? ex.innerError.message : "");
            }
            if (!this.isDeviceAuthChallenge(ex.webResponse, respondToDeviceAuthChallenge)) {
                const tokenResponse = TokenResponse_1.TokenResponse.createFromErrorResponse(ex.webResponse);
                const errorCodes = tokenResponse.errorCodes ?
                    tokenResponse.errorCodes : [ex.webResponse.statusCode.toString()];
                const serviceEx = new AdalServiceError_1.AdalServiceError(tokenResponse.error, tokenResponse.errorDescription, errorCodes, ex);
                if (ex.webResponse.statusCode === 400 &&
                    tokenResponse.error === AdalErrorCode_1.AdalErrorCode.interactionRequired) {
                    throw new AdalClaimChallengeError_1.AdalClaimChallengeException(tokenResponse.error, tokenResponse.errorDescription, ex, tokenResponse.claims);
                }
                throw serviceEx;
            }
            return await this.handleDeviceAuthChallengeAsync(ex.webResponse);
        }
        return typedResponse;
    }
    isDeviceAuthChallenge(response, respondToDeviceAuthChallenge) {
        return false;
    }
    ParseChallengeData(response) {
        const data = new Map();
        const authHeaders = response.headers.getValues(AdalHttpClient.wwwAuthenticateHeader);
        let wwwAuthenticate = authHeaders.length ? authHeaders[0] : "";
        wwwAuthenticate = wwwAuthenticate.substring(AdalHttpClient.pKeyAuthName.length + 1);
        const headerPairs = EncodingHelper_1.EncodingHelper.splitWithQuotes(wwwAuthenticate, ",");
        for (const pair of headerPairs) {
            const keyValue = EncodingHelper_1.EncodingHelper.splitWithQuotes(pair, "=");
            data.set(keyValue[0].trim(), keyValue[1].trim().replace("\"", ""));
        }
        return data;
    }
    async handleDeviceAuthChallengeAsync(response) {
        const responseDictionary = this.ParseChallengeData(response);
        if (!responseDictionary.has("SubmitUrl")) {
            responseDictionary.set("SubmitUrl", this.requestUri);
        }
        throw new Error("HandleDeviceAuthChallengeAsync not implemented");
        const respHeader = null;
        const rp = this.client.bodyParameters;
        this.client = new HttpClientWrapper_1.HttpClientWrapper(AdalHttpClient.checkForExtraQueryParameter(responseDictionary.get("SubmitUrl")), this.callState);
        this.client.bodyParameters = rp;
        this.client.headers.add("Authorization", respHeader);
        return await this.getResponseAsync(false);
    }
}
AdalHttpClient.deviceAuthHeaderName = "x-ms-PKeyAuth";
AdalHttpClient.deviceAuthHeaderValue = "1.0";
AdalHttpClient.wwwAuthenticateHeader = "WWW-Authenticate";
AdalHttpClient.pKeyAuthName = "PKeyAuth";
AdalHttpClient.delayTimePeriodMilliSeconds = 1000;
exports.AdalHttpClient = AdalHttpClient;
//# sourceMappingURL=AdalHttpClient.js.map