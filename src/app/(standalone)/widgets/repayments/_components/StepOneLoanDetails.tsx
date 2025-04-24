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
}

export default function StepOneLoanDetails({
  business,
  customer,
  application,
  data,
  navigateBackAction,
  onContinueAction,
}: Props) {
  const [showAll, setShowAll] = useState(false);

  const displayItems = showAll
    ? data?.repaymentSchedule
    : data?.repaymentSchedule?.slice(0, 3) || [];

  // Check for "PENDING" status in a case-insensitive way
  const isPendingStatus = (status: string | undefined) => {
    if (!status) return false;
    return status.toUpperCase() === "PENDING";
  };

  const pendingPayment =
    data?.repaymentSchedule?.find((item) => isPendingStatus(item.paymentStatus)) || null;

  // Check if payment status is successful (handles both upper and lowercase variants)
  const isSuccessStatus = (status: string | undefined) => {
    if (!status) return false;
    return status.toUpperCase() === "SUCCESS";
  };

  return (
    <LoanLayout
      name={business?.name || ""}
      logo={business?.logo || ""}
      navigateBackAction={navigateBackAction}
      title="Loan Details"
    >
      <LoanProfile name={customer?.name} email={customer?.email} />

      <Stack
        spacing={5}
        borderColor="gray.200"
        border="1px solid var(--tenmg-colors-gray-200)"
        borderRadius="md"
        my={6}
        py={5}
      >
        <Flex gap={3} justifyContent="center" alignItems="center">
          <Text fontSize="lg" color="gray.700">
            Credit Amount
          </Text>
          {/* <Badge
            bg="warning.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textColor="warning.700"
            rounded={16}
            py={1}
            px={3}
          >
            Repayment Overdue
          </Badge> */}
        </Flex>
        <Flex justifyContent="center" alignItems="center" fontSize={64}>
          <TbCurrencyNaira size="24px" className="mt-6" />
          <Text>{formatAmountString(application?.totalAmount)}</Text>
        </Flex>
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
          {pendingPayment && (
            <Stack alignItems="center">
              <Text color="gray.500" fontSize="sm">
                Next Payment
              </Text>
              <Text>{convertDate(pendingPayment?.dueDate)}</Text>
            </Stack>
          )}
          <Stack alignItems="center">
            <Text color="gray.500" fontSize="sm">
              Loan Duration
            </Text>
            <Text>{application?.durationInMonths} Months</Text>
          </Stack>
        </Flex>
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
              <Badge
                bg={`${
                  isSuccessStatus(item.paymentStatus) ? "success.50" : "warning.50"
                } `}
                display="flex"
                alignItems="center"
                justifyContent="center"
                textColor={`${
                  isSuccessStatus(item.paymentStatus) ? "success.700" : "warning.700"
                } `}
                rounded={16}
                py={1}
                px={3}
              >
                {item.paymentStatus}
              </Badge>
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
