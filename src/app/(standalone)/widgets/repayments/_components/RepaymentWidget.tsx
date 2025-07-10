"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  BusinessDto,
  CustomerDto,
  ApplicationDto,
  RepaymentWidgetConfig,
} from "@/types";
import StepOneLoanDetails from "./StepOneLoanDetails";
import StepTwoPaymentSchedule from "./StepTwoPaymentSchedule";
import StepThreeConfirmation from "./StepThreeConfirmation";
import { getRepaymentDetails } from "../actions";
import {
  isPendingStatus,
  isSuccessStatus,
  getPendingAmounts,
  getPendingPaymentDate,
  getLastPaidPayment,
  getLastPaidBalance
} from "@/utils/repaymentUtils";

interface Props {
  business: BusinessDto;
  customer: CustomerDto;
  application: ApplicationDto;
  data: RepaymentWidgetConfig;
  reference: string;
  token: string;
}

export default function RepaymentWidget({
  business,
  customer,
  application,
  data,
  reference,
  token,
}: Props) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [currentPaidAmount, setCurrentPaidAmount] = useState<string | number>("");
  const [repaymentData, setRepaymentData] = useState(data);

  const pendingAmounts = getPendingAmounts(repaymentData?.repaymentSchedule);
  const pendingPaymentDate = getPendingPaymentDate(pendingAmounts);
  const lastPaidPayment = getLastPaidPayment(repaymentData?.repaymentSchedule);
  const lastPaidBalance = getLastPaidBalance(lastPaidPayment);

  const refreshRepaymentData = useCallback(async () => {
    const response = await getRepaymentDetails(token, reference);
    if (response.status === "success") {
      setRepaymentData(response.data);
    }
  }, [token, reference]);

  useEffect(() => {
    if (activeStep === 3) {
      refreshRepaymentData();
    }
  }, [activeStep, refreshRepaymentData]);

  const updateStepInUrl = (step: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", step.toString());
    window.history.replaceState({}, "", url.toString());
  };

  switch (activeStep) {
    case 1:
      return (
        <StepOneLoanDetails
          business={business}
          customer={customer}
          data={repaymentData}
          application={application}
          onContinueAction={() => {
            const nextStep = activeStep + 1;
            setActiveStep(nextStep);
            updateStepInUrl(nextStep);
          }}
          pendingPaymentDate={pendingPaymentDate}
          isSuccessStatus={isSuccessStatus}
          lastPaidBalance={lastPaidBalance}
          pendingAmounts={pendingAmounts}
        />
      );
    case 2:
      return (
        <StepTwoPaymentSchedule
          business={business}
          customer={customer}
          data={repaymentData}
          token={token}
          application={application}
          onContinueAction={(paidAmount) => {
            setCurrentPaidAmount(paidAmount);
            const nextStep = activeStep + 1;
            setActiveStep(nextStep);
            updateStepInUrl(nextStep);
          }}
          navigateBackAction={() => {
            const prevStep = activeStep - 1;
            setActiveStep(prevStep);
            updateStepInUrl(prevStep);
          }}
          pendingAmounts={pendingAmounts}
          lastPaidBalance={lastPaidBalance}
          onPaymentSuccess={refreshRepaymentData}
        />
      );
    case 3:
      return (
        <StepThreeConfirmation
          business={business}
          customer={customer}
          data={repaymentData}
          token={token}
          application={application}
          pendingPaymentDate={pendingPaymentDate}
          lastPaidBalance={
            currentPaidAmount ? String(currentPaidAmount) : lastPaidBalance
          }
          pendingAmounts={pendingAmounts}
        />
      );
    default:
      return <div>Invalid step</div>;
  }
}
