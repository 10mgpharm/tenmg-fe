import { Session } from "next-auth";

export enum BusinessStatus {
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  VERIFIED = "VERIFIED",
  SUSPENDED = "SUSPENDED",
  BANNED = "BANNED",
  AWAITING_APPROVAL = "AWAITING_APPROVAL",
}

export enum BusinessType {
  VENDOR = "VENDOR",
  SUPPLIER = "SUPPLIER",
  ADMIN = "ADMIN",
  CUSTOMER_PHARMACY = "CUSTOMER_PHARMACY",
}

export interface Account {
  providerAccountId: number | string;
  type: "oauth" | "credentials";
  provider: "google" | "credentials";
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
  businessName: string;
  businessStatus: BusinessStatus;
  completeProfile: boolean;
}

export interface NextAuthUserSession extends Session {
  user: User & {
    account: Account;
    token?: string;
  };
}

export interface EmailVerified {
  emailVerifiedAt: string;
}

export interface AdminMemers {
  businessName: string;
  dateJoined: string;
  email: string;
  id: number;
  name: string;
  status: number;
  // supplier_id: string;
}

export interface MetaDataProp {
  currentpage: number;
  from: number;
  lastPage: number;
  links: any;
  path: string;
  perPage: number;
  to: number;
  total: number;
}

export interface MemberDataProp {
  data: AdminMemers[];
  links: any;
  meta: MetaDataProp;
  message: string;
  status: string;
}

export interface CustomerData {
  id: number;
  identifier: string;
  name: string;
  email: string;
  phone: string;
  active: 1;
  lastEvaluationHistory: any;
  businessId: number;
  createdAt: string;
}

export interface CustomerDataProp {
  currentPage: number;
  data: CustomerData[];
  total: number;
  perPage: number;
  lastPage: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}
