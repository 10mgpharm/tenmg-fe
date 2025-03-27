import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import StatusBadge from "@/app/(protected)/_components/StatusBadge";
import CongratsModal from "./CongratsModal";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { toast } from "react-toastify";
import { handleServerErrorMessage, formatAmountString } from "@/utils";

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
  onSuccess?: () => void;
  setAmount: Dispatch<SetStateAction<number>>;
}

const DepositFunds = ({
  isOpen,
  onClose,
  onSuccess,
  setAmount,
}: DepositFundsProps) => {
  const [step, setStep] = useState(1);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed">(
    "success"
  );

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const userToken = sessionData?.user?.token;

  const handleClose = () => {
    onClose();
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
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

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const verifyPayment = async (ref, amount) => {
    try {
      const response = await requestClient({ token: userToken }).get(
        `/lender/deposit/${ref}`
      );
      toast.success("Fund Deposit is successful");
      setAmount(amount);
      onSuccess();
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(`Deposit Error: ${errorMessage}`);
      setPaymentStatus("failed");
    }
  };

  const cancelOrder = async (ref, amount) => {
    try {
      const response = await requestClient({ token: userToken }).post(
        `/lender/deposit/cancel/${ref}`,
        {
          amount: amount,
        }
      );
      if (response?.status === 200) {
        toast.success("Deposit Funds cancelled successfully...!");
      }
    } catch (e) {
      toast.error("Something went wrong, could not cancel order!");
      // toast.success("Deposit Funds cancelled successfully...!");
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
        cancelOrder(ref, amount);
      },
      onSuccess: (data: any) => {
        verifyPayment(ref, amount);
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

  const resetForm = () => {
    reset();
  };

  return (
    <>
      <OperationLayout
        isOpen={isOpen}
        onClose={handleClose}
        title="Deposit Funds"
        description="Enter an amount and a destination to save to"
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
      </OperationLayout>
    </>
  );
};

export default DepositFunds;
