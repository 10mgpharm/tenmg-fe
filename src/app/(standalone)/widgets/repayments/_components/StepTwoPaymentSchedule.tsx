import React, { useState, useEffect } from "react";
import LoanLayout from "../../_components/LoanLayout";
import {
  ApplicationDto,
  BusinessDto,
  CustomerDto,
  RepaymentWidgetConfig,
} from "@/types";
import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Badge,
  Radio,
  RadioGroup,
  Checkbox,
} from "@chakra-ui/react";
import { formatAmountString, handleServerErrorMessage } from "@/utils";
import { convertDate } from "@/utils/formatDate";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { SubmitHandler } from "react-hook-form";

interface Props {
  business: BusinessDto;
  customer: CustomerDto;
  application: ApplicationDto;
  data: RepaymentWidgetConfig;
  token?: string;
  navigateBackAction?: () => void;
  onContinueAction?: (paidAmount?: string | number) => void;
  lastPaidBalance: string | null;
  pendingAmounts: any[];
}

type PaymentOption = "custom" | "full";

interface IFormInput {
  amount: number;
}

export default function StepTwoPaymentSchedule({
  business,
  customer,
  application,
  data,
  token,
  navigateBackAction,
  onContinueAction,
  lastPaidBalance,
  pendingAmounts,
}: Props) {
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("full");
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paidAmount, setPaidAmount] = useState<string | number>("");

  const handlePaymentToggle = (id: number) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const totalSelectedAmount = selectedPayments.reduce((total, id) => {
    const item = data?.repaymentSchedule?.find((item) => item.id === id);
    return total + (item ? Number(item.totalAmount) : 0);
  }, 0);

  const isSuccessStatus = (status: string | undefined) => {
    if (!status) return false;
    return (
      status.toUpperCase() === "SUCCESS" || status.toUpperCase() === "PAID"
    );
  };

  const hasPaidPayment = data?.repaymentSchedule?.some(item => 
    isSuccessStatus(item.paymentStatus)
  );

  const fullPaymentAmount = pendingAmounts && pendingAmounts.length > 0
    ? pendingAmounts.reduce((sum, item) => sum + Number(item?.totalAmount), 0)
    : 0;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = process.env.NEXT_PUBLIC_FINCRA_SDK_URL;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const verifyPayment = async (ref, amount) => {
    try {
      const response = await requestClient({ token: token }).get(
        `/client/repayment/verify-payment/${ref}`
      );
      toast.success("Fund Repayment is successful");
      if (onContinueAction) {
        onContinueAction(amount);
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(`Repayment Error: ${errorMessage}`);
    }
  };

  const cancelRepayment = async (ref) => {
    try {
      const response = await requestClient({ token: token }).get(
        `/client/repayment/cancel-payment/${ref}`
      );
      if (response?.status === 200) {
        toast.success("Repayment cancelled successfully...!");
      }
    } catch (e) {
      toast.error("Something went wrong, could not cancel repayment!");
    }
  };

  const payFincra = (ref: string, amount: string | number) => {
    if (!window.Fincra) {
      alert("Fincra SDK not loaded. Please try again.");
      return;
    }

    window.Fincra.initialize({
      key: process.env.NEXT_PUBLIC_FINCRA_PUBKEY,
      amount: amount,
      currency: "NGN",
      reference: ref,
      customer: {
        name: customer?.name,
        email: customer?.email,
      },
      feeBearer: "business",
      onClose: () => {
        cancelRepayment(ref);
      },
      onSuccess: (data: any) => {
        verifyPayment(ref, amount);
      },
    });
  };

  const onSubmit: SubmitHandler<IFormInput> = async (value) => {
    setLoadingPayment(true);
    try {
      const response = await requestClient({ token: token }).post(
        "/client/repayment",
        {
          amount: Number(value.amount),
          reference: data?.identifier,
          paymentType:
            paymentOption === "custom" ? "partPayment" : "fullPayment",
          noOfMonths:
            paymentOption === "custom"
              ? selectedPayments.length
              : data?.repaymentSchedule?.length,
        }
      );

      if (response.status === 200) {
        console.log("response", response?.data?.data?.amount);

        await payFincra(
          response?.data?.data?.init?.reference,
          Number(response?.data?.data?.amount)
        );
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
      setLoadingPayment(false);
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
      setLoadingPayment(false);
    }
  };

  return (
    <LoanLayout
      name={business?.name || ""}
      logo={business?.logo || ""}
      navigateBackAction={navigateBackAction}
      title="Repay Loan"
    >
      <Text>How much would you like to repay?</Text>

      {/* Main payment type selection */}
      <RadioGroup
        defaultValue="full"
        value={paymentOption}
        onChange={(value) => setPaymentOption(value as PaymentOption)}
      >
        <Stack
          spacing={4}
          direction={{ base: "column", md: "row" }}
          borderColor="gray.200"
          border="1px solid var(--tenmg-colors-gray-200)"
          borderRadius="md"
          my={6}
          p={2}
        >
          <Flex
            flex={1}
            borderColor="gray.200"
            border="1px solid var(--tenmg-colors-gray-200)"
            borderRadius="md"
            justifyContent="space-between"
            p={4}
          >
            <Box>
              <Text fontSize="md" color="gray.700">
                Custom Payment
              </Text>
              <Flex>Select from schedule</Flex>
            </Box>
            <Radio value="custom" />
          </Flex>
          <Flex
            flex={1}
            borderColor="gray.200"
            border="1px solid var(--tenmg-colors-gray-200)"
            borderRadius="md"
            justifyContent="space-between"
            p={4}
          >
            <Box>
              <Text fontSize="md" color="gray.700">
                Full Payment
              </Text>
              <Flex>₦{formatAmountString(fullPaymentAmount)}</Flex>
            </Box>
            <Radio value="full" />
          </Flex>
        </Stack>
      </RadioGroup>

      {/* Payment schedule selection */}
      {paymentOption === "custom" && data?.repaymentSchedule && (
        <Stack
          spacing={3}
          borderColor="gray.200"
          border="1px solid var(--tenmg-colors-gray-200)"
          borderRadius="md"
          my={6}
          p={4}
        >
          <Text fontSize="lg" color="gray.700" fontWeight="500">
            Select Payments
          </Text>

          {data.repaymentSchedule.map((item, index) => (
            <Flex
              justifyContent="space-between"
              alignItems="center"
              fontSize="sm"
              color="gray.800"
              key={index}
            >
              <Flex alignItems="center" gap={3}>
                <Checkbox
                  isChecked={selectedPayments.includes(item.id)}
                  onChange={() => handlePaymentToggle(item.id)}
                  colorScheme="blue"
                  isDisabled={isSuccessStatus(item.paymentStatus)}
                />
                <Box>
                  <Text fontSize="md" pb={1}>
                    ₦{formatAmountString(item.totalAmount)}
                  </Text>
                  <Text color="gray.400">{convertDate(item.dueDate)}</Text>
                </Box>
              </Flex>
              <Badge
                bg={`${
                  isSuccessStatus(item.paymentStatus)
                    ? "success.50"
                    : "warning.50"
                } `}
                display="flex"
                alignItems="center"
                justifyContent="center"
                textColor={`${
                  isSuccessStatus(item.paymentStatus)
                    ? "success.700"
                    : "warning.700"
                } `}
                rounded={16}
                py={1}
                px={3}
              >
                {item.paymentStatus}
              </Badge>
            </Flex>
          ))}
        </Stack>
      )}

      <Stack
        spacing={5}
        borderColor="warning.400"
        border="1px solid var(--tenmg-colors-warning-400)"
        borderRadius="md"
        bg="warning.100"
        my={6}
        py={4}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          fontSize="sm"
          color="gray.800"
          px={4}
        >
          <Text fontSize="md" pb={1}>
            Total
          </Text>

          <Text fontSize="md" pb={1}>
            ₦
            {paymentOption === "custom"
              ? formatAmountString(totalSelectedAmount)
              : formatAmountString(fullPaymentAmount)}
          </Text>
        </Flex>
      </Stack>

      <Button
        w="full"
        isDisabled={paymentOption === "custom" && selectedPayments.length === 0}
        isLoading={loadingPayment}
        onClick={() =>
          onSubmit({
            amount:
              paymentOption === "custom"
                ? totalSelectedAmount
                : Number(fullPaymentAmount),
          })
        }
      >
        Pay Now ₦
        {paymentOption === "custom"
          ? formatAmountString(totalSelectedAmount)
          : formatAmountString(fullPaymentAmount)}
      </Button>
    </LoanLayout>
  );
}
