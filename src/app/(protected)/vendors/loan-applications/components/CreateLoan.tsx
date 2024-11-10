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
    Select 
} from "@chakra-ui/react";
import Image from "next/image";
import shape from '@public/assets/images/Rectangle 43.svg';
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";


interface IFormInput {
    customerId: string;
    requestedAmount: string;
    durationInMonths: string;
}

const CreateLoan = (
    {isOpen, onClose, fetchLoanApplication}: 
    {isOpen: boolean, onClose: () => void, fetchLoanApplication: () => void}
) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const {
    register,
    formState: { errors, isValid },
    handleSubmit
    } = useForm<IFormInput>({
    mode: "onChange",
    });

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
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
                    <FormLabel color={'#344054'}>Customer by Name or ID</FormLabel>
                    <Input 
                    id='customerId'
                    errorBorderColor="red.300"
                    isInvalid={!!errors.customerId} 
                    placeholder="Eg. Jude Bellingham or MG-10932023" 
                    type="text"
                    _focus={{
                        border: !!errors.customerId ? "red.300" : "border-gray-300",
                      }}
                      {...register("customerId", {
                        required: true,
                      })}
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
                    <Select 
                    isInvalid={!!errors.durationInMonths}
                    _focus={{
                        border: !!errors.durationInMonths ? "red.300" : "border-gray-300",
                      }}
                      {...register("durationInMonths", {
                        required: true,
                      })}
                    placeholder="Choose Repayment Period"
                    >
                        <option value="1">1 month</option>
                        <option value="3">3 months</option>
                        <option value="6">6 months</option>
                    </Select>
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