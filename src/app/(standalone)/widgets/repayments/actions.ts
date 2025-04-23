'use server';

import requestClient from "@/lib/requestClient";
import {
    ApplicationWidgetConfig,
    RepaymentWidgetConfig,
    ResponseDto,
 
} from "@/types";
import { handleServerErrorMessage } from "@/utils";

const CLIENT_BASE_URL = "/client";

export async function getRepaymentDetails(token: string, reference: string): Promise<ResponseDto<RepaymentWidgetConfig>> {
    try {
        const response = await requestClient({ token })
            .get<ResponseDto<RepaymentWidgetConfig>>(`${CLIENT_BASE_URL}/repayment/verify/${reference}`);
        return response.data;
    } catch (error) {
        return {
            status: 'error',
            message: handleServerErrorMessage(error)
        }
    }
}