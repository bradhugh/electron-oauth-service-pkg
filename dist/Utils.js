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
const electron_oauth_helper_1 = require("electron-oauth-helper");
const TokenCache_1 = require("./cache/TokenCache");
const AuthenticationResult_1 = require("./AuthenticationResult");
class Utils {
    static tokenTimeToJsDate(time) {
        if (!time) {
            return null;
        }
        const secs = parseInt(time);
        const jan11970 = Date.UTC(1970, 1, 1, 0, 0, 0, 0);
        const date = new Date(jan11970 + (secs * 1000));
        return date;
    }
    static refreshAccessTokenAsync(url, authority, resource, clientId, resultEx, tokenCache) {
        return __awaiter(this, void 0, void 0, function* () {
            const postResponse = yield Utils.postRequestAsync(url, {
                grant_type: "refresh_token",
                refresh_token: resultEx.refreshToken,
                scope: "openid",
                resource: resource,
                client_id: clientId,
            });
            if (postResponse.statusCode !== 200) {
                throw new Error(`Failed to refresh token. Error: ${postResponse.statusCode} - ${postResponse.statusMessage}`);
            }
            const responseString = postResponse.body.toString('utf8');
            const response = JSON.parse(responseString);
            resultEx.result = new AuthenticationResult_1.AuthenticationResult(response.token_type, response.access_token, Utils.tokenTimeToJsDate(response.expires_on), null);
            if (!response.refresh_token) {
                console.log("Refresh token was missing from the token refresh response, so the refresh token in the request is returned instead");
            }
            else {
                resultEx.refreshToken = response.refresh_token;
            }
            tokenCache.storeToCache(resultEx, authority, resource, clientId, TokenCache_1.TokenSubjectType.Client);
            return resultEx;
        });
    }
    static getAuthTokenInteractiveAsync(authority, authorizeUrl, accessTokenUrl, clientId, redirectUri, tenantId, resourceId, scope, tokenCache) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                authorize_url: authorizeUrl,
                access_token_url: accessTokenUrl,
                client_id: clientId,
                scope: `https://${tenantId}/${resourceId}/${scope}`,
                response_type: "code",
                redirect_uri: redirectUri,
            };
            const provider = new electron_oauth_helper_1.OAuth2Provider(config);
            let authWindow = new electron_1.BrowserWindow({
                width: 600,
                height: 800,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true
                },
            });
            try {
                const response = yield provider.perform(authWindow);
                const result = new AuthenticationResult_1.AuthenticationResult(response.token_type, response.access_token, Utils.tokenTimeToJsDate(response.expires_on), null);
                const exResult = new AuthenticationResult_1.AuthenticationResultEx();
                exResult.result = result;
                exResult.refreshToken = response.refresh_token;
                exResult.error = null;
                tokenCache.storeToCache(exResult, authority, resourceId, clientId, TokenCache_1.TokenSubjectType.Client);
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
                    "Content-Length": Buffer.byteLength(postData)
                }
            });
            request.on("response", response => {
                const datas = [];
                response.on("data", chunk => {
                    datas.push(chunk);
                });
                response.on("end", () => {
                    const body = Buffer.concat(datas);
                    const resp = {
                        headers: response.headers,
                        statusCode: response.statusCode,
                        statusMessage: response.statusMessage,
                        body: body,
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
}
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map