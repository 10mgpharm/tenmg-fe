'use server';

import config from "@/lib/config";
import requestClient from "@/lib/requestClient";
import {
    ApplicationWidgetConfig,
    BankDto,
    CreateBankAccountPayload,
    BankAccountDto,
    ResponseDto,
    VerifyAccountNumberPayload,
    VerifyBankAccountResponseDto,
    BankMandateDto,
    CreateBankMandatePayload,
} from "@/types";
import { handleServerErrorMessage } from "@/utils";

const CLIENT_BASE_URL = "/client";
const publicKey = config.tenmg.pkey;

export async function getApplicationConfig(reference: string): Promise<ResponseDto<ApplicationWidgetConfig>> {
    try {
        const response = await requestClient({ "Public-Key": publicKey })
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

export async function createBankMandate(token: string, payload: CreateBankMandatePayload): Promise<ResponseDto<BankMandateDto>> {
    try {
        console.log('CreateBankMandate', payload)
        const response = await requestClient({ token })
            .post<ResponseDto<BankMandateDto>>(`${CLIENT_BASE_URL}/applications/mandate/create-mandate`, payload);
            console.log(response.data)
        return response.data;
    } catch (error) {
        console.log(error)
        return {
            status: 'error',
            message: handleServerErrorMessage(error)
        }
    }
}

export async function getBankMandate(token: string, reference: string): Promise<ResponseDto<BankMandateDto>> {
    try {
        const response = await requestClient({ token })
            .get<ResponseDto<BankMandateDto>>(`${CLIENT_BASE_URL}/applications/mandate/verify/${reference}`);
        return response.data;
    } catch (error) {
        return {
            status: 'error',
            message: handleServerErrorMessage(error)
        }
    }
}