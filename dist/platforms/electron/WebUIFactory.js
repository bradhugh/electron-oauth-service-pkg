"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PromptBehavior_1 = require("../../features/electron/PromptBehavior");
const InteractiveWebUI_1 = require("./InteractiveWebUI");
class WebUIFactory {
    createAuthenticationDialog(inputParameters) {
        const parameters = inputParameters;
        if (!parameters) {
            throw new Error("parameters should be of type PlatformParameters");
        }
        switch (parameters.promptBehavior) {
            case PromptBehavior_1.PromptBehavior.Auto:
            case PromptBehavior_1.PromptBehavior.Always:
            case PromptBehavior_1.PromptBehavior.SelectAccount:
            case PromptBehavior_1.PromptBehavior.RefreshSession:
                return new InteractiveWebUI_1.InteractiveWebUI(parameters.ownerWindow);
            case PromptBehavior_1.PromptBehavior.Never:
                throw new Error("SilentWebUI not supported yet!");
            default:
                throw new Error("Unexpected PromptBehavior value");
        }
    }
}
exports.WebUIFactory = WebUIFactory;
//# sourceMappingURL=WebUIFactory.js.map