import requestClient from '@/lib/requestClient';
import { NextAuthUserSession } from '@/types';
import { handleServerErrorMessage } from '@/utils';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
  } from '@chakra-ui/react'
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface IFormInput {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode: string;
}

const AddAccount = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void;}) => {

  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;
  const [isLoading, setIsLoading ] = useState(false);
  
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      bankCode: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
    }
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await requestClient({token: token}).post(
        "/supplier/wallet/add-bank-account",
        data
      )
      if(response.status === 200){
        setIsLoading(false);
        onClose();
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error(handleServerErrorMessage(error));
    }
  }

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Bank Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form className='space-y-4 mb-6' onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={!!errors.bankName}>
                <FormLabel>Bank Name</FormLabel>
                <Input 
                id="bankName"
                name="bankName"
                placeholder="e.g GT Bank" 
                type="text"
                isInvalid={!!errors.bankName}
                _focus={{
                  border: !!errors.bankName ? "red.300" : "border-gray-300",
                }}
                {...register("bankName", {
                  required: true,
                })}
                />
              </FormControl>
              <FormControl isInvalid={!!errors.accountNumber}>
                <FormLabel>Account Number</FormLabel>
                <Input 
                id="accountNumber"
                name="accountNumber"
                placeholder="e.g 123456789" 
                type="number"
                isInvalid={!!errors.accountNumber}
                _focus={{
                  border: !!errors.accountNumber ? "red.300" : "border-gray-300",
                }}
                {...register("accountNumber", {
                  required: true,
                })}
                />
              </FormControl>
              <FormControl isInvalid={!!errors.accountName}>
                <FormLabel>Account Name</FormLabel>
                <Input 
                id="accountName"
                name="accountName"
                placeholder="Chidi Victor 1" 
                type="text"
                isInvalid={!!errors.accountName}
                _focus={{
                  border: !!errors.accountName ? "red.300" : "border-gray-300",
                }}
                onKeyDown={(e) => {
                  if (/\d/.test(e.key)) {
                    e.preventDefault(); // block numbers
                  }
                }}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData('text');
                  if (/\d/.test(paste)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/[0-9]/g, ""); // remove numbers
                  setValue("accountName", value);
                }}
                {...register("accountName", {
                  required: true,
                  validate: (value) => !/\d/.test(value) || "Account name should not contain numbers",
                })}
                />
              </FormControl>
              <FormControl isInvalid={!!errors.bankCode}>
                <FormLabel>Bank Code</FormLabel>
                <Input 
                id="bankCode"
                name="bankCode"
                placeholder="e.g 139-0568" 
                type="number"
                isInvalid={!!errors.bankCode}
                _focus={{
                  border: !!errors.bankCode ? "red.300" : "border-gray-300",
                }}
                {...register("bankCode", {
                  required: true,
                })}
                />
              </FormControl>
              {/* <FormControl isInvalid={!!errors.otp}>
                <FormLabel>Routing Number/Sort Code</FormLabel>
                <Input 
                id="otp"
                name="otp"
                placeholder="e.g 12345" 
                type="text"
                isInvalid={!!errors.otp}
                _focus={{
                  border: !!errors.otp ? "red.300" : "border-gray-300",
                }}
                {...register("otp", {
                  required: true,
                })}
                />
              </FormControl> */}
              <Button type='submit' w={"full"} mt={4} colorScheme='blue'>
                Add Account
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default AddAccount