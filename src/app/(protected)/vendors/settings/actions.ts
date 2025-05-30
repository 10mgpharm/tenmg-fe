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
import { handleServerErrorMessage } from "@/utils";

export async function getApiKeyInfo(token): Promise<ResponseDto<ApiKey>> {
    try {
        const response = await requestClient({ token })
            .get<ResponseDto<ApiKey>>("/vendor/api_keys");
        return response.data;
    } catch (error) {
        const errorMessage = handleServerErrorMessage(error);
        return {
            status: "error",
            message: errorMessage || "Failed to retrieve API keys",
            data: null,
        } as ResponseDto<ApiKey>;
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
        const errorMessage = handleServerErrorMessage(error);
        return{
            status: "error",
            message: errorMessage || "Failed to regenrate API keys",
            data: null,
        } as ResponseDto<GeneratedApiKeyResponse>;
    }
}

export async function updateApiKeyUrls(payload: UpdateApiKeyUrlsPayload): Promise<ResponseDto<UpdateApiKeyUrlsResponse>> {
    try {
        const { webhookUrl, callbackUrl, environment, token, transactionUrl } = payload;
        const response = await requestClient({ token })
            .patch<ResponseDto<UpdateApiKeyUrlsResponse>>("/vendor/api_keys", {
                environment,
                webhookUrl,
                callbackUrl,
                transactionUrl,
            });
        return response.data;
    } catch (error) {
        const errorMessage = handleServerErrorMessage(error);
        return {
            status: "error",
            message: errorMessage || "Failed to update API key URLs",
            data: null,
        } as ResponseDto<UpdateApiKeyUrlsResponse>;
    }
}