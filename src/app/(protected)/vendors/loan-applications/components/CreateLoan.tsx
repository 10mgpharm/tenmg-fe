import { 
    Button, 
    DrawerFooter,
    Flex, 
    FormControl, 
    FormLabel, 
    HStack, 
    Input, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalHeader, 
    ModalOverlay,
} from "@chakra-ui/react";
import Image from "next/image";
import shape from '@public/assets/images/Rectangle 43.svg';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Select from 'react-select'
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { CustomerRecords, NextAuthUserSession } from "@/types";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { convertArray } from "@/utils/convertSelectArray";
import { SelectProps } from "./SendApplicationLink";


interface IFormInput {
  customerId: SelectProps;
  requestedAmount: string;
  durationInMonths: SelectProps;
}

const CreateLoan = (
    {isOpen, onClose, fetchLoanApplication, customers}: 
    {isOpen: boolean, onClose: () => void, fetchLoanApplication: () => void, customers: CustomerRecords[]}
) => {

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    control,
    formState: { errors, isValid },
    handleSubmit
    } = useForm<IFormInput>({
    mode: "onChange",
    });

    const onSubmit: SubmitHandler<IFormInput> = async (records) => {
      const data = {
        "customerId":records.customerId.value,
        "requestedAmount": records.requestedAmount,
        "durationInMonths": records.durationInMonths.value
      }
        try {
          setIsLoading(true);
          const response = await requestClient({token: token}).post(
            "/vendor/loan-applications",
            data
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
    <Modal isCentered isOpen={isOpen} onClose={onClose} size={"lg"}>
    <ModalOverlay />
    <ModalContent>
        <ModalHeader>Apply for Loan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormControl isInvalid={!!errors.customerId}>
                    <FormLabel color={'#344054'}>Select Customer</FormLabel>
                    <Controller
                      name="customerId"
                      control={control}
                      render={({ field }) => {
                      return(
                        <Select 
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        {...field}
                        name="customerId"
                        options={convertArray(customers)} 
                      />
                      )}}
                    />
                </FormControl>
                <FormControl isInvalid={!!errors.requestedAmount}>
                    <FormLabel color={'#344054'}>Loan Amount</FormLabel>
                    <Input 
                    placeholder="N 3,000.000.00" 
                    type="number"
                    id='requestedAmount'
                    errorBorderColor="red.300"
                    isInvalid={!!errors.requestedAmount}
                    _focus={{
                        border: !!errors.requestedAmount ? "red.300" : "border-gray-300",
                      }}
                      {...register("requestedAmount", {
                        required: true,
                      })}
                    />
                </FormControl>
                <FormControl isInvalid={!!errors.durationInMonths}>
                    <FormLabel color={'#344054'}>Loan Repayment</FormLabel>
                    <Controller
                      name="durationInMonths"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={[
                            { value: 1, label: "1 months" },
                            { value: 3, label: "3 months" },
                            { value: 6, label: "6 months" },
                          ]}
                          placeholder="Choose Repayment Period"
                        />
                      )}
                    />
                </FormControl>
                <HStack pt={6} justify={"end"}>
                  <Flex gap={3}>
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
                </HStack>
            </form>
        </ModalBody>
        <DrawerFooter p={0}>
            <Image src={shape} alt=''/>
        </DrawerFooter>
    </ModalContent>
    </Modal>
  )
}

export default CreateLoan;