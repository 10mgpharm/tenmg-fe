import React, { useState } from "react";
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
  Link,
  Stack,
  Text,
  VStack,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { TbCurrencyNaira } from "react-icons/tb";
import LoanProfile from "../../_components/LoanProfile";
import { formatAmountString } from "@/utils";
import { convertDate } from "@/utils/formatDate";

interface Props {
  business: BusinessDto;
  customer: CustomerDto;
  application: ApplicationDto;
  data: RepaymentWidgetConfig;
  navigateBackAction?: () => void;
  onContinueAction?: () => void;
  pendingPaymentDate: any;
  isSuccessStatus: (status: string | undefined) => boolean;
  lastPaidBalance: string | null;
  pendingAmounts: any[];
}

export default function StepOneLoanDetails({
  business,
  customer,
  application,
  data,
  navigateBackAction,
  onContinueAction,
  pendingPaymentDate,
  isSuccessStatus,
  lastPaidBalance,
  pendingAmounts,
}: Props) {
  const [showAll, setShowAll] = useState(false);

  const displayItems = showAll
    ? data?.repaymentSchedule
    : data?.repaymentSchedule?.slice(0, 3) || [];

    console.log(lastPaidBalance)

  return (
    <LoanLayout
      name={business?.name || ""}
      logo={business?.logo || ""}
      navigateBackAction={navigateBackAction}
      title="Loan Details"
    >
      <LoanProfile name={customer?.name} email={customer?.email} />

      <Stack
        spacing={4}
        borderColor="gray.200"
        border="1px solid var(--tenmg-colors-gray-200)"
        borderRadius="md"
        my={6}
        py={5}
      >
        <Box>
          <Flex gap={3} justifyContent="center" alignItems="center">
            <Badge
              bg="warning.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              textColor="warning.700"
              rounded={16}
              py={1}
              px={3}
            >
              Repayment Amount
            </Badge>
          </Flex>
          <Flex justifyContent="center" alignItems="center" fontSize={60}>
            <TbCurrencyNaira size="24px" className="mt-6" />
            <Text>{
              pendingAmounts.length > 0
                ? formatAmountString(pendingAmounts.reduce((sum, item) => sum + Number(item.totalAmount), 0))
                : formatAmountString(lastPaidBalance || 0)
            }</Text>
          </Flex>
          <Stack justifyContent="center" alignItems="center" fontSize={20}>
            <Badge
              bg="success.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              textColor="success.700"
              rounded={16}
              py={1}
              px={3}
            >
              <Text color="success.700">Total Loan Amount</Text>
            </Badge>
            <Flex justifyContent="center" alignItems="center" fontSize={24}>
              <TbCurrencyNaira className="mt-1" />
              <Text>{formatAmountString(application?.totalAmount)}</Text>
            </Flex>
          </Stack>
        </Box>
        <Divider />
        <Flex
          justifyContent="space-between"
          alignItems="center"
          fontWeight="500"
          px={5}
        >
          <Stack alignItems="center" fontSize="md">
            <Text color="gray.500" fontSize="sm">
              Interest Rate
            </Text>
            <Text>{application?.interestRate}%</Text>
          </Stack>
          {pendingPaymentDate && (
            <Stack alignItems="center">
              <Text color="gray.500" fontSize="sm">
                Next Payment
              </Text>
              <Text>{convertDate(pendingPaymentDate?.dueDate)}</Text>
            </Stack>
          )}
          <Stack alignItems="center">
            <Text color="gray.500" fontSize="sm">
              Loan Duration
            </Text>
            <Text>{application?.durationInMonths} Months</Text>
          </Stack>
        </Flex>
        {/* {lastPaidBalance !== null && (
          <Flex justifyContent="center" mt={2}>
            <Stack alignItems="center">
              <Text color="gray.500" fontSize="sm">
                Remaining Balance (Last Payment)
              </Text>
              <Flex alignItems="center">
                <TbCurrencyNaira />
                <Text fontWeight="500">
                  {formatAmountString(lastPaidBalance)}
                </Text>
              </Flex>
            </Stack>
          </Flex>
        )} */}
      </Stack>

      {data?.repaymentSchedule && data.repaymentSchedule.length > 0 && (
        <Stack
          spacing={5}
          borderColor="gray.200"
          border="1px solid var(--tenmg-colors-gray-200)"
          borderRadius="md"
          my={6}
          p={4}
        >
          <Text fontSize="lg" color="gray.700" fontWeight="500">
            Repayment Schedule
          </Text>

          {displayItems.map((item, index) => (
            <Flex
              justifyContent="space-between"
              alignItems="center"
              fontSize="sm"
              color="gray.800"
              key={index}
            >
              <Box>
                <Text fontSize="md" pb={1}>
                  ₦{formatAmountString(item.totalAmount)}
                </Text>
                <Text color="gray.400">{convertDate(item.dueDate)}</Text>
              </Box>
              <Flex direction="column" alignItems="flex-end" gap={1}>
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
            </Flex>
          ))}

          {data.repaymentSchedule.length > 3 && (
            <Link
              textAlign="center"
              color="blue.500"
              fontWeight="bold"
              fontSize="sm"
              onClick={() => setShowAll(!showAll)}
              cursor="pointer"
            >
              {showAll ? "Show Less" : "View All"}
            </Link>
          )}
        </Stack>
      )}

      <Button w="full" onClick={onContinueAction}>
        Continue to Payment
      </Button>
    </LoanLayout>
  );
}
