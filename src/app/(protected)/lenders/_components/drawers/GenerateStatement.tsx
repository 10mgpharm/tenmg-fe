import React, { useState } from "react";
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
}

interface GenerateStatementProps {
  isOpen: boolean;
  onClose: () => void;
}

const GenerateStatement = ({ isOpen, onClose }: GenerateStatementProps) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  
  const handleClose = () => {
    setStep(1);
    onClose();
  };

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
      title="Deposit Funds"
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
                type={"number"}
                placeholder="E.g. N12,092,894"
                {...register("amount", {
                  required: "Amount is required",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters.",
                  },
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
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
    </OperationLayout>
  );
};

export default GenerateStatement;
