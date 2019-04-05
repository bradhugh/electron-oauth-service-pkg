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
const electron_oauth_helper_1 = require("electron-oauth-helper");
const querystring = require("querystring");
const uuidv4 = require("uuid/v4");
const AuthenticationResult_1 = require("./AuthenticationResult");
const AuthenticationResultEx_1 = require("./AuthenticationResultEx");
const TokenCacheKey_1 = require("./internal/cache/TokenCacheKey");
class Utils {
    static newGuid() {
        return uuidv4();
    }
    static delay(milliseconds) {
        return new Promise((resolve, _reject) => {
            setTimeout(resolve, milliseconds);
        });
    }
    static tokenTimeToJsDate(time) {
        if (!time) {
            return null;
        }
        const secs = parseInt(time, 10);
        const jan11970 = Date.UTC(1970, 1, 1, 0, 0, 0, 0);
        const date = new Date(jan11970 + (secs * 1000));
        return date;
    }
    static refreshAccessTokenAsync(url, authority, resource, clientId, resultEx, tokenCache, callState) {
        return __awaiter(this, void 0, void 0, function* () {
            const postResponse = yield Utils.postRequestAsync(url, {
                grant_type: "refresh_token",
                refresh_token: resultEx.refreshToken,
                scope: "openid",
                resource,
                client_id: clientId,
            });
            if (postResponse.statusCode !== 200) {
                callState.logger.error("refreshAccessTokenAsync: FAILED RESPONSE:");
                callState.logger.errorPii(postResponse.body.toString("utf8"));
                throw new Error(`Failed to refresh token. Error: ${postResponse.statusCode} - ${postResponse.statusMessage}`);
            }
            const responseString = postResponse.body.toString("utf8");
            callState.logger.verbosePii("****POST RESPONSE****");
            callState.logger.verbosePii(responseString);
            const response = JSON.parse(responseString);
            resultEx.result = new AuthenticationResult_1.AuthenticationResult(response.token_type, response.access_token, Utils.tokenTimeToJsDate(response.expires_on), null);
            if (!response.refresh_token) {
                callState.logger.info("Refresh token was missing from the token refresh response, " +
                    "so the refresh token in the request is returned instead");
            }
            else {
                resultEx.refreshToken = response.refresh_token;
            }
            tokenCache.storeToCacheAsync(resultEx, authority, resource, clientId, TokenCacheKey_1.TokenSubjectType.Client, callState);
            return resultEx;
        });
    }
    static getAuthTokenInteractiveAsync(authority, authorizeUrl, accessTokenUrl, clientId, redirectUri, tenantId, resourceId, tokenCache, callState) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                authorize_url: authorizeUrl,
                access_token_url: accessTokenUrl,
                client_id: clientId,
                resource: resourceId,
                response_type: "code",
                redirect_uri: redirectUri,
            };
            const provider = new electron_oauth_helper_1.OAuth2Provider(config);
            let authWindow = new electron_1.BrowserWindow({
                width: 600,
                height: 800,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                },
            });
            try {
                const response = yield provider.perform(authWindow);
                const expiresInSeconds = parseInt(response.expires_in.toString(), 10);
                let extExpiresInSeconds = parseInt(response.ext_expires_in.toString(), 10);
                if (extExpiresInSeconds < expiresInSeconds) {
                    callState.logger.info(`ExtendedExpiresIn(${extExpiresInSeconds}) is less than ` +
                        `ExpiresIn(${expiresInSeconds}). Set ExpiresIn as ExtendedExpiresIn`);
                    extExpiresInSeconds = expiresInSeconds;
                }
                const now = new Date();
                const expiresIn = new Date(now.getTime() + (expiresInSeconds * 1000));
                const extExpiresIn = new Date(now.getTime() + (extExpiresInSeconds * 1000));
                const result = new AuthenticationResult_1.AuthenticationResult(response.token_type, response.access_token, expiresIn, extExpiresIn);
                const exResult = new AuthenticationResultEx_1.AuthenticationResultEx();
                exResult.result = result;
                exResult.refreshToken = response.refresh_token;
                exResult.error = null;
                tokenCache.storeToCacheAsync(exResult, authority, resourceId, clientId, TokenCacheKey_1.TokenSubjectType.Client, callState);
                return exResult;
            }
            finally {
                authWindow.close();
                authWindow = null;
            }
        });
    }
    static postRequestAsync(url, parameters) {
        return new Promise((resolve, reject) => {
            const postData = querystring.stringify(parameters);
            const request = electron_1.net.request({
                url,
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": Buffer.byteLength(postData),
                },
            });
            request.on("response", (response) => {
                const datas = [];
                response.on("data", (chunk) => {
                    datas.push(chunk);
                });
                response.on("end", () => {
                    const body = Buffer.concat(datas);
                    const resp = {
                        headers: response.headers,
                        statusCode: response.statusCode,
                        statusMessage: response.statusMessage,
                        body,
                    };
                    resolve(resp);
                });
                response.on("error", (error) => {
                    reject(error);
                });
            });
            request.write(postData, "utf8");
            request.end();
        });
    }
    static trimStart(input, character) {
        const exp = new RegExp(`^[${Utils.escapeRegExp(character)}]+`, "g");
        return input.replace(exp, "");
    }
    static trimEnd(input, character) {
        const exp = new RegExp(`[${Utils.escapeRegExp(character)}]+$`, "g");
        return input.replace(exp, "");
    }
    static trim(input, character) {
        input = this.trimStart(input, character);
        input = this.trimEnd(input, character);
        return input;
    }
    static escapeRegExp(input) {
        return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}
Utils.guidEmpty = "00000000-0000-0000-0000-000000000000";
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map