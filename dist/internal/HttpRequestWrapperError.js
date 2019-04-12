"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpRequestWrapperError extends Error {
    constructor(webResponse, innerError) {
        super("HttpRequestWrapperError");
        this.webResponse = webResponse;
        this.innerError = innerError;
    }
}
exports.HttpRequestWrapperError = HttpRequestWrapperError;
//# sourceMappingURL=HttpRequestWrapperError.js.map