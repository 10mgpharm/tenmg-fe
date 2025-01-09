import ModalWrapper from "@/app/(protected)/suppliers/_components/ModalWrapper";
import requestClient from "@/lib/requestClient";
import { CustomerRecords, NextAuthUserSession } from "@/types";
import { handleServerErrorMessage } from "@/utils";
import { Button, Flex, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from 'react-select';
import { toast } from "react-toastify";

export interface SelectProps {
    label: string;
    value: number; 
}

interface IFormInput {
    customerId: SelectProps
}

const customStyles = {
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: 200, // Limit dropdown height
      overflowY: 'auto', // Enable vertical scrolling
    }),
};

const SendApplicationLink = (
    {isOpen, onClose, customers, fetchLoanApplication}: 
    {isOpen: boolean, onClose: () => void; customers: CustomerRecords[], fetchLoanApplication?: () => void}
) => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        control,
        formState: { errors, isValid },
        handleSubmit,
        setValue,
    } = useForm({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
          setIsLoading(true);
          const response = await requestClient({token: token}).post(
            "/vendor/loan-applications/send-application-link",
            data
          );
            
          if (response.status === 200) {
            toast.success(response?.data?.message);
            fetchLoanApplication()
            onClose();
          }
        } catch (error) {
          setIsLoading(false);
          toast.error(handleServerErrorMessage(error));
        }
    };

    const customerOptions = customers?.map((customer) => ({
        value: customer.id,
        label: `${customer.name} - ${customer.email}`,
    }));
    
    return (
    <ModalWrapper 
    isOpen={isOpen} 
    onClose={onClose} 
    title="Send Application Link"
    >
        <form onSubmit={handleSubmit(onSubmit)} className="mb-20">
            <FormControl isInvalid={!!errors.customerId}>
                <FormLabel>Select Customer</FormLabel>
                <Controller
                name="customerId"
                control={control}
                rules={{ required: "Please select a customer." }}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      isClearable={true}
                      isSearchable={true}
                      options={customerOptions}
                      placeholder={"Search Customer"}
                      styles={customStyles}
                      name="customerId"
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value);
                        setValue("customerId", selectedOption?.value);
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
            <Flex justify={"end"} mt={5} gap={3}>
                <Button 
                w={"150px"} 
                onClick={onClose} 
                variant={"outline"}>
                    Cancel
                </Button>
                <Button 
                w={"150px"}
                type="submit"
                isLoading={isLoading}
                loadingText={'Submitting..'}
                className='bg-primary-500 text-white'>
                    Send Link
                </Button>
            </Flex>
        </form>
    </ModalWrapper>
  )
}

export default SendApplicationLink;