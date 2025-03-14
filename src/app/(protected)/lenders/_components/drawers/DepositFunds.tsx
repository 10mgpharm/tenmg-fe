import React, { useEffect, useState } from "react";
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
import CongratsModal from "./CongratsModal";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

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
  onOpen: () => void;
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

const DepositFunds = ({ isOpen, onOpen, onClose }: DepositFundsProps) => {
  const [step, setStep] = useState(1);

  const [loadingPayment, setLoadingPayment] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed">(
    "success"
  );

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const userToken = sessionData?.user?.token;

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    getValues,
  } = useForm<IFormInput>({ mode: "onChange" });

  useEffect(() => {
    // Dynamically load Fincra's SDK
    const script = document.createElement("script");
    script.src = process.env.NEXT_PUBLIC_FINCRA_SDK_URL;
    // script.src = config?.;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  //   Card Number: 5319 3178 0136 6660
  // Expiry Date: 10/26
  // CVV: 000

  const verifyPayment = async (ref) => {
    try {
      const response = await requestClient({ token: userToken }).get(
        `/lender/deposit/${ref}`
      );
      toast.success("Fund Deposit is successfully");
      setStep(2);
      console.log("response", response);
    } catch (e) {
      toast.error("Oops... Something went wrong...!");
      setPaymentStatus("failed");
      console.log(e);
    }
  };

  const cancelOrder = async (ref) => {
    try {
      const response = await requestClient({ token: userToken }).get(
        `/lender/deposit//${ref}`
      );
      if (response?.status === 200) {
        toast.success("Deposit Funds cancelled successfully...!");
      }
    } catch (e) {
      toast.error("Something went wrong, could not cancel order!");
    }
  };

  const payFincra = (ref: string, amount: string | number) => {
    if (!window.Fincra) {
      alert("Fincra SDK not loaded. Please try again.");
      return;
    }

    window.Fincra.initialize({
      key: process.env.NEXT_PUBLIC_FINCRA_PUBKEY,
      amount: amount,
      currency: "NGN",
      reference: ref,
      customer: {
        name: sessionData?.user?.name,
        email: sessionData?.user?.email,
      },
      feeBearer: "business",
      onClose: () => {
        cancelOrder(ref);
      },
      onSuccess: (data: any) => {
        console.log("data", data);
        verifyPayment(ref);
      },
    });
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoadingPayment(true);
    try {
      const response = await requestClient({ token: userToken }).post(
        "/lender/deposit",
        { amount: Number(data.amount) }
      );
      console.log("submit order res", response?.data?.data?.identifier);
      onClose();
      if (response.status === 200) {
        await payFincra(
          response?.data?.data?.identifier,
          response?.data?.data?.amount
        );
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

  return (
    <OperationLayout
      isOpen={isOpen}
      onClose={handleClose}
      title={
        step === 1
          ? "Deposit Funds"
          : step === 2
          ? "Congratulations"
          : "Failed to Deposit Funds"
      }
      description={
        step === 1
          ? "Enter an amount and a destination to save to"
          : step === 2
          ? "Your funds have been successfully deposited into your account."
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
              isLoading={loadingPayment}
            >
              Continue
            </Button>
          </div>
        </form>
      )}

      {/* {step === 2 && (
        <>
          <Stack spacing={4}>
            <Button
              variant="outline"
              colorScheme="gray"
              h={16}
              justifyContent="space-between"
              p={4}
              rightIcon={<Image src={AmexIcon.src} className="w-10" alt="" />}
            >
              Use Bank Card **** **** 1234
            </Button>

            <Button
              variant="outline"
              h={16}
              colorScheme="gray"
              justifyContent="space-between"
              p={4}
              rightIcon={
                <Image src={MasterCardIcon.src} className="w-10" alt="" />
              }
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

          <Button size="lg" w="full" onClick={submiOrder} mt={10}>
            Continue
          </Button>
        </>
      )} */}

      {step === 2 && <CongratsModal />}
    </OperationLayout>
  );
};

export default DepositFunds;
