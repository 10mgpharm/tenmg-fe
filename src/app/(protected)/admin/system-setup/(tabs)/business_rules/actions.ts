"use server"

import { ResponseDto } from "@/types";
import { CreditSetting } from "./rules";
import requestClient from "@/lib/requestClient";
import { handleServerErrorMessage } from "@/utils";

export async function getCreditBusinessRules(token: string): Promise<ResponseDto<CreditSetting>> {
    try {
        const response = await requestClient({token})
            .get<ResponseDto<CreditSetting>>('/admin/settings/business-rules');
        return response.data;
    } catch (error) {
        return {
            status: 'error',
            message: handleServerErrorMessage(error)
        }
    }
}

export async function updateCreditBusinessRules(token, payload: CreditSetting): Promise<ResponseDto<CreditSetting>> {
    try {
        const response = await requestClient({ token })
            .post<ResponseDto<CreditSetting>>('/admin/settings/business-rules', payload);
        return response.data;
    } catch (error) {
        return {
            status: 'error',
            message: handleServerErrorMessage(error)
        }
    }
}