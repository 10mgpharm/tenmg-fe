'use server'

import requestClient from "@/lib/requestClient";
import {
    ApiKey,
    GenerateApiKeyPayload,
    GeneratedApiKeyResponse,
    ResponseDto,
    UpdateApiKeyUrlsPayload,
    UpdateApiKeyUrlsResponse,
} from "@/types";

export async function getApiKeyInfo(token): Promise<ResponseDto<ApiKey>> {
    try {
        const response = await requestClient({ token })
            .get<ResponseDto<ApiKey>>("/vendor/api_keys");
        return response.data;
    } catch (error) {
        throw error
    }
}

export async function reGenerateApiKey(payload: GenerateApiKeyPayload): Promise<ResponseDto<GeneratedApiKeyResponse>> {
    try {
        const { token, type, environment } = payload;
        const response = await requestClient({ token })
            .post<ResponseDto<GeneratedApiKeyResponse>>("/vendor/api_keys/generate", {
                type,
                environment
            });
        return response.data;
    } catch (error) {
        throw error
    }
}

export async function updateApiKeyUrls(payload: UpdateApiKeyUrlsPayload): Promise<ResponseDto<UpdateApiKeyUrlsResponse>> {
    try {
        const { webhookUrl, callbackUrl, environment, token } = payload;
        console.log({ webhookUrl, callbackUrl, environment, token })
        const response = await requestClient({ token })
            .patch<ResponseDto<UpdateApiKeyUrlsResponse>>("/vendor/api_keys", {
                environment,
                webhookUrl,
                callbackUrl,
            });
        return response.data;
    } catch (error) {
        throw error
    }
}