export declare class ClientKey {
    clientId: string;
    hasCredential: boolean;
    constructor(clientId: string);
    addToParameters(parameters: Map<string, string>): void;
}
