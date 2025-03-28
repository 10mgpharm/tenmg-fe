import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import OperationLayout from "../OperationLayout";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import StatusBadge from "@/app/(protected)/_components/StatusBadge";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { toast } from "react-toastify";
import { handleServerErrorMessage, formatAmountString } from "@/utils";

interface IFormInput {
  amount: number;
  reasons: string;
}

interface WithdrawFundsProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: any;
  onSuccess?: () => void;
  setAmount: Dispatch<SetStateAction<number>>;
  setIsWithdraw: Dispatch<SetStateAction<boolean>>;
}

const WithdrawFunds = ({
  isOpen,
  onClose,
  wallet,
  onSuccess,
  setAmount,
  setIsWithdraw,
}: WithdrawFundsProps) => {
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const sessionToken = sessionData?.user?.token;

  const [loadingPayment, setLoadingPayment] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoadingPayment(true);
    try {
      const response = await requestClient({ token: sessionToken }).post(
        "/lender/dashboard/withdraw-funds",
        {
          amount: data.amount,
          bankName: wallet?.lenderBankAccount?.bankName,
          accountName: wallet?.lenderBankAccount?.accountName,
          accountNumber: wallet?.lenderBankAccount?.accountNumber,
          bankCode: wallet?.lenderBankAccount?.bankCode,
        }
      );
      if (response.status === 200) {
        setAmount(data.amount);
        handleClose();
        onSuccess();
        setIsWithdraw(true);
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

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm<IFormInput>({ mode: "onChange" });

  return (
    <OperationLayout
      isOpen={isOpen}
      onClose={handleClose}
      title="Withdraw Funds"
      description="Enter an amount for funds to be withdrawn to"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 text-gray mb-10">
          <FormControl isInvalid={!!errors.amount} mb={6}>
            <FormLabel htmlFor="amount">Enter Amount</FormLabel>
            <InputGroup>
              <InputLeftElement>₦</InputLeftElement>
              <Input
                id="amount"
                type="number"
                placeholder="E.g. N12,092,894"
                {...register("amount", {
                  required: "Amount is required",
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            {!!!errors.amount && (
              <div className="mt-2">
                <StatusBadge
                  status={
                    wallet?.lenderBankAccount?.bankName +
                    ": " +
                    wallet?.lenderBankAccount?.accountNumber
                  }
                  bgColor="green.50"
                  color="green.500"
                  isDot
                />
              </div>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.reasons} mb={6}>
            <FormLabel htmlFor="reasons">Reason for Withdrawal</FormLabel>
            <InputGroup>
              <Input
                id="reasons"
                type="text"
                placeholder="Rent, School Fees, etc"
                {...register("reasons", {
                  required: "Reason is required",
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors.reasons?.message}</FormErrorMessage>
          </FormControl>

          <Button size="lg" w="full" type="submit" loadingText="Submitting...">
            Continue
          </Button>
        </div>
      </form>
    </OperationLayout>
  );
};

export default WithdrawFunds;
