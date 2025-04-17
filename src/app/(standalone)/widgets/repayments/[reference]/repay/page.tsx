"use client";

import React from "react";
import LoanLayout from "../../../_components/LoanLayout";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Link,
  Radio,
  RadioGroup,
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
    <LoanLayout title="Repay Loan" name={""} logo={""}>
      <Text>How much would you like to repay?</Text>

      {/* TODO: Add Grouping for the radio button */}
      <RadioGroup defaultValue="1">
        <Stack
          spacing={4}
          direction="row"
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
              <Text fontSize="lg" color="gray.700">
                Next Payment
              </Text>
              <Flex>₦ 1,256,000.00</Flex>
            </Box>
            <Radio value="1" />
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
              <Text fontSize="lg" color="gray.700">
                Full Payment
              </Text>
              <Flex>₦ 1,256,000.00</Flex>
            </Box>
            <Radio value="2" />
          </Flex>
        </Stack>
      </RadioGroup>

      <FormControl>
        <FormLabel
          htmlFor="loanAmount"
          fontSize="lg"
          color="gray.700"
          fontWeight="500"
        >
          Enter Specific Amount
        </FormLabel>
        <Input
          px="10px"
          py="14px"
          id="loanAmount"
          placeholder="Enter amount you want to pay now"
        />
        <FormErrorMessage>{"Error"}</FormErrorMessage>
      </FormControl>

      {/* TODO: Revamp this */}

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
            Service Fee Late Fee
          </Text>

          <Text fontSize="md" pb={1}>
            ₦60
          </Text>
        </Flex>
        <Divider />
        <Flex
          justifyContent="space-between"
          alignItems="center"
          fontSize="sm"
          color="gray.800"
          px={4}
        >
          <Text fontSize="md" pb={1}>
            Late Fee
          </Text>

          <Text fontSize="md" pb={1}>
            ₦5,000
          </Text>
        </Flex>
        <Divider />
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
            ₦61,060
          </Text>
        </Flex>
      </Stack>

      <Button w="full">Pay ₦61,060</Button>
    </LoanLayout>
  );
}
