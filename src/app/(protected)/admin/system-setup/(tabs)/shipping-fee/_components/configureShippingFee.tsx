import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
interface IFormInput {
  id: number;
  type: "FIXED";
  fee: string;
}

const ConfigureShippingFee = ({
  open,
  refetchData,
  onClose,
  defaultValue,
  data,
}: {
  open: boolean;
  refetchData: () => void;
  onClose: () => void;
  defaultValue: number;
  data: IFormInput;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: data,
  });

  const setShippingFee: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      const response = await requestClient({ token: token }).put(
        `/admin/settings/shipping-fee`,
        data
      );
      if (response.status === 200) {
        toast.success("Shipping fee set successfully");
        refetchData();
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error setting shipping fee");
    }

    setIsLoading(false);
  };

  return (
    <Modal isOpen={open} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          <h3>Set Shipping Fee</h3>
          <p className="text-sm text-gray-700 font-normal">
            This amount serves as a uniform shipping fee for all regions
          </p>
        </ModalHeader>
        <ModalBody>
          <form
            className=" bg-white  rounded-md space-y-4 "
            onSubmit={handleSubmit(setShippingFee)}
          >
            <FormControl
              isInvalid={!!errors.fee?.message}
              className="w-full max-w-[400px]"
            >
              <FormLabel>Enter Amount(₦)</FormLabel>
              <Input
                type={"number"}
                placeholder="Eg: 5000"
                {...register("fee", {
                  required: "Enter amount",
                })}
                disabled={isLoading}
                defaultValue={defaultValue}
              />
              {errors.fee && (
                <Text as={"span"} className="text-red-500 text-sm">
                  {errors.fee?.message}
                </Text>
              )}
            </FormControl>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} isLoading={isLoading}>
                Submit
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConfigureShippingFee;
