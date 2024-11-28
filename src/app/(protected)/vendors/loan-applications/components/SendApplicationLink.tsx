import ModalWrapper from "@/app/(protected)/suppliers/components/ModalWrapper";
import requestClient from "@/lib/requestClient";
import { CustomerRecords, NextAuthUserSession } from "@/types";
import { handleServerErrorMessage } from "@/utils";
import { convertArray } from "@/utils/convertSelectArray";
import { Button, Flex, FormControl, FormLabel } from "@chakra-ui/react";
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

const SendApplicationLink = (
    {isOpen, onClose, customers, fetchLoanApplication}: 
    {isOpen: boolean, onClose: () => void; customers: CustomerRecords[], fetchLoanApplication: () => void}
) => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        control,
        formState: { errors, isValid },
        handleSubmit
    } = useForm<IFormInput>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IFormInput> = async (record) => {
        console.log(record)
        const data = String(record.customerId.value);
        try {
          setIsLoading(true);
          const response = await requestClient({token: token}).post(
            "/vendor/loan-applications/apply",
            {"customerId": data}
          );
          console.log(response);
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
    
    return (
    <ModalWrapper 
    isOpen={isOpen} 
    onClose={onClose} 
    title="Send Application Link"
    >
        <form onSubmit={handleSubmit(onSubmit)} className="mb-5">
            <FormControl isInvalid={!!errors.customerId}>
                <FormLabel>Select Customer</FormLabel>
                <Controller
                    name="customerId"
                    control={control}
                    render={({ field }) => {
                        const handleChange = (selectedOption: any) => {
                            field.onChange(selectedOption ? selectedOption.value : null);
                        };
                    return(
                        <Select 
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        {...field}
                        name="customerId"
                        // onChange={handleChange}
                        options={convertArray(customers)} 
                    />
                    )}}
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
                    Apply for Loan
                </Button>
            </Flex>
        </form>
    </ModalWrapper>
  )
}

export default SendApplicationLink;