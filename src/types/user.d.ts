import { Session } from "next-auth";

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    emailVerifiedAt: string;
    entityType: string;
}

export interface NextAuthUserSession extends Session {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        emailVerifiedAt: string;
        entityType: 'VENDOR' | 'SUPPLIER' | 'CUSTOMER_PHARMACY' | 'ADMIN';
        token?: string;
    }
}