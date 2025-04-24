import { BusinessDto, CustomerDto, ApplicationDto } from "./application";

export interface RepaymentWidgetConfig {
    vendor: BusinessDto;
    customer: CustomerDto;
    application: ApplicationDto;
    repaymentSchedule: RepaymentSchedule[];
    totalAmount: string;
    identifier: string;
}

export interface RepaymentSchedule {
    balance: string;
    createdAt: string;
    dueDate: string;
    id: number;
    interest: string;
    lateFee: string | null;
    loanId: number;
    paymentId: number | null;
    paymentStatus: 'PENDING' | 'SUCCESS' | 'OVERDUE' | 'PARTIAL' | 'success';
    principal: string;
    totalAmount: string;
    updatedAt: string;
  }