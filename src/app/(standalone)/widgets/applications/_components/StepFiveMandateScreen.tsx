"use client";

import React, { useState, useTransition, useCallback, useMemo } from "react";
import {
  Box,
  Text,
  Center,
  Button,
  Link,
  Flex,
  Input,
  VStack,
  HStack,
  Icon,
  useClipboard,
} from "@chakra-ui/react";
import { LuCopy } from "react-icons/lu";
import LoanProfile from "../../_components/LoanProfile";
import LoanLayout from "../../_components/LoanLayout";
import {
  BusinessDto,
  CustomerDto,
  ApplicationDto,
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

const parseResponseDescription = (description: string) => {
  if (!description)
    return { amount: null, accountNumber: null, bankName: null };
  const amountMatch = description.match(/N(\d+):(\d{2})/);
  const accountMatch = description.match(/account number[^0-9]*(\d+)/);
  const bankMatch = description.match(/" with\s+(\w+)/);
  return {
    amount: amountMatch ? `${amountMatch[1]}.${amountMatch[2]}` : null,
    accountNumber: accountMatch ? accountMatch[1] : null,
    bankName: bankMatch ? bankMatch[1] : null,
  };
};

const parseFullDescription = (description: string) => {
  const convertedAmount = description.replace(/(N\d+):(\d{2})/g, "$1.$2");
  const unquotedAccount = convertedAmount.split('\\"').join('');
  
  return unquotedAccount;
};

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
  const handleGetBankMandate = useCallback(() => {
    startTransition(async () => {
      const response = await getBankMandate(
        token,
        mandateDetail?.reference ?? mandateDetailRef?.current?.reference
      );
      if (response.status === "error") {
        console.error(response);
      } else {
        console.log("Mandate response:", response.data);
        if (response.data.status === "approved") {
          onContinueAction(defaultBankDetail);
        }
      }
    });
  }, [token, mandateDetail, mandateDetailRef, startTransition]);

  // Parse the response description to get the bank name, account number, and amount
  const mandateInfo = useMemo(
    () =>
      parseResponseDescription(
        mandateDetailRef?.current?.responseDescription || ""
      ),
    [mandateDetailRef?.current?.responseDescription]
  );

  const { hasCopied: copiedAccount, onCopy: copyAccount } = useClipboard(
    mandateInfo.accountNumber || ""
  );
  const { hasCopied: copiedAmount, onCopy: copyAmount } = useClipboard(
    mandateInfo.amount || ""
  );

  return (
    <LoanLayout
      name={business?.name}
      logo={business?.logo}
      navigateBackAction={navigateBackAction}
    >
      <>
        <section className="flex justify-between items-center w-full pb-8">
          <LoanProfile name={customer?.name} email={customer?.email} />
        </section>

        {isPending ? (
          <Loader />
        ) : (
          <>
            <Text
              fontSize="base"
              fontWeight="bold"
              textAlign="center"
              mb={4}
              color="warning.500"
            >
              {parseFullDescription(
                mandateDetailRef?.current?.responseDescription || ""
              )}
            </Text>
            <VStack spacing={4} bg="gray.50" p={4} borderRadius="md">
              <HStack w="full" justify="space-between">
                <Text fontSize="sm" fontWeight="bold">
                  BANK NAME
                </Text>
              </HStack>
              <Text fontSize="lg" fontWeight="bold">
                {mandateInfo.bankName}
              </Text>
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
                value={mandateInfo.accountNumber || ""}
                isReadOnly
                variant="unstyled"
                textAlign="center"
                fontSize="xl"
                fontWeight="bold"
              />
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
                {mandateInfo.amount ? formatAmount(mandateInfo.amount) : ""}
              </Text>
            </VStack>
            <Flex
              justifyItems="between"
              alignItems="center"
              gap={5}
              mt={5}
              mb={8}
            >
              <Button
                colorScheme="blue"
                size="lg"
                w="full"
                type="button"
                onClick={handleGetBankMandate}
                isLoading={isPending}
                loadingText="Loading..."
              >
                I have transferred the fund
              </Button>
            </Flex>
            <Center gap={2}>
              <Text fontSize="sm" lineHeight={5}>
                By clicking on continue you agree with{" "}
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
