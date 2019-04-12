"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConsoleLogger {
    constructor(correlationId) {
        this.correlationId = correlationId;
        this.piiLoggingEnabled = true;
    }
    error(messageScrubbed) {
        console.log(`[ELOAS] [ERROR] ${messageScrubbed}`);
    }
    errorPii(messageWithPii) {
        if (this.piiLoggingEnabled) {
            console.log(`[ELOAS] [ERROR] ${messageWithPii}`);
        }
    }
    errorExPii(exWithPii) {
        if (this.piiLoggingEnabled) {
            console.log("[ELOAS] [ERROR]");
            console.log(exWithPii);
        }
    }
    errorExPiiWithPrefix(exWithPii, prefix) {
        if (this.piiLoggingEnabled) {
            console.log(`[ELOAS] [ERROR] ${prefix}`);
            console.log(exWithPii);
        }
    }
    warning(messageScrubbed) {
        console.log(`[ELOAS] [WARN] ${messageScrubbed}`);
    }
    warningPii(messageWithPii) {
        if (this.piiLoggingEnabled) {
            console.log(`[ELOAS] [WARN] ${messageWithPii}`);
        }
    }
    warningExPii(exWithPii) {
        if (this.piiLoggingEnabled) {
            console.log("[ELOAS] [WARN]");
            console.log(exWithPii);
        }
    }
    warningExPiiWithPrefix(exWithPii, prefix) {
        if (this.piiLoggingEnabled) {
            console.log(`[ELOAS] [WARN] ${prefix}`);
            console.log(exWithPii);
        }
    }
    info(messageScrubbed) {
        console.log(`[ELOAS] [INFO] ${messageScrubbed}`);
    }
    infoPii(messageWithPii) {
        if (this.piiLoggingEnabled) {
            console.log(`[ELOAS] [INFO] ${messageWithPii}`);
        }
    }
    infoExPii(exWithPii) {
        if (this.piiLoggingEnabled) {
            console.log("[ELOAS] [INFO]");
            console.log(exWithPii);
        }
    }
    infoExPiiWithPrefix(exWithPii, prefix) {
        if (this.piiLoggingEnabled) {
            console.log(`[ELOAS] [INFO] ${prefix}`);
            console.log(exWithPii);
        }
    }
    verbose(messageScrubbed) {
        console.log(`[ELOAS] [VERBOSE] ${messageScrubbed}`);
    }
    verbosePii(messageWithPii) {
        if (this.piiLoggingEnabled) {
            console.log(`[ELOAS] [VERBOSE] ${messageWithPii}`);
        }
    }
}
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=AdalLogger.js.map