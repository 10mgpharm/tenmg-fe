"use client";

import React, { useEffect, useState, useRef, useTransition } from "react";
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
import { useForm, SubmitHandler } from "react-hook-form";
import LoanProfile from "../../_components/LoanProfile";
import LoanLayout from "../../_components/LoanLayout";
import {
  BusinessDto,
  CustomerDto,
  ApplicationDto,
  BankDto,
  BankAccountDto,
  BankMandateDto,
} from "@/types";
import { CheckCircle, TimerIcon } from "lucide-react";
import { formatAmount } from "@/utils/formatAmount";
import { getBankMandate } from "../actions";
import Loader from "@/app/(protected)/admin/_components/Loader";

interface Props {
  token: string;
  business: BusinessDto;
  customer: CustomerDto;
  application: ApplicationDto;
  defaultBankDetail?: BankAccountDto;
  navigateBackAction?: () => void;
  onContinueAction?: (defaultBankAccount: BankAccountDto) => void;
  mandateDetail: BankMandateDto;
  mandateDetailRef: React.MutableRefObject<BankMandateDto | null>;
}

export default function StepFiveMandateScreen({
  token,
  defaultBankDetail,
  business,
  application,
  customer,
  navigateBackAction,
  onContinueAction,
  mandateDetail,
  mandateDetailRef,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleGetBankMandate = () => {
    startTransition(async () => {
      const response = await getBankMandate(token, mandateDetail?.reference);
      if (response.status === "error") {
        console.log(response);
      } else {
        console.log(response.data);
      }
    });
  };

  // To extract monetary amount (e.g., "N50:00")
  const amountRegex = /N(\d+):(\d{2})/;

  // To extract account number (e.g., "0008787867")
  const accountNumberRegex = /account number[^0-9]*(\d+)/;

  // To extract bank name (e.g., "GTBank")
  const bankNameRegex = /" with\s+(\w+)/;

  const parseResponseDescription = (description: string) => {
    if (!description)
      return { amount: null, accountNumber: null, bankName: null };
    const amountMatch = description.match(amountRegex);
    const accountMatch = description.match(accountNumberRegex);
    const bankMatch = description.match(bankNameRegex);

    return {
      amount: amountMatch ? `${amountMatch[1]}.${amountMatch[2]}` : null,
      accountNumber: accountMatch ? accountMatch[1] : null,
      bankName: bankMatch ? bankMatch[1] : null,
    };
  };

  const parseFullDescription = (description: string) => {

    console.log(description);
    if (!description) return null;
    const descriptionRegex =
      /token payment of\s+(N\d+:\d{2})\s+into account number\s+"?(\d+)"?\s+with\s+(\w+)/i;
    const match = description.match(descriptionRegex);
    console.log(match);
  };

  // Usage example
  const mandateInfo = parseResponseDescription(
    mandateDetailRef?.current?.responseDescription
  );

  const { hasCopied: copiedAccount, onCopy: copyAccount } = useClipboard(
    mandateInfo?.accountNumber
  );

  const { hasCopied: copiedAmount, onCopy: copyAmount } = useClipboard(
    mandateInfo?.amount
  );
  // Output: { amount: "N50:00", accountNumber: "0008787867", bankName: "GTBank" }

  useEffect(() => {
    if (token) {
      handleGetBankMandate();
    }
  }, [token]);

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

        {isPending ? (
          <Loader />
        ) : (
          <>
            {" "}
            <Text
              fontSize="base"
              fontWeight="bold"
              textAlign="center"
              mb={4}
              color="warning.500"
            >
              {parseFullDescription(
                mandateDetailRef?.current?.responseDescription
              )}
            </Text>
            {/* Payment Details */}
            <VStack spacing={4} bg="gray.50" p={4} borderRadius="md">
              {/* Bank Name */}
              <HStack w="full" justify="space-between">
                <Text fontSize="sm" fontWeight="bold">
                  BANK NAME
                </Text>
                {/* <Text fontSize="sm" color="blue.500" cursor="pointer">
                CHANGE BANK
              </Text> */}
              </HStack>
              <Text fontSize="lg" fontWeight="bold">
                {mandateInfo?.bankName}
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
                value={mandateInfo.accountNumber}
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
                {mandateInfo?.amount ? formatAmount(mandateInfo?.amount) : ""}
              </Text>
            </VStack>
            {/* Countdown Timer */}
            {/* <VStack mt={4}>
              <Icon as={TimerIcon} color="green.500" boxSize={6} />
              <Text fontSize="sm" color="gray.600">
                Expires in{" "}
                <Text as="span" color="green.500">
                  {formatTime(timeLeft)}
                </Text>
              </Text>
            </VStack> */}
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
        )}
      </>
    </LoanLayout>
  );
}
