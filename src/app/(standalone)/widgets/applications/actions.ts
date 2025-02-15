'use server';

import requestClient from "@/lib/requestClient";
import {
    ApplicationWidgetConfig,
    BankDto,
    CreateBankAccountPayload,
    BankAccountDto,
    ResponseDto,
    VerifyAccountNumberPayload,
    VerifyBankAccountResponseDto,
} from "@/types";
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

export async function getBankList(token: string): Promise<ResponseDto<BankDto[]>> {
    try {
        const response = await requestClient({ token })
            .get<ResponseDto<BankDto[]>>(`${CLIENT_BASE_URL}/banks`);
        return response.data;
    } catch (error) {
        return {
            status: 'error',
            message: handleServerErrorMessage(error)
        }
    }
}

export async function verifyBankAccount(token: string, payload: VerifyAccountNumberPayload): Promise<ResponseDto<VerifyBankAccountResponseDto>> {
    try {
        const response = await requestClient({ token })
            .post<ResponseDto<VerifyBankAccountResponseDto>>(`${CLIENT_BASE_URL}/banks/account/verify`, payload);
        return response.data;
    } catch (error) {
        return {
            status: 'error',
            message: handleServerErrorMessage(error)
        }
    }
}

export async function createBankAccount(token: string, payload: CreateBankAccountPayload): Promise<ResponseDto<BankAccountDto>> {
    try {
        console.log('createBankAccount', payload )
        const response = await requestClient({ token })
            .post<ResponseDto<BankAccountDto>>(`${CLIENT_BASE_URL}/banks`, payload);
        return response.data;
    } catch (error) {
        return {
            status: 'error',
            message: handleServerErrorMessage(error)
        }
    }
}

export async function getDefaultBankAccount(token: string, customerIdentifier: string): Promise<ResponseDto<BankAccountDto>> {
    try {
        const response = await requestClient({ token })
            .get<ResponseDto<BankAccountDto>>(`${CLIENT_BASE_URL}/banks/default/${customerIdentifier}`);
        return response.data;
    } catch (error) {
        return {
            status: 'error',
            message: handleServerErrorMessage(error)
        }
    }
}
