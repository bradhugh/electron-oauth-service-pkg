"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv4 = require("uuid/v4");
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