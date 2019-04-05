"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils");
class EncodingHelper {
    static parseKeyValueListStrict(input, delimiter, urlDecode, lowercaseKeys, requestContext) {
        return EncodingHelper.parseKeyValueList(input, delimiter, urlDecode, lowercaseKeys, requestContext, true);
    }
    static urlDecode(message) {
        if (!message) {
            return message;
        }
        message = message.replace("+", "%20");
        message = unescape(message);
        return message;
    }
    static urlEncode(message) {
        if (!message) {
            return null;
        }
        return escape(message);
    }
    static splitWithQuotes(input, delimiter) {
        const items = [];
        if (!input) {
            return items;
        }
        let startIndex = 0;
        let insideString = false;
        let item = null;
        for (let i = 0; i < input.length; i++) {
            if (input[i] === delimiter && !insideString) {
                item = input.substring(startIndex, i - startIndex);
                if (item.trim()) {
                    items.push(item);
                }
                startIndex = i + 1;
            }
            else if (input[i] === '"') {
                insideString = !insideString;
            }
        }
        item = input.substring(startIndex);
        if (item.trim()) {
            items.push(item);
        }
        return items;
    }
    static addKeyValueString(messageBuilder, key, value) {
        const delimiter = (messageBuilder.length === 0) ? "" : "&";
        messageBuilder += `${delimiter}${key}=`;
        messageBuilder += value;
        return messageBuilder;
    }
    static deserializeResponse(response) {
        if (!response) {
            return null;
        }
        return JSON.parse(response);
    }
    static parseKeyValueList(input, delimiter, urlDecode, lowercaseKeys, requestContext, strict) {
        const response = {};
        const queryPairs = EncodingHelper.splitWithQuotes(input, delimiter);
        for (const queryPair of queryPairs) {
            const pair = EncodingHelper.splitWithQuotes(queryPair, "=");
            if (pair.length === 2 && pair[0] && pair[1]) {
                let key = pair[0];
                let value = pair[1];
                if (urlDecode) {
                    key = EncodingHelper.urlDecode(key);
                    value = EncodingHelper.urlDecode(value);
                }
                if (lowercaseKeys) {
                    key = key.trim().toLowerCase();
                }
                value = value.trim();
                value = Utils_1.Utils.trim(value, '\"').trim();
                if (response[key] && requestContext != null) {
                    requestContext.logger.warning(`Key/value pair list contains redundant key '${key}'.`);
                }
                response[key] = value;
            }
            else if (strict && pair.length > 2) {
                throw new Error("Invalid Argument: input");
            }
        }
        return response;
    }
}
exports.EncodingHelper = EncodingHelper;
//# sourceMappingURL=EncodingHelper.js.map