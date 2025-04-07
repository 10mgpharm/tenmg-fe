import ModalWrapper from "@/app/(protected)/suppliers/_components/ModalWrapper";
import requestClient from "@/lib/requestClient";
import { CustomerRecords, NextAuthUserSession } from "@/types";
import { handleServerErrorMessage } from "@/utils";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";

export interface SelectProps {
  label: string;
  value: number;
}

interface IFormInput {
  customerId: number;
  requestedAmount: number;
}

const customStyles = {
  menuList: (provided: any) => ({
    ...provided,
    maxHeight: 200, 
    overflowY: "auto",
  }),
};

const SendApplicationLink = ({
  isOpen,
  onClose,
  customers,
  fetchLoanApplication,
}: {
  isOpen: boolean;
  onClose: () => void;
  customers: CustomerRecords[];
  fetchLoanApplication?: () => void;
}) => {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
    reset,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      customerId: undefined,
      requestedAmount: undefined,
    },
  });

  const customerOptions = customers?.map((customer) => ({
    value: customer.id,
    label: `${customer.name} - ${customer.email}`,
  }));

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setIsLoading(true);
      const response = await requestClient({ token: token }).post(
        "/vendor/loan-applications/send-application-link",
        data
      );

      if (response.status === 200) {
        toast.success(response?.data?.message);
        if (fetchLoanApplication) fetchLoanApplication();
        reset();
        onClose();
      }
    } catch (error) {
      toast.error(handleServerErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size={"lg"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Apply for Loan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)} className="mb-5 h-fit">
            <FormControl isInvalid={!!errors.customerId}>
              <FormLabel>Select Customer</FormLabel>
              <Controller
                name="customerId"
                control={control}
                rules={{ required: "Please select a customer." }}
                render={({ field }) => (
                  <>
                    <Select
                      isClearable={true}
                      isSearchable={true}
                      options={customerOptions}
                      placeholder={"Search Customer"}
                      styles={customStyles}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value);
                      }}
                      value={customerOptions?.find(
                        (option) => option.value === field.value
                      )}
                    />
                    {errors.customerId && (
                      <FormErrorMessage>
                        {errors.customerId.message?.toString()}
                      </FormErrorMessage>
                    )}
                  </>
                )}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.requestedAmount} className="mt-7">
              <FormLabel>Enter Loan Amount</FormLabel>
              <Controller
                name="requestedAmount"
                control={control}
                rules={{ required: "Please enter loan amount." }}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      type="number"
                      placeholder={"Enter loan amount"}
                    />
                    {errors.requestedAmount && (
                      <FormErrorMessage>
                        {errors.requestedAmount.message?.toString()}
                      </FormErrorMessage>
                    )}
                  </>
                )}
              />
            </FormControl>
            <Flex justify={"end"} mt={5} gap={3}>
              <Button w={"150px"} onClick={onClose} variant={"outline"}>
                Cancel
              </Button>
              <Button
                w={"150px"}
                type="submit"
                isLoading={isLoading}
                loadingText={"Sending..."}
                className="bg-primary-500 text-white"
              >
                Send Link
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SendApplicationLink;
