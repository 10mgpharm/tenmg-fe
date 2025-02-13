export interface CustomerDto {
    name: string;
    email: string;
    phone: string;
    identifier?: string;
}

export interface ApplicationUrl {
    url: string;
}

export interface StartApplicationPayload {
    customer: CustomerDto;
    requestedAmount: number;
}
