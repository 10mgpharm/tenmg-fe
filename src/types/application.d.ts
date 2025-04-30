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
    updatedAt?: string;
    length?: string;
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

export interface SingleNotification {
    createdAt: string;
    id: string;
    readAt: null | string;
    data: {
        subject: string;
        message: string;
    }
}

export interface MessageProps {
    id: number;
    sender: {
        id: number;
        name: string;
    },
    receiver: {
        id: number;
        name: string;
    },
    latest?: {
        id: number;
        conversationId: number;
        message: string;
        readStatus: string;
        sender: {
            id: number;
            name: string;
        },
        receiver: {
            id: number;
            name: string;
        },
        sentAt: string;
    }
}

export interface ConversationProps {
    conversationId: number;
    id: number;
    message: string;
    readStatus: string;
    sender: {
        id: number;
        name: string;
    },
    receiver: {
        id: number;
        name: string;
    },
    sentAt: string;
}

export interface UserListProps {
    id: number;
    name: string;
    active: boolean;
    businessName: null | string;
    businessStatus: string;
    avatar: null | string;
    owner: boolean;
    role: string;
    email: string;
}

export interface TransactionDataProps {
    data: TransactionProps[]
    links: any;
    meta: any;
    message: string;
    status: string;
}

export interface TransactionProps {
    id: number
    business: BusinessProp
    identifier: string
    amount: string
    type: string
    transactionGroup: string
    description: string
    status: string
    paymentMethod: string
    reference: any
    walletId: number
    loanApplicationId: any
    meta: any
    createdAt: string
    updatedAt: string
}
  
export interface BusinessProp {
    id: number
    ownerId: number
    name: string
    shortName: string
    code: string
    logoId: any
    type: string
    address: string
    contactPerson: string
    contactPhone: string
    contactEmail: string
    contactPersonPosition: string
    active: number
    status: string
    licenseNumber: string
    expiryDate: string
    licenseVerificationStatus: string
    licenseSubmissionDate: any
    licenseVerificationComment: string
    cacDocumentId: number
    createdAt: string
    updatedAt: string
}
  