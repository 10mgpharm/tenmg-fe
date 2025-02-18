import React, { useState } from "react";
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
import CongratsModal from "./CongratsModal";
import StatusBadge from "@/app/(protected)/_components/StatusBadge";

interface IFormInput {
  amount: number;
  reasons: string;
}

interface WithdrawFundsProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawFunds = ({ isOpen, onClose }: WithdrawFundsProps) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);

  const handleClose = () => {
    setStep(1);
    onClose();
  };
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    nextStep();
    console.log(data);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IFormInput>({ mode: "onChange" });

  return (
    <OperationLayout
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 1 ? "Withdraw Funds" : "Congratulation"}
      description={
        step === 1
          ? "Enter an amount and a destination to save to"
          : "Your funds have been successfully transferred"
      }
    >
      {step === 1 && (
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
                <StatusBadge
                  status="GTBank:39999292929292"
                  bgColor="green.50"
                  color="green.500"
                  isDot
                />
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

            <Button
              size="lg"
              w="full"
              type="submit"
              loadingText="Submitting..."
            >
              Continue
            </Button>
          </div>
        </form>
      )}

      {step === 2 && <CongratsModal status="withdraw" />}
    </OperationLayout>
  );
};

export default WithdrawFunds;
