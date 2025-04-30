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
    Select,
    Text,
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
interface SelectOption {
  label: string;
  value: number;
}

const AddAccount = (
  {isOpen, onClose, banks, fetchingWallet }: 
  {isOpen: boolean, onClose: () => void; banks: SelectOption[], fetchingWallet: () => void }
) => {

  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;
  const [isLoading, setIsLoading ] = useState(false);
  const [accountVerificationError, setAccountVerificationError] = useState<
    string | null
  >(null);
  
  const {
    register,
    setValue,
    trigger,
    getValues,
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

  // const verifyingBankAccount = async () => {
  //   const accountNumber = getValues("accountNumber");
  //   const bankCode = getValues("bankCode");
  //   setAccountVerificationError(null);
  //   try {
  //     const { data, status, message } = await verifyBankAccount(token, {
  //       accountNumber: accountNumber,
  //       bankCode: bankCode,
  //     });
  //     if (status === "error") {
  //       setAccountVerificationError(message);
  //     } else {
  //       console.log(data)
  //       // if (data.success) {
  //       //   setValue("accountName", data?.data?.accountName);
  //       // } else {
  //       //   setAccountVerificationError(data?.message);
  //       // }
  //     }
  //   } catch (error) {
  //     setAccountVerificationError("Verification failed");
  //   }
  // }

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await requestClient({token: token}).post(
        "/supplier/wallet/add-bank-account",
        data
      )
      if(response.status === 200){
        fetchingWallet();
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
              <FormControl
                className="col-span-2"
                isInvalid={!!errors.bankName}
              >
                <Select
                  placeholder="Choose Bank"
                  {...register("bankCode", {
                    required: "Please select a bank",
                  })}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    const selectedText =
                      e.target.options[e.target.selectedIndex].text;
                    setValue("bankCode", selectedValue);
                    setValue("bankName", selectedText);
                    trigger(["bankCode", "bankName"]);
                  }}
                >
                  {banks?.map((bank, index) => (
                    <option key={index} value={bank.value}>
                      {bank.label}
                    </option>
                  ))}
                </Select>
                {errors.bankName && (
                  <Text fontSize="sm" color="red.500">
                    {errors.bankName.message}
                  </Text>
                )}
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
                  required: "Account Number is Required"
                })}
                />
                {errors.accountNumber && (
                  <Text fontSize="sm" color="red.500">
                    {errors.accountNumber.message}
                  </Text>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.accountName}>
                <FormLabel>Account Name</FormLabel>
                <Input 
                id="accountName"
                name="accountName"
                placeholder="Chidi Victor" 
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
                  required: "Account Name is Required",
                  validate: (value) => !/\d/.test(value) || "Account name should not contain numbers",
                })}
                />
                {errors.accountName && (
                  <Text fontSize="sm" color="red.500">
                    {errors.accountName.message}
                  </Text>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.bankCode}>
                <FormLabel>Bank Code</FormLabel>
                <Input 
                id="bankCode"
                name="bankCode"
                placeholder="e.g 139-0568" 
                type="number"
                disabled
                isInvalid={!!errors.bankCode}
                _disabled={{
                  color: "gray.700",
                  opacity: 1,
                }}
                _focus={{
                  border: !!errors.bankCode ? "red.300" : "border-gray-300",
                }}
                {...register("bankCode", {
                  required: "Bank Code is Required"
                })}
                />
                {errors.bankCode && (
                  <Text fontSize="sm" color="red.500">
                    {errors.bankCode.message}
                  </Text>
                )}
              </FormControl>
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