"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpHeaderCollection {
    constructor() {
        this.headerDictionary = new Map();
    }
    get(headerName) {
        const values = this.getValues(headerName);
        return values.join(",");
    }
    getValues(headerName) {
        if (!headerName) {
            return [];
        }
        const headerKey = headerName.toLowerCase();
        const values = this.headerDictionary.get(headerKey);
        return values ? values : [];
    }
    getFirst(headerName) {
        if (!headerName) {
            return "";
        }
        const values = this.getValues(headerName);
        if (values.length) {
            return values[0];
        }
        return "";
    }
    contains(headerName) {
        if (!headerName) {
            return false;
        }
        return this.headerDictionary.has(headerName.toLowerCase());
    }
    add(headerName, headerValue) {
        if (!headerName) {
            throw new Error("headerName must not be null");
        }
        const headerKey = headerName.toLowerCase();
        const values = this.headerDictionary.get(headerKey);
        if (!values) {
            this.headerDictionary.set(headerKey, [headerValue]);
        }
        else {
            values.push(headerValue);
            this.headerDictionary.set(headerKey, values);
        }
    }
}
exports.HttpHeaderCollection = HttpHeaderCollection;
//# sourceMappingURL=HttpHeaderCollection.js.map