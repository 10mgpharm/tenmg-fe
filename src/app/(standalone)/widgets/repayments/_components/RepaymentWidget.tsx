"use client";

import {
  BankAccountDto,
  BusinessDto,
  CustomerDto,
  ApplicationDto,
  RepaymentWidgetConfig,
} from "@/types";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import StepOneLoanDetails from "./StepOneLoanDetails";
import StepTwoPaymentSchedule from "./StepTwoPaymentSchedule";
import StepThreeConfirmation from "./StepThreeConfirmation";

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

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const step = queryParams.get("step");
    if (step) {
      setActiveStep(parseInt(step));
    }
  }, []);

  const isPendingStatus = (status: string | undefined) => {
    if (!status) return false;
    return status.toUpperCase() === "PENDING";
  };

  const pendingPaymentDate =
    data?.repaymentSchedule?.find((item) =>
      isPendingStatus(item.paymentStatus)
    ) || null;

  const isSuccessStatus = (status: string | undefined) => {
    if (!status) return false;
    return (
      status.toUpperCase() === "SUCCESS" || status.toUpperCase() === "PAID"
    );
  };

  const lastPaidPayment = data?.repaymentSchedule
    ? [...data.repaymentSchedule]
        .filter((item) => isSuccessStatus(item.paymentStatus))
        .pop()
    : null;

  const lastPaidBalance = lastPaidPayment?.balance || null;

  switch (activeStep) {
    case 1:
      return (
        <StepOneLoanDetails
          business={business}
          customer={customer}
          data={data}
          application={application}
          onContinueAction={() => {
            setActiveStep(activeStep + 1);
          }}
          pendingPaymentDate={pendingPaymentDate}
          isSuccessStatus={isSuccessStatus}
          lastPaidBalance={lastPaidBalance}
        />
      );
    case 2:
      return (
        <StepTwoPaymentSchedule
          business={business}
          customer={customer}
          data={data}
          token={token}
          application={application}
          onContinueAction={(paidAmount) => {
            if (paidAmount) {
              setCurrentPaidAmount(paidAmount);
            }
            setActiveStep(activeStep + 1);
          }}
          navigateBackAction={() => {
            setActiveStep(activeStep - 1);
          }}
          lastPaidBalance={lastPaidBalance}
        />
      );
    case 3:
      return (
        <StepThreeConfirmation
          business={business}
          customer={customer}
          data={data}
          token={token}
          application={application}
          pendingPaymentDate={pendingPaymentDate}
          isSuccessStatus={isSuccessStatus}
          lastPaidBalance={currentPaidAmount ? String(currentPaidAmount) : lastPaidBalance}
        />
      );
    default:
      return <div>Invalid step</div>;
  }
}
