import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { BusinessStatus } from "../constants/enum";

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
  reference: string;
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

export interface singleCustomerData {
  id: number;
  name: string;
  avatar: string | null;
  email: string;
  phone: string;
  identifier: string;
  businessId: number;
  active: number;
  updatedAt: string;
  createdAt: string;
}
export interface LoanData {
  id: number;
  businessId: number;
  createdAt: string;
  customer: singleCustomerData;
  durationInMonths: string;
  identifier: string;
  interestAmount: string;
  interestRate: number;
  requestedAmount: string;
  source: string;
  status: string;
  totalAmount: string;
  updatedAt: string;
}

export interface LoanDataProp {
  currentPage: number;
  data: LoanData[];
  total: number;
  perPage: number;
  lastPage: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

export interface TransactionHistoryData {
  businessId: number;
  createdAt: string;
  customer: CustomerData;
  createdAtId: number;
  evaluationResult: any;
  fileFormat: string;
  id: number;
  identifier: number;
  source: string;
  status: string;
  reference: string;
  transactionFileId: number;
  updatedAt: string;
}

export interface TransactionHistoryDataProps {
  currentPage: number;
  data: TransactionHistoryData[];
  total: number;
  perPage: number;
  lastPage: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
  meta: any
}
export interface CustomerRecords {
  id: number;
  identifier: string;
  name: string;
  avatarId: number;
  email: string;
  phone: string;
  active: number;
  businessId: number;
  createdAt: string;
  updateddAt: string;
}


export interface MedicationData {
  id: number;
  active: boolean;
  name: string;
  slug: string;
  status: string;
}

export interface MedicationResponseData {
  data: MedicationData[];
  links: any;
  meta: MetaDataProp;
}

export interface NotificationProps {
  id: number;
  name: string;
  description: string;
  isAdmin: boolean;
  isSupplier: boolean;
  isPharmacy: boolean;
  isSubscribed: boolean;
  isVendor: boolean;
  active: boolean;
}

export interface NotificationResponseData {
  data: NotificationProps[];
  links: any;
  meta: MetaDataProp;
}


export interface ProductDataProps {
  id: number;
  name: string;
  image: string;
  brand: string;
  weight: string;
  category: string;
  price: string;
  quantity: string;
  status: string;
}
export interface ProductResponseData {
  data: ProductDataProps[];
  links: any;
  meta: MetaDataProp;
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