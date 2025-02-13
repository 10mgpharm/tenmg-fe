'use server'

import config from "@/lib/config";
import requestClient from "@/lib/requestClient";
import { ApplicationUrl, CustomerDto, ResponseDto, StartApplicationPayload } from "@/types";
import { handleServerErrorMessage } from "@/utils";

const CLIENT_BASE_URL = "/client";

export async function getDemoCustomers(): Promise<ResponseDto<CustomerDto[]>> {
    try {
        const response = await requestClient({ 
            'Public-Key': config.tenmg.pkey
        })
            .get<ResponseDto<CustomerDto[]>>(`${CLIENT_BASE_URL}/customers`);
        return response.data;
    } catch (error) {
        return {
            status: 'error',
            message: handleServerErrorMessage(error)
        }
    }
}

export async function initializeLoanApplicationUrl(payload: StartApplicationPayload): Promise<ResponseDto<ApplicationUrl>> {
    try {
        console.log(payload)
        const response = await requestClient({
            'Public-Key': config.tenmg.pkey
        })
            .post<ResponseDto<ApplicationUrl>>(`${CLIENT_BASE_URL}/application/start`, payload);
        return response.data;
    } catch (error) {
        return {
            status: 'error',
            message: handleServerErrorMessage(error)
        }
    }
}