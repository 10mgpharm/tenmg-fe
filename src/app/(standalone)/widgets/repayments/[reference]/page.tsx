import React from "react";
import LoanLayout from "../../_components/LoanLayout";
import LoanProfile from "../../_components/LoanProfile";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { TbCurrencyNaira } from "react-icons/tb";

interface IRepaymentSchedule {
  amount: string;
  date: string;
  status: string;
}

const data: IRepaymentSchedule[] = [
  {
    amount: "56,000.00",
    date: "21st September",
    status: "Paid",
  },
  {
    amount: "56,000.00",
    date: "21st September",
    status: "Pending",
  },
  {
    amount: "56,000.00",
    date: "21st September",
    status: "Pending",
  },
];

export default function ExternalCreditRepayment() {
  return (
    <LoanLayout title="Loan" name={""} logo={""}>
      <LoanProfile name={""} email={""} />

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
            Repayment Overdue
          </Badge>
        </Flex>
        <Flex justifyContent="center" alignItems="center" fontSize={64}>
          <TbCurrencyNaira size="24px" />
          <Text>1,250,000</Text>
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
            <Text>25%</Text>
          </Stack>
          <Stack alignItems="center">
            <Text color="gray.500" fontSize="sm">
              Next Payment
            </Text>
            <Text>21st October, 2024</Text>
          </Stack>
          <Stack alignItems="center">
            <Text color="gray.500" fontSize="sm">
              Loan Duration
            </Text>
            <Text>9 Months</Text>
          </Stack>
        </Flex>
      </Stack>

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

        {data.map((item, index) => (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            fontSize="sm"
            color="gray.800"
            key={index}
          >
            <Box>
              <Text fontSize="md" pb={1}>
                {item.amount}
              </Text>
              <Text color="gray.400">{item.date}</Text>
            </Box>
            <Badge
              bg={`${item.status === "Paid" ? "success.50" : "warning.50"} `}
              display="flex"
              alignItems="center"
              justifyContent="center"
              textColor={`${
                item.status === "Paid" ? "success.700" : "warning.700"
              } `}
              rounded={16}
              py={1}
              px={3}
            >
              {item.status}
            </Badge>
          </Flex>
        ))}
        <Link
          textAlign="center"
          color="blue.500"
          fontWeight="bold"
          fontSize="sm"
        >
          View All
        </Link>
      </Stack>

      <Button w="full">Pay Now</Button>
    </LoanLayout>
  );
}
