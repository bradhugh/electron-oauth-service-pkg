"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CoreLoggerBase_1 = require("./core/CoreLoggerBase");
const HttpManager_1 = require("./core/Http/HttpManager");
const EncodingHelper_1 = require("./helpers/EncodingHelper");
const CallState_1 = require("./internal/CallState");
const Utils_1 = require("./Utils");
class AuthenticationParameters {
    constructor(httpManager) {
        this.httpManager = httpManager;
        this.authority = null;
        this.resource = null;
    }
    createFromResourceUrlAsync(resourceUrl) {
        return this.createFromResourceUrlCommonAsync(resourceUrl);
    }
    createFromResponseAuthenticateHeader(authenticateHeader) {
        if (!authenticateHeader) {
            throw new Error("authenticateHeader cannot be null");
        }
        authenticateHeader = authenticateHeader.trim();
        if (!authenticateHeader.toLowerCase().startsWith(AuthenticationParameters.bearer)
            || authenticateHeader.length < AuthenticationParameters.bearer.length + 2
            || authenticateHeader[AuthenticationParameters.bearer.length] !== " ") {
            const ex = new Error("AdalErrorMessage.InvalidAuthenticateHeaderFormat authenticateHeader");
            CoreLoggerBase_1.CoreLoggerBase.default.error("AdalErrorMessage.InvalidAuthenticateHeaderFormat");
            CoreLoggerBase_1.CoreLoggerBase.default.errorExPii(ex);
            throw ex;
        }
        authenticateHeader = authenticateHeader.substring(AuthenticationParameters.bearer.length).trim();
        let authenticateHeaderItems = null;
        try {
            authenticateHeaderItems = EncodingHelper_1.EncodingHelper.parseKeyValueListStrict(authenticateHeader, ",", false, true, null);
        }
        catch (error) {
            const newEx = new Error("AdalErrorMessage.InvalidAuthenticateHeaderFormat: authenticateHeader");
            CoreLoggerBase_1.CoreLoggerBase.default.error("AdalErrorMessage.InvalidAuthenticateHeaderFormat");
            CoreLoggerBase_1.CoreLoggerBase.default.errorExPii(newEx);
            throw newEx;
        }
        const authParams = new AuthenticationParameters(this.httpManager);
        let param;
        param = authenticateHeaderItems.get(AuthenticationParameters.authorityKey);
        authParams.authority = !param ? null : param;
        param = authenticateHeaderItems.get(AuthenticationParameters.resourceKey);
        authParams.resource = !param ? null : param;
        return authParams;
    }
    async createFromResourceUrlCommonAsync(resourceUrl) {
        if (resourceUrl == null) {
            throw new Error("resourceUrl cannot be null");
        }
        const authParams = null;
        try {
            await this.httpManager.sendGetAsync(resourceUrl.href, null, new CallState_1.CallState(Utils_1.Utils.guidEmpty));
            const ex = new Error("AdalError.UnauthorizedResponseExpected");
            CoreLoggerBase_1.CoreLoggerBase.default.errorExPii(ex);
            throw ex;
        }
        catch (error) {
            if (!(error instanceof HttpManager_1.HttpError)) {
                throw error;
            }
            const httpError = error;
            if (httpError) {
                const response = httpError.response;
                if (response == null) {
                    const serviceEx = new Error("AdalErrorMessage.UnauthorizedHttpStatusCodeExpected");
                    CoreLoggerBase_1.CoreLoggerBase.default.errorExPii(serviceEx);
                    throw serviceEx;
                }
                throw new Error("Not implemented");
            }
            else {
                throw error;
            }
        }
        return authParams;
    }
    createFromUnauthorizedResponseCommon(response) {
        if (response == null) {
            throw new Error("response should not be null here");
        }
        const authParams = null;
        if (response.statusCode === 401) {
            if (response.headers[AuthenticationParameters.authenticateHeader]) {
                throw new Error("Not implemented");
            }
            else {
                const ex = new Error("AdalErrorMessage.MissingAuthenticateHeader");
                CoreLoggerBase_1.CoreLoggerBase.default.errorExPii(ex);
                throw ex;
            }
        }
        else {
            const ex = new Error("AdalErrorMessage.UnauthorizedHttpStatusCodeExpected");
            CoreLoggerBase_1.CoreLoggerBase.default.errorExPii(ex);
            throw ex;
        }
        return authParams;
    }
}
AuthenticationParameters.authenticateHeader = "WWW-Authenticate";
AuthenticationParameters.bearer = "bearer";
AuthenticationParameters.authorityKey = "authorization_uri";
AuthenticationParameters.resourceKey = "resource_id";
exports.AuthenticationParameters = AuthenticationParameters;
//# sourceMappingURL=AuthenticationParameters.js.map