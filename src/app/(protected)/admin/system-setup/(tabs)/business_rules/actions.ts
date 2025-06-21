"use server"

import { ResponseDto } from "@/types";
import { CreditSetting } from "./rules";
import requestClient from "@/lib/requestClient";
import { handleServerErrorMessage } from "@/utils";

export async function getBusinessRules(token: string): Promise<ResponseDto<CreditSetting>> {
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