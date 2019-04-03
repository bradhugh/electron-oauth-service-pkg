"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdalLogger {
    constructor(correlationId) {
        this.correlationId = correlationId;
    }
    error(messageScrubbed) {
        console.log(messageScrubbed);
    }
    errorPii(messageWithPii) {
        console.log(messageWithPii);
    }
    errorExPii(exWithPii) {
        console.log(exWithPii);
    }
    errorExPiiWithPrefix(exWithPii, prefix) {
        console.log(exWithPii);
    }
    warning(messageScrubbed) {
        console.log(messageScrubbed);
    }
    warningPii(messageWithPii) {
        console.log(messageWithPii);
    }
    warningExPii(exWithPii) {
        console.log(exWithPii);
    }
    warningExPiiWithPrefix(exWithPii, prefix) {
        console.log(exWithPii);
    }
    info(messageScrubbed) {
        console.log(messageScrubbed);
    }
    infoPii(messageWithPii) {
        console.log(messageWithPii);
    }
    infoExPii(exWithPii) {
        console.log(exWithPii);
    }
    infoExPiiWithPrefix(exWithPii, prefix) {
        console.log(exWithPii);
    }
    verbose(messageScrubbed) {
        console.log(messageScrubbed);
    }
    verbosePii(messageWithPii) {
        console.log(messageWithPii);
    }
}
exports.AdalLogger = AdalLogger;
//# sourceMappingURL=AdalLogger.js.map