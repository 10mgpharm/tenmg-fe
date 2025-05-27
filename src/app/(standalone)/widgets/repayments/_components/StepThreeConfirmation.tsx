import React from "react";
import LoanLayout from "../../_components/LoanLayout";
import { Button, Stack, Text } from "@chakra-ui/react";
import LoanInnerWrapper from "../../_components/LoanInnerWrapper";
import { BusinessDto } from "@/types/application";
import { RepaymentWidgetConfig } from "@/types/repayment";
import { CustomerDto } from "@/types/application";
import { ApplicationDto } from "@/types/application";
import { convertDate } from "@/utils/formatDate";
import { formatAmountString } from "@/utils";
import { calculatePendingTotal } from "@/utils/repaymentUtils";

interface Props {
  business: BusinessDto;
  customer: CustomerDto;
  data: RepaymentWidgetConfig;
  token: string;
  application: ApplicationDto;
  pendingPaymentDate: any;
  lastPaidBalance: string | null;
  pendingAmounts: any[];
}

export default function StepThreeConfirmation({
  application,
  pendingPaymentDate,
  lastPaidBalance,
  pendingAmounts,
}: Props) {
  return (
    <LoanLayout name={""} logo={""}>
      <LoanInnerWrapper
        headerIcon={<Text fontSize="7xl">🎉</Text>}
        heading="Payment Received!"
        text={`We've received your recent loan payment of ₦${formatAmountString(
          Number(lastPaidBalance)
        )}.`}
      />
      <Stack
        spacing={4}
        direction="column"
        bgColor="warning.100"
        border="1px solid var(--tenmg-colors-warning-400)"
        p={4}
        borderRadius="md"
        my={8}
      >
        <Text fontSize="md" fontWeight="bold">
          Total Loan Amount: ₦{formatAmountString(application?.totalAmount)}
        </Text>
        <Text fontSize="md" fontWeight="bold">
          Amount Paid: ₦{formatAmountString(Number(lastPaidBalance))}
        </Text>
        <Text fontSize="md" fontWeight="bold">
          Amount Remaining: ₦{formatAmountString(calculatePendingTotal(pendingAmounts))}
        </Text>
        <Text fontSize="md" fontWeight="bold">
          Next Payment Due: {pendingPaymentDate?.dueDate ? convertDate(pendingPaymentDate.dueDate) : "All paid!"}
        </Text>
      </Stack>

      <Text textAlign="center" fontSize="md" mb={6}>
        Thank you for staying on track with your repayments! Please ensure the
        remaining balance is paid by the due date to avoid any penalties.
      </Text>

      <Button
        w="full"
        onClick={() => {
          const confirmed = window.confirm(
            "Are you sure you want to close this window?"
          );
          if (confirmed) {
            window.close();
          }
        }}
      >
        Exit Application
      </Button>
    </LoanLayout>
  );
}
