import React, { useState } from "react";
import OperationLayout from "../OperationLayout";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  Stack,
  Text,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";

import SuccessIcon from "@public/assets/images/money-success.png";
import AmexIcon from "@public/assets/images/amex-logo.png";
import MasterCardIcon from "@public/assets/images/mastercard-logo.png";

import {
  BuildingLibraryIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import StatusBadge from "@/app/(protected)/_components/StatusBadge";

interface PaymentOption {
  label: string;
  value: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

interface IFormInput {
  amount: number;
}

interface DepositFundsProps {
  isOpen: boolean;
  onClose: () => void;
}

// const paymentOptions: PaymentOption[] = [
//   {
//     label: "Use Bank Card **** **** 1234",
//     value: "amex",
//     rightIcon: <Image src={AmexIcon.src} className="" />,
//   },
//   {
//     label: "Use Bank Card **** **** 5678",
//     value: "mastercard",
//     rightIcon: <Image src={MasterCardIcon.src} className="" />,
//   },
//   {
//     label: "Enter New Card + Go to Settings",
//     value: "newcard",
//     leftIcon: <Icon as={CreditCardIcon} h={6} w={6} />,
//   },
//   {
//     label: "Pay with Bank",
//     value: "bank",
//     leftIcon: <Icon as={BuildingLibraryIcon} h={6} w={6} />,
//   },
// ];

const DepositFunds = ({ isOpen, onClose }: DepositFundsProps) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

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
      title={
        step === 1
          ? "Deposit Funds"
          : step === 2
          ? "Select Payment Options"
          : "Congratulations"
      }
      description={
        step === 1
          ? "Enter an amount and a destination to save to"
          : step === 2
          ? "Click any of the options below to quick save immediately"
          : "Your funds have been successfully deposited into your account."
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
                  type={"number"}
                  placeholder="E.g. N12,092,894"
                  {...register("amount", {
                    required: "Amount is required",
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
      )}

      {step === 2 && (
        <>
          <Stack spacing={4}>
            <Button
              variant="outline"
              colorScheme="gray"
              h={16}
              justifyContent="space-between"
              p={4}
              rightIcon={<Image src={AmexIcon.src} className="w-10 " />}
            >
              Use Bank Card **** **** 1234
            </Button>

            <Button
              variant="outline"
              h={16}
              colorScheme="gray"
              justifyContent="space-between"
              p={4}
              rightIcon={<Image src={MasterCardIcon.src} className="w-10 " />}
            >
              Use Bank Card **** **** 5678
            </Button>

            <Button
              p={4}
              variant="outline"
              colorScheme="gray"
              h={16}
              justifyContent="flex-start"
              leftIcon={<Icon as={CreditCardIcon} h={6} w={6} />}
              w="full"
            >
              <Flex justifyContent="space-between" w="full">
                Enter New Card
                <Button variant="link">Go to Settings</Button>
              </Flex>
            </Button>

            <Button
              p={4}
              variant="outline"
              colorScheme="gray"
              h={16}
              justifyContent="flex-start"
              leftIcon={<Icon as={BuildingLibraryIcon} h={6} w={6} />}
              w="full"
            >
              Pay with Bank
            </Button>
          </Stack>

          <Button size="lg" w="full" onClick={nextStep} mt={10}>
            Continue
          </Button>
        </>
      )}

      {step === 3 && (
        <Box>
          <Stack spacing={4} align="center">
            <Image
              src={SuccessIcon.src}
              alt="Success"
              width={200}
              height={200}
            />
          </Stack>
          <Text color="green.500" fontSize="4xl" fontWeight={700} mb={2}>
            +$9000
          </Text>
          <Text fontSize="sm" color="gray.600" fontWeight={400}>
            Tue, 10 Sept 2024, 19:40
          </Text>

          <Stack
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            fontSize="sm"
            fontWeight={500}
            p={4}
            color="gray.600"
            spacing={4}
            mt={6}
          >
            <Flex alignItems="center" justifyContent="space-between">
              <Text>Status</Text>
              <Text fontWeight={700} color="gray.900">
                <StatusBadge
                  status="Completed"
                  bgColor="green.50"
                  color="green.500"
                />
              </Text>
            </Flex>

            <Flex justifyContent="space-between" alignItems="center">
              <Text>Wallet Credit</Text>

              <Text color="gray.500">Self</Text>
            </Flex>

            <Flex justify="space-between" alignItems="center">
              <Text fontWeight="semibold">Transaction Type</Text>
              <Text>NIP OUTWARD TRANSFER</Text>
            </Flex>

            <Flex justify="space-between" alignItems="center">
              <Text fontWeight="semibold">SessionID</Text>
              <Text>00001324019929464</Text>
            </Flex>

            <Flex justify="space-between" alignItems="center">
              <Text fontWeight="semibold">Remark</Text>
              <Text>00001324019929464</Text>
            </Flex>
          </Stack>
        </Box>
      )}
    </OperationLayout>
  );
};

export default DepositFunds;
