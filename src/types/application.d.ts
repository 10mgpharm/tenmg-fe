export interface CustomerDto {
    id?: number;
    name: string;
    email: string;
    phone: string;
    identifier?: string;
    reference?: string;
    businessId?: number;
    avatarId?: string;
    category?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
    score?: number;
    active?: boolean;
}

export interface ApplicationUrl {
    url: string;
}

export interface StartApplicationPayload {
    customer: CustomerDto;
    requestedAmount: number;
}

export interface BusinessDto {
    id: string;
    name: string;
    logo: string;
    address?: string;
}
export interface InterestConfig {
    rate: number;
}

export interface ApplicationDto {
    id: number;
    identifier: string;
    businessId: number;
    customer: CustomerDto;
    business: BusinessDto;
    identifier: string;
    requestedAmount: number;
    interestAmount: number;
    totalAmount: number;
    interestRate: number;
    durationInMonth: number;
    status: string;
    source: string;
}

export interface ApplicationWidgetConfig {
    interestConfig: InterestConfig;
    business: BusinessDto;
    customer: CustomerDto;
    application: ApplicationDto;
    defaultBank: BankAccountDto;
}

export interface BankDto {
    code: number;
    name: string;
}

export interface VerifyAccountNumberPayload {
    accountNumber: string;
    bankCode: string;
}

export interface VerifyBankAccountResponseDto {
    success: boolean;
    message: string;
    data: {
        accountNumber: number;
        accountName: string;
    }
}

export interface CreateBankAccountPayload {
    identifier: string;
    accountNumber: string;
    accountName: string;
    bankCode: string;
    bankName: string;
}

export interface BankAccountDto {
    identifier: string;
    accountNumber: string;
    accountName: string;
    bankCode: string;
    bankName: string;
    bvn?: string;
}

export interface CreateBankMandatePayload {
    duration: string;
    loanApplicationIdentifier: string;
    bank: string;
    customerAccountName: string;
    customerAccountNumber: string;
    customerBankCode: string;
}

export interface BankMandateDto {
    duration?: string;
    reference: string;
    responseDescription?: string;
    startDate?: string
    status: string;
    amount: number;
    description?: string;
    endDate?: string;
}

interface SingleNotification {
    createdAt: string;
    id: string;
    readAt: null | string;
    data: {
        subject: string;
        message: string;
    }
}