export const isPendingStatus = (status: string | undefined): boolean => {
  return status?.toUpperCase() === "PENDING";
};

export const isSuccessStatus = (status: string | undefined): boolean => {
  const upper = status?.toUpperCase();
  return upper === "SUCCESS" || upper === "PAID";
};

export const calculatePendingTotal = (pendingAmounts: any[]): number => {
  return pendingAmounts?.length > 0
    ? pendingAmounts.reduce((sum, item) => sum + Number(item?.totalAmount), 0)
    : 0;
};

export const getPendingAmounts = (repaymentSchedule: any[]): any[] => {
  return repaymentSchedule?.filter((item) => isPendingStatus(item.paymentStatus)) || [];
};

export const getPendingPaymentDate = (pendingAmounts: any[]): any => {
  return pendingAmounts.length > 0 ? pendingAmounts[0] : null;
};

export const getLastPaidPayment = (repaymentSchedule: any[]): any => {
  return repaymentSchedule
    ? [...repaymentSchedule].filter((item) => isSuccessStatus(item.paymentStatus)).pop()
    : null;
};

export const getLastPaidBalance = (lastPaidPayment: any): string => {
  return lastPaidPayment?.balance !== "0.00" ? lastPaidPayment?.totalAmount : "0";
};