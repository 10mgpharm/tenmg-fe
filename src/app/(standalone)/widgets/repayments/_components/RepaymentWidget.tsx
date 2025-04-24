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

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const step = queryParams.get("step");
    if (step) {
      setActiveStep(parseInt(step));
    }
  }, []);

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
          onContinueAction={() => {
            setActiveStep(activeStep + 1);
          }}
        />
      );
    default:
      return <div>Invalid step</div>;
  }
}
