'use server';

import config from "@/lib/config";
import requestClient from "@/lib/requestClient";
import { ApplicationWidgetConfig, ResponseDto } from "@/types";
import { handleServerErrorMessage } from "@/utils";

const CLIENT_BASE_URL = "/client";

export async function getApplicationConfig(reference: string, token: string): Promise<ResponseDto<ApplicationWidgetConfig>> {
    try {
        const response = await requestClient({ token })
            .get<ResponseDto<ApplicationWidgetConfig>>(`${CLIENT_BASE_URL}/applications/config/${reference}`);
        return response.data;
    } catch (error) {
        return {
            status: 'error',
            message: handleServerErrorMessage(error)
        }
    }
}
