export type ApiKeyEnv = 'test' | 'live';

export interface ApiKey {
    id: number;
    key: string;
    secret: string;
    webhookUrl: string;
    callbackUrl: string;
    testSecret: string;
    testKey: string;
    testWebhookUrl: string;
    testCallbackUrl: string;
    testEncryptionKey: string;
    encryptionKey: string;
    isTest: boolean;
    isActive: boolean;
}

export interface GenerateApiKeyPayload {
    token: string;
    type: string;
    environment: ApiKeyEnv;
}

export interface GeneratedApiKeyResponse {
    type: string;
    value: string;
    environment: ApiKeyEnv;
}

export interface UpdateApiKeyUrlsPayload {
    token: string;
    environment: ApiKeyEnv;
    webhookUrl: string;
    callbackUrl: string;
}

export interface UpdateApiKeyUrlsResponse {
    environment: test,
    value: ApiKey;
}
