"use client";

import React, { useEffect, useRef, useTransition } from "react";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Center,
  Select,
  Button,
  FormErrorMessage,
  Link,
  Flex,
  NumberInput,
  NumberInputField,
  Skeleton,
  Stack,
  Input,
  useClipboard,
  Icon,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { LuCopy } from "react-icons/lu";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import LoanProfile from "../../_components/LoanProfile";
import LoanLayout from "../../_components/LoanLayout";
import {
  BusinessDto,
  CustomerDto,
  ApplicationDto,
  BankDto,
  BankAccountDto,
} from "@/types";
import { CheckCircle, TimerIcon } from "lucide-react";

interface Props {
  token: string;
  business: BusinessDto;
  customer: CustomerDto;
  application: ApplicationDto;
  defaultBankDetail?: BankAccountDto;
  navigateBackAction?: () => void;
  onContinueAction?: (defaultBankAccount: BankAccountDto) => void;
}

export default function StepFiveMandateScreen({
  token,
  defaultBankDetail,
  business,
  application,
  customer,
  navigateBackAction,
  onContinueAction,
}: Props) {
  const bankDetails = {
    accountName: "",
    accountNumber: "1190217102",
    bankName: "United Bank for Africa",
    amount: application.requestedAmount,
  };

  const { hasCopied: copiedAccount, onCopy: copyAccount } = useClipboard(
    bankDetails.accountNumber
  );
  const { hasCopied: copiedAmount, onCopy: copyAmount } = useClipboard(
    bankDetails.amount.toString()
  );

  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <LoanLayout
      name={business?.name}
      logo={business?.logo}
      navigateBackAction={navigateBackAction}
    >
      <>
        <section className="flex justify-between items-center w-full pb-8">
          <LoanProfile name={customer?.name} email={customer?.email} />
          <IoMdInformationCircleOutline className="w-6 h-6" />
        </section>

        <Text fontSize="lg" fontWeight="bold" textAlign="center" mb={4}>
          Initiate Mandate of NGN {bankDetails.amount}
        </Text>

        {/* Payment Details */}
        <VStack spacing={4} bg="gray.50" p={4} borderRadius="md">
          {/* Bank Name */}
          <HStack w="full" justify="space-between">
            <Text fontSize="sm" fontWeight="bold">
              BANK NAME
            </Text>
            <Text fontSize="sm" color="blue.500" cursor="pointer">
              CHANGE BANK
            </Text>
          </HStack>
          <Text fontSize="lg" fontWeight="bold">
            {bankDetails.bankName}
          </Text>

          {/* Account Number */}
          <HStack w="full" justify="space-between">
            <Text fontSize="sm" fontWeight="bold">
              ACCOUNT NUMBER
            </Text>
            <Button onClick={copyAccount} size="xs" variant="ghost">
              <Icon
                as={copiedAccount ? CheckCircle : LuCopy}
                color={copiedAccount ? "green.500" : "gray.500"}
              />
            </Button>
          </HStack>
          <Input
            value={bankDetails.accountNumber}
            isReadOnly
            variant="unstyled"
            textAlign="center"
            fontSize="xl"
            fontWeight="bold"
          />

          {/* Amount */}
          <HStack w="full" justify="space-between">
            <Text fontSize="sm" fontWeight="bold">
              AMOUNT
            </Text>
            <Button onClick={copyAmount} size="xs" variant="ghost">
              <Icon
                as={copiedAmount ? CheckCircle : LuCopy}
                color={copiedAmount ? "green.500" : "gray.500"}
              />
            </Button>
          </HStack>
          <Text fontSize="lg" fontWeight="bold" color="green.600">
            {bankDetails.amount}
          </Text>
        </VStack>

        {/* Instruction */}
        <Text fontSize="xs" color="gray.500" textAlign="center" mt={4}>
          Search for {bankDetails.bankName} on your bank app.
          Use this account for this transaction only.
        </Text>

        {/* Countdown Timer */}
        <VStack mt={4}>
          <Icon as={TimerIcon} color="green.500" boxSize={6} />
          <Text fontSize="sm" color="gray.600">
            Expires in{" "}
            <Text as="span" color="green.500">
              {formatTime(timeLeft)}
            </Text>
          </Text>
        </VStack>

        <Flex
          justifyItems={"between"}
          alignItems={"center"}
          gap={5}
          mt={5}
          mb={8}
        >
          <Button
            colorScheme="blue"
            size="lg"
            w="full"
            type="submit"
            // isLoading={saveBankLoading}
            loadingText="Loading..."
          >
            I&apos;ve Sent the Money
          </Button>
        </Flex>
        <Center gap={2}>
          <Text fontSize="sm" lineHeight={5}>
            By clicking on continue you agree with
            <Link paddingLeft={1} color="blue.500" fontWeight="bold">
              10MG User End Policy
            </Link>
          </Text>
        </Center>
      </>
    </LoanLayout>
  );
}
