import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

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
    avatar?: string;
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

interface NextAuthUserSessionWithToken extends JWT {
    name: string;
    email: string;
    picture: string;
    sub: string;
    id: number;
    active: boolean;
    emailVerifiedAt: string;
    entityType: string;
    businessName: string;
    businessStatus: string;
    owner: boolean;
    completeProfile: boolean;
    token: string;
    account: Account;
    iat: number;
    exp: number;
    jti: string;
}