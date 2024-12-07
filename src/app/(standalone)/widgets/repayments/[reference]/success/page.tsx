import React from "react";
import LoanLayout from "../../../_components/LoanLayout";
import { Button, Stack, Text } from "@chakra-ui/react";
import LoanInnerWrapper from "../../../_components/LoanInnerWrapper";

interface IRepayment {
  loanAmount: string;
  date: string;
  amountRemaining: string;
}

const repayment: IRepayment = {
  loanAmount: "1,250,000",
  date: "21st September",
  amountRemaining: "905,000",
};

export default function ExternalCreditRepayment() {
  return (
    <LoanLayout>
      <LoanInnerWrapper
        headerIcon={<Text fontSize="7xl">🎉</Text>}
        heading="Payment Received! "
        text="We’ve received your recent loan payment of ₦61,050."
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
          Total Loan Amount: ₦{repayment.loanAmount}
        </Text>
        <Text fontSize="md" fontWeight="bold">
          Amount Remaining: ₦{repayment.amountRemaining}
        </Text>
        <Text fontSize="md" fontWeight="bold">
          Next Payment Due: {repayment.date}
        </Text>
      </Stack>

      <Text textAlign="center" fontSize="md" mb={6}>
        Thank you for staying on track with your repayments! Please ensure the
        remaining balance is paid by the due date to avoid any penalties.
      </Text>

      <Button w="full">Exit Application</Button>
    </LoanLayout>
  );
}
