"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EncodingHelper_1 = require("../helpers/EncodingHelper");
const OAuthConstants_1 = require("./oauth2/OAuthConstants");
class DictionaryRequestParameters extends Map {
    constructor(resource, clientKey) {
        super();
        if (resource) {
            this.set(OAuthConstants_1.OAuthParameter.resource, resource);
        }
        clientKey.addToParameters(this);
    }
    toString() {
        let messageBuilder = "";
        for (const kvp of this.entries()) {
            messageBuilder = EncodingHelper_1.EncodingHelper.addKeyValueString(messageBuilder, EncodingHelper_1.EncodingHelper.urlEncode(kvp["0"]), EncodingHelper_1.EncodingHelper.urlEncode(kvp["1"]));
        }
        if (this.extraQueryParameter != null) {
            messageBuilder += "&" + this.extraQueryParameter;
        }
        return messageBuilder;
    }
}
exports.DictionaryRequestParameters = DictionaryRequestParameters;
class StringRequestParameters {
    StringRequestParameters(stringBuilderParameter) {
        this.parameter = stringBuilderParameter;
    }
    toString() {
        return this.parameter;
    }
}
exports.StringRequestParameters = StringRequestParameters;
//# sourceMappingURL=RequestParameters.js.map