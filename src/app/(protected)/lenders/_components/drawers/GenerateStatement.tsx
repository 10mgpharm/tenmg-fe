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
import GenerateDateRange from "../GenerateDateRange";
import GenerateIcon from "@public/assets/images/generate-image.png";

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

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    nextStep();
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
      title={step === 1 ? "Generate Statement" : "Account Statement Generated"}
      description={
        step === 1
          ? "Enter an amount and a destination to save to"
          : "Your account statement is now ready for your review, Also check your email for a copy."
      }
    >
      {step === 1 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5 text-gray mb-10">
            <FormControl isInvalid={!!errors.amount} mb={6}>
              <GenerateDateRange />
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
      )}
      {step === 2 && (
        <Box>
          <Stack spacing={4} align="center">
            <Image
              src={GenerateIcon.src}
              alt="Success"
              width={320}
              height={320}
            />
          </Stack>

          <Button size="lg" w="full" onClick={handleClose} mt={10}>
            Save in Device
          </Button>
        </Box>
      )}
    </OperationLayout>
  );
};

export default GenerateStatement;
