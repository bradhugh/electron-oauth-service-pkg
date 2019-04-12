"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpHeaderCollection {
    constructor() {
        this.headerDictionary = new Map();
    }
    static fromElectronHeaders(headers) {
        const result = new HttpHeaderCollection();
        const keys = Object.keys(headers);
        for (const key of keys) {
            result.headerDictionary.set(key, headers[key]);
        }
        return result;
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
    getAllEntries() {
        const entries = [];
        for (const kvp of this.headerDictionary) {
            const headerValues = kvp["1"];
            if (headerValues) {
                for (const value of headerValues) {
                    entries.push({ name: kvp["0"], value });
                }
            }
        }
        return entries;
    }
}
exports.HttpHeaderCollection = HttpHeaderCollection;
//# sourceMappingURL=HttpHeaderCollection.js.map