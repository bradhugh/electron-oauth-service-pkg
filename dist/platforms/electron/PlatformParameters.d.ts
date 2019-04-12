import { PromptBehavior } from "../../features/electron/PromptBehavior";
import { IPlatformParameters } from "../../internal/platform/IPlatformParameters";
export declare class PlatformParameters implements IPlatformParameters {
    promptBehavior: PromptBehavior;
    ownerWindow: object;
    something: boolean;
    constructor(promptBehavior: PromptBehavior, ownerWindow: object);
}
