"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdalSilentTokenAcquisitionError_1 = require("../../AdalSilentTokenAcquisitionError");
const Constants_1 = require("../../Constants");
const AcquireTokenHandlerBase_1 = require("../../flows/AcquireTokenHandlerBase");
const BrokerParameter_1 = require("../../flows/BrokerParameter");
const UserIdentifier_1 = require("../../UserIdentifier");
const TokenCacheKey_1 = require("../cache/TokenCacheKey");
class AcquireTokenSilentHandler extends AcquireTokenHandlerBase_1.AcquireTokenHandlerBase {
    constructor(requestData, userId, parameters) {
        super(requestData);
        if (!userId) {
            throw new Error(Constants_1.AdalErrorMessage.specifyAnyUser);
        }
        requestData.subjectType = requestData.clientKey.hasCredential
            ? TokenCacheKey_1.TokenSubjectType.UserPlusClient
            : TokenCacheKey_1.TokenSubjectType.User;
        this.uniqueId = userId.uniqueId;
        this.displayableId = userId.displayableId;
        this.userIdentifierType = userId.type;
        this.supportADFS = true;
        this.brokerParameters.set(BrokerParameter_1.BrokerParameter.username, userId.id);
        this.brokerParameters.set(BrokerParameter_1.BrokerParameter.usernameType, UserIdentifier_1.UserIdentifierType[userId.type]);
        this.brokerParameters.set(BrokerParameter_1.BrokerParameter.silentBrokerFlow, null);
    }
    sendTokenRequestAsync() {
        if (!this.resultEx) {
            const msg = "No token matching arguments found in the cache";
            this.callState.logger.verbose(msg);
            this.callState.logger.verbosePii(msg);
            throw new AdalSilentTokenAcquisitionError_1.AdalSilentTokenAcquisitionException();
        }
        throw new AdalSilentTokenAcquisitionError_1.AdalSilentTokenAcquisitionException(this.resultEx.error);
    }
    addAdditionalRequestParameters(requestParameters) {
    }
}
exports.AcquireTokenSilentHandler = AcquireTokenSilentHandler;
//# sourceMappingURL=AcquireTokenSilentHandler.js.map