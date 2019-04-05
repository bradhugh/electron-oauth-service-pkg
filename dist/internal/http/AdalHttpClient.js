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
const EncodingHelper_1 = require("../../helpers/EncodingHelper");
const AdalIdHelper_1 = require("../helpers/AdalIdHelper");
const HttpClientWrapper_1 = require("./HttpClientWrapper");
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
    getResponseAsync(respondToDeviceAuthChallenge = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let typedResponse = null;
            let response;
            try {
                const adalIdHeaders = AdalIdHelper_1.AdalIdHelper.getAdalIdParameters();
                for (const kvp of adalIdHeaders.entries()) {
                    this.client.headers.add(kvp["0"], kvp["1"]);
                }
                this.client.headers.add(AdalHttpClient.deviceAuthHeaderName, AdalHttpClient.deviceAuthHeaderValue);
                response = yield this.client.getResponseAsync();
                typedResponse = EncodingHelper_1.EncodingHelper.deserializeResponse(response.responseString);
            }
            catch (error) {
            }
            return typedResponse;
        });
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
    HandleDeviceAuthChallengeAsync(response) {
        return __awaiter(this, void 0, void 0, function* () {
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
            return yield this.getResponseAsync(false);
        });
    }
}
AdalHttpClient.deviceAuthHeaderName = "x-ms-PKeyAuth";
AdalHttpClient.deviceAuthHeaderValue = "1.0";
AdalHttpClient.wwwAuthenticateHeader = "WWW-Authenticate";
AdalHttpClient.pKeyAuthName = "PKeyAuth";
AdalHttpClient.delayTimePeriodMilliSeconds = 1000;
exports.AdalHttpClient = AdalHttpClient;
//# sourceMappingURL=AdalHttpClient.js.map