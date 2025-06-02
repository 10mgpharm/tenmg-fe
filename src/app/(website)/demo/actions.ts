'use server'

import config from "@/lib/config";
import requestClient from "@/lib/requestClient";
import { ApplicationStatusResponseDto, ApplicationUrl, CustomerDto, ResponseDto, StartApplicationPayload } from "@/types";
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
        const response = await requestClient({
            'Public-Key': config.tenmgDemo.pkey
        })
            .post<ResponseDto<ApplicationUrl>>(`${CLIENT_BASE_URL}/applications/start`, payload);
        return response.data;
    } catch (error) {
        return {
            status: 'error',
            message: handleServerErrorMessage(error)
        }
    }
}

export async function getOrderPaymentStatus(reference: string): Promise<ResponseDto<ApplicationStatusResponseDto>> {
    try {
        const response = await requestClient({
            'Public-Key': config.tenmgDemo.pkey
        })
            .post<ResponseDto<ApplicationStatusResponseDto>>(`${CLIENT_BASE_URL}/applications/status`, { reference });
        return response.data;
    } catch (error) {
        return {
            status: 'error',
            message: handleServerErrorMessage(error)
        }
    }
}
