import React from "react";
import OperationLayout from "../OperationLayout";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  amount: number;
  reasons: string;
}

interface WithdrawFundsProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawFunds = ({ isOpen, onClose }: WithdrawFundsProps) => {
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
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
      onClose={onClose}
      title="Withdraw Funds"
      description="Enter an amount and a destination to save to"
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
              <Text fontSize="sm" color="gray.400" mt={2}>
                GTBank:39999292929292
              </Text>
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
            // isDisabled={isLoading}
            // isLoading={isLoading}
            loadingText="Submitting..."
          >
            Continue
          </Button>
        </div>
      </form>
    </OperationLayout>
  );
};

export default WithdrawFunds;
