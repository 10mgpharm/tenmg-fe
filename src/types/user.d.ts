import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { BusinessStatus } from "../constants/enum";
import { AuditLogData } from "@/data/mockdata";
import { ApplicationDto } from "./application";

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
  status?: number;
  avatar?: string;
  picture?: string;
  owner: boolean;
  emailVerifiedAt: string;
  entityType: string;
  role: string;
  businessName: string;
  businessStatus: BusinessStatus;
  completeProfile: boolean;
  createdAt?: string;
  updatedAt?: string;
  dateJoined?: string;
}

export interface SingleUser {
  user: User & {
    business: Vendor;
  };
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

export interface AuditLogData {
  id: string;
  evenet: string;
  description: string;
  createdAt: string;
  actor: {
    name: string;
    email: string;
    avatar: string | null;
    role: string;
  };
  properties: {
    action: string;
    crudType: string;
    ipAddress: string;
    tokenExpiresAt: string;
    tokenScope: string;
    userAgent: string;
  }
}
export interface AuditLogsResponse {
  data: AuditLogData[];
  currentPage: number;
  from: number;
  lastPage: number;
  links: any;
  path: string;
  perPage: number;
  to: number;
  total: number;
  lastPageUrl: string | null;
  nextPageUrl: string | null;
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
  avatarId: number | null;
  name: string;
  email: string;
  phone: string;
  score?: number;
  active: number;
  category?: string | null;
  reference: string | null;
  lastEvaluationHistory: any;
  businessId: number;
  createdAt: string;
  updatedAt: string;
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
  transactionFileId: number;
  updatedAt: string;
}

export interface VendorData {
  id: number;
  ownerId: number;
  name: string;
  shortName: string;
  code: string;
  logoId: string | null;
  type: string;
  address: string | null;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  contactPersonPosition: string;
  active: number;
  status: string;
  licenseNumber: string;
  expiryDate: string;
  licenseVerificationStatus: string;
  licenseVerificationComment: string | null;
  cacDocumentId: number;
  createdAt: string;
  updatedAt: string;
}


export interface ResultBreakdownProps {
  operator: string;
  ruleDescription: string;
  ruleName: string;
  status: string;
  systemValue: string;
  transactionValue: number;
  weight: number;
}
export interface SingleTransactionData {
  id: number;
  identifier: string;
  updatedAt: string;
  createdAt: string;
  affordability: {
    rule: string;
    baseAmount: string;
    maxAmount: string;
    category: string | null;
  },
  creditScoreResult: {
    scorePercent: number;
    scoreTotal: number;
    scoreValue: number;
    appliedRules: ResultBreakdownProps[];
  }
  customer: CustomerData;
  vendor: VendorData;
  evaluation: any;
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

export interface MedicationVariant {
  id?: number;
  weight?: string;
  strengthValue: string;
  packagePerRoll: string;
  medicationType: string;
  presentation: string;
  measurement: string;
  active: boolean;
  status: string;
  statusComment: string;
}

export interface MedicationData {
  id: number;
  active: boolean;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  variations?: MedicationVariant[]
}

export interface MedicationResponseData {
  data: MedicationData[];
  links: any;
  currentPage?: number;
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

export interface BrandType {
  id: number;
  active: boolean;
  name: string;
  slug: string;
  status: string;
}
export interface CategoryType {
  id: number;
  active: boolean;
  name: string;
  slug: string;
  status: string;
}
export interface MeasurementType {
  id: number;
  active: boolean;
  name: string;
  status: string;
  variations?: MedicationVariant[]
}
export interface ProductDataProps {
  id: number;
  name: string;
  image: string;
  brand: BrandType;
  description: string;
  weight: string;
  category: CategoryType;
  price: string;
  quantity: string;
  status: string;
  slug: string;
  thumbnailFile: string;
  company: string| null;
  inventory: string;
  discountPrice: string;
  actualPrice: string;
  comment: string | null;
  commission: string | null;
  expiredAt: string | null;
  minDeliveryDuration: string | null;
  maxDeliveryDuration: string | null;
  lowStockLevel: number;
  outStockLevel: number;
  variation: any;
  measurement: MeasurementType;
  medicationType: MeasurementType;
  package: MeasurementType;
  presentation: MeasurementType;
}
export interface ProductResponseData {
  data: ProductDataProps[];
  links: any;
  meta?: MetaDataProp;
  lastPage?: number;
  prevPageUrl?: string | null, 
  nextPageUrl?: string | null,
  currentPage?: number;
  firstPageUrl?: any;
  lastPageUrl?: any;
}

export interface OrderData {
  createdAt: string;
  customer: CustomerData;
  deliveryAddress: string;
  deliveryType: string;
  grandTotal: string;
  id: number;
  logisticTotal: string;
  orderTotal: string;
  qtyTotal: number;
  status: string;
  refundStatus: string;
  totalWeight: number;
  totalTenmgComission: number;
  updatedAt: string;
  items: any;
}
export interface OrderResponseData {
  data: OrderData[];
  links: any;
  meta?: MetaDataProp;
  prevPageUrl?: string | null, 
  nextPageUrl?: string | null,
  currentPage?: number;
  firstPageUrl?: any;
  lastPageUrl?: any;
}

export interface DiscountDataType {
  amount: string;
  applicationMethod: string;
  applicableProducts: number[];
  couponCode: string;
  customerLimit: string;
  endDate: string;
  id: number;
  startDate: string;
  status: string;
  type: string;
}
export interface DiscountResponseData {
  data: DiscountDataType[];
  links: any;
  meta?: MetaDataProp;
  prevPageUrl?: string | null, 
  nextPageUrl?: string | null,
  currentPage?: number;
  firstPageUrl?: any;
  lastPageUrl?: any;
}

export interface WalletData {
  id : string;
}
export interface WalletResponseData {
  data: WalletData[];
  links: any;
  meta?: MetaDataProp;
  prevPageUrl?: string | null, 
  nextPageUrl?: string | null,
  currentPage?: number;
  firstPageUrl?: any;
  lastPageUrl?: any;
  total: number
}

/**
 * Interfaces for the Credit Score
 */

export interface TransactingMonth {
  sum: number;
  month: string;
}

export interface AppliedRule {
  status: "passed" | "failed";
  weight: number;
  operator: string | null;
  ruleName: string;
  systemValue: string;
  ruleDescription: string;
  transactionValue: number | { sum: number; month: string }[];
}

export interface CreditScoreResult {
  scoreTotal: number;
  scoreValue: number;
  appliedRules: AppliedRule[];
  scorePercent: number;
}

export interface Affordability {
  rule: string;
  maxAmount: string;
  baseAmount: string;
}

export interface CreditPattern {
  noOf10MGCredits: number;
  activeCreditCount: number;
  noOfAllRepayments: number;
  activeCreditAmount: number;
  noOfFullRepayments: number;
  noOfLateRepayments: number;
  amountOf10MGCredits: number;
  noOfExternalCredits: number;
  totalPastCreditCount: number;
  noOfPartialRepayments: number;
  totalPastCreditAmount: number;
  noOfScheduleRepayments: number;
  amountOfExternalCredits: number;
}

export interface PurchasePattern {
  noOfOmmitedMonths: number;
  noOfTransactingMonths: number;
  totalTransactionCount: number;
  lowestTransactingMonth: number;
  totalTransactionVolume: number;
  highestTransactingMonth: number;
  listOfTransactingMonths: TransactingMonth[];
  averageTransactionVolume: number;
}

export interface Evaluation {
  creditPattern: CreditPattern;
  purchasePattern: PurchasePattern;
}

export interface Vendor {
  id: number;
  ownerId: number;
  name: string;
  shortName: string;
  code: string;
  logoId: number | null;
  type: string;
  address: string | null;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  contactPersonPosition: string;
  active: number;
  status: string;
  licenseNumber: string;
  expiryDate: string;
  licenseVerificationStatus: string;
  licenseVerificationComment: string | null;
  cacDocumentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreditScoreData {
  id: number;
  identifier: string;
  creditScoreResult: CreditScoreResult;
  affordability: Affordability;
  evaluation: Evaluation;
  customer: CustomerData;
  vendor: Vendor;
  createdAt: string;
  updatedAt: string;
}

export interface CreditScoreResponseData {
  data: CreditScoreData[];
  link: any;
  meta: MetaDataProp;
}

export interface AdminApprovals {
  id: number;
  type: string;
  licenseNumber: string;
  expiryDate: string;
  name: string;
  businessName: string;
  contactEmail: string,
  businessAddress: string,
  contactPerson: string;
  contactPhone: string;
  contactPersonPosition: string;
  code: string;
  position: string;
  cacDocument: string,
  verificationStatus: string
  createdAt: string;
  updatedAt: string;
  address: string;
  actions: string;
  cacFileSize: number;
}

export interface AdminApprovalsProps {
  data: AdminApprovals[];
  links: any;
  meta: MetaDataProp;
  message: string;
  status: string;
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

export interface PresentationProps {
  id: number;
  active: boolean;
  name: string;
  status: string;
}

interface faqProps {
  id: number;
  question: string;
  answer: string;
}

interface FaqDataProps {
  data: faqProps[];
  links: any;
  meta: MetaDataProp;
  message: string;
  status: string;
}
export interface StoreFrontImage{
  id: number;
  description: string | null;
  imageUrl: string;
  title: string | null;
}
export interface StoreFrontImageResponse {
  data: any;
  links: any;
  meta: MetaDataProp;
}

export interface AuditLogData{
 timestamp: string;
 event: string;
 user: string;
 action: string;
}
export interface ApiLogData{
 status: string;
 event: string;
 endpoint: string;
 server_response: string;
 timestamp: string;
}

export interface UserLoan {
  loanId: string;
  name: string;
  amount: string;
  date: string;
  vendor?: string;
  score?: number;
  status: string;
  repaymentStatus: string;
}

export interface LenderDashboardData {
  interestEarned: number;
  loanApprovalThisMonth: number;
  name: string;
  pendingRequests: number;
  type: string;
  loanRequest: LoanRequest[];
  wallets: Wallets[]; 
}

export interface LoanStats {
  totalApplications: number;
  successfulApplications: number;
  pendingApplications: number;
}

export interface LoanRequest {
  id: number;
  identifier: string;
  customer: CustomerData;
  business: any;
  requestedAmount: string;
  interestAmount: string;
  totalAmount: string;
  interestRate: number;
  durationInMonths: string;
  status: string;
}

export interface Wallets {
  lenderId: string;
  type: string;
  currentBalance: string;
  prevBalance: string;
  lastTransactionRef: string | null;
  updatedAt: string;
}

export interface LoanApplicationDataResponse {
  data: ApplicationDto;
  links: any;
  meta: MetaDataProp;
}