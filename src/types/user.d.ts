import { Session } from "next-auth";

export enum BusinessStatus {
    PENDING_VERIFICATION = 'PENDING_VERIFICATION',
    VERIFIED = 'VERIFIED',
    SUSPENDED = 'SUSPENDED',
    BANNED = 'BANNED',
}

export enum BusinessType {
    VENDOR = 'VENDOR',
    SUPPLIER = 'SUPPLIER',
    ADMIN = 'ADMIN',
    CUSTOMER_PHARMACY = 'CUSTOMER_PHARMACY',
}

export interface Account {
    providerAccountId: number | string;
    type: 'oauth' | 'credentials';
    provider: 'google' | 'credentials';
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    active: boolean;
    owner: boolean;
    emailVerifiedAt: string;
    entityType: string;
    businessName: string,
    businessStatus: BusinessStatus,
    completeProfile: boolean,
}

export interface NextAuthUserSession extends Session {
    user: User & {
        account: Account
        token?: string;
    },
}

export interface EmailVerified {
    emailVerifiedAt: string
}