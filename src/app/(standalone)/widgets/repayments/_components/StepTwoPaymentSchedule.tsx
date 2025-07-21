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
import { isPendingStatus, isSuccessStatus } from "@/utils/repaymentUtils";

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
  onPaymentSuccess?: () => void;
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
  onPaymentSuccess,
}: Props) {
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("full");
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const handlePaymentToggle = (id: number) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const totalSelectedAmount = selectedPayments.reduce((total, id) => {
    const item = data?.repaymentSchedule?.find((item) => item.id === id);
    return total + (item ? Number(item.totalAmount) : 0);
  }, 0);

  const fullPaymentAmount = pendingAmounts?.reduce(
    (sum, item) => sum + Number(item?.totalAmount),
    0
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = process.env.NEXT_PUBLIC_FINCRA_SDK_URL;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const verifyPayment = async (ref: string, amount: string | number) => {
    try {
      const response = await requestClient({ token }).get(
        `/client/repayment/verify-payment/${ref}`
      );
      toast.success("Fund Repayment is successful");
      if (onContinueAction) {
        onContinueAction(amount);
        if (onPaymentSuccess) {
          await onPaymentSuccess();
        }
      }
    } catch (error) {
      toast.error(`Repayment Error: ${handleServerErrorMessage(error)}`);
    }
  };

  const cancelRepayment = async (ref: string) => {
    try {
      const response = await requestClient({ token }).get(
        `/client/repayment/cancel-payment/${ref}`
      );
      if (response?.status === 200) {
        toast.success("Repayment cancelled successfully");
      }
    } catch {
      toast.error("Could not cancel repayment. Please try again.");
    }
  };

  const payFincra = (ref: string, amount: string | number) => {
    if (!window.Fincra) {
      alert("Fincra SDK not loaded. Please try again.");
      return;
    }

    window.Fincra.initialize({
      key: process.env.NEXT_PUBLIC_FINCRA_PUBKEY,
      amount,
      currency: "NGN",
      reference: ref,
      customer: {
        name: customer?.name,
        email: customer?.email,
      },
      feeBearer: "business",
      onClose: () => cancelRepayment(ref),
      onSuccess: () => verifyPayment(ref, amount),
    });
  };

  const onSubmit: SubmitHandler<IFormInput> = async ({ amount }) => {
    setLoadingPayment(true);
    try {
      const response = await requestClient({ token }).post(
        "/client/repayment",
        {
          amount: Number(amount),
          reference: data?.identifier,
          paymentType: paymentOption === "custom" ? "partPayment" : "fullPayment",
          noOfMonths:
            paymentOption === "custom"
              ? selectedPayments.length
              : data?.repaymentSchedule?.length,
        }
      );

      if (response.status === 200) {
        const { reference: payRef, amount: payAmt } = response.data.data.init;
        payFincra(payRef, Number(payAmt));
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(handleServerErrorMessage(error));
    } finally {
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

      <RadioGroup
        defaultValue="full"
        value={paymentOption}
        onChange={(val) => setPaymentOption(val as PaymentOption)}
      >
        <Stack
          spacing={4}
          direction={{ base: "column", md: "row" }}
          border="1px solid var(--tenmg-colors-gray-200)"
          borderRadius="md"
          my={6}
          p={2}
        >
          {["custom", "full"].map((opt) => (
            <Flex
              key={opt}
              flex={1}
              border="1px solid var(--tenmg-colors-gray-200)"
              borderRadius="md"
              justifyContent="space-between"
              p={4}
            >
              <Box>
                <Text fontSize="md" color="gray.700">
                  {opt === "custom" ? "Custom Payment" : "Full Payment"}
                </Text>
                <Flex>
                  {opt === "custom"
                    ? "Select from schedule"
                    : `₦${formatAmountString(fullPaymentAmount)}`}
                </Flex>
              </Box>
              <Radio value={opt} />
            </Flex>
          ))}
        </Stack>
      </RadioGroup>

      {paymentOption === "custom" && data?.repaymentSchedule && (
        <Stack
          spacing={3}
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
                bg={
                  isSuccessStatus(item.paymentStatus)
                    ? "success.50"
                    : "warning.50"
                }
                color={
                  isSuccessStatus(item.paymentStatus)
                    ? "success.700"
                    : "warning.700"
                }
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
        border="1px solid var(--tenmg-colors-warning-400)"
        borderRadius="md"
        bg="warning.100"
        my={6}
        py={4}
        px={4}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="md">Total</Text>
          <Text fontSize="md">
            ₦{formatAmountString(
              paymentOption === "custom"
                ? totalSelectedAmount
                : fullPaymentAmount
            )}
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
        {formatAmountString(
          paymentOption === "custom"
            ? totalSelectedAmount
            : fullPaymentAmount
        )}
      </Button>
    </LoanLayout>
  );
}
