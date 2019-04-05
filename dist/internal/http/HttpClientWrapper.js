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
const HttpHeaderCollection_1 = require("./HttpHeaderCollection");
class HttpClientWrapper {
    constructor(uri, callState) {
        this._timeoutInMilliSeconds = 30000;
        this._maxResponseSizeInBytes = 1048576;
        this.uri = uri;
        this.headers = new HttpHeaderCollection_1.HttpHeaderCollection();
        this.callState = callState;
    }
    static createResponseAsync(response) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("HttpClientWrapper.createResponseAsync NOT IMPLEMENTED");
        });
    }
    get timeoutInMilliSeconds() {
        return this._timeoutInMilliSeconds;
    }
    set timeoutInMilliSeconds(value) {
        this._timeoutInMilliSeconds = value;
    }
    getResponseAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("HttpClientWrapper.getResponseAsync NOT IMPLEMENTED");
        });
    }
}
exports.HttpClientWrapper = HttpClientWrapper;
//# sourceMappingURL=HttpClientWrapper.js.map