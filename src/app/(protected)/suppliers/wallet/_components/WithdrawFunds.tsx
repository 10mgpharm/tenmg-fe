import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
    InputGroup,
    InputLeftAddon,
    Text,
} from '@chakra-ui/react'
import { BankInfo } from '../page';
import requestClient from '@/lib/requestClient';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

interface IFormInput {
  accountNumber: string;
  amount: number;
}
interface WithdrawFundsDto {
    isOpen: boolean;
    onClose: () => void; 
    otpOpen: () => void; 
    bankDetails: BankInfo; 
    amount: number; 
    setAmount: Dispatch<SetStateAction<number>>;
}
const WithdrawFunds = (
    {isOpen, onClose, otpOpen, bankDetails, amount, setAmount}: WithdrawFundsDto
) => {

    const [loading, setLoading] = useState(false);
    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const {
        register,
        setValue,
        trigger,
        formState: { errors },
        handleSubmit,
      } = useForm<IFormInput>({
        mode: "onChange",
        defaultValues: {
          accountNumber: bankDetails?.accountNumber ?? "",
        }
    });

    useEffect(() => {
        setValue("accountNumber", bankDetails?.accountNumber || "");
    }, [bankDetails]);

    const onSubmit = async () => {
        if(amount > 0) {
            setLoading(true);
            try {
            const response = await requestClient({ token }).post(
                `/resend-otp`,
                { type: "WITHDRAW_FUND_TO_BANK_ACCOUNT" }
            );
            if (response.status === 200) {
                onClose();
                otpOpen();
            }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            return toast.error("Please enter a valid amount to withdraw");
        }
    };

    return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>Withdraw Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <form className='space-y-4 mb-6' onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                    <FormLabel>Account Number</FormLabel>
                    <Input 
                    type='number' 
                    placeholder='1234567890' 
                    disabled value={bankDetails?.accountNumber}
                    isInvalid={!!errors.accountNumber}
                    _focus={{
                        border: !!errors.accountNumber ? "red.300" : "border-gray-300",
                    }}
                    {...register("accountNumber", {
                        required: "Account Number is Required"
                    })}
                    _disabled={{
                        color: "gray.600",
                    }}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Select Bank</FormLabel>
                    <Select 
                    disabled 
                    _disabled={
                        {
                            color: "gray.800",
                        }
                    }
                    >
                        <option 
                        color='gray.800'
                        value={bankDetails?.accountName}>
                            {bankDetails?.accountName}
                        </option>
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <InputGroup>
                        <InputLeftAddon>₦</InputLeftAddon>
                        <Input 
                        type='number'
                        outline={"none"}
                        isInvalid={!!errors.amount}
                        _focus={{
                            border: !!errors.amount ? "red.300" : "border-gray-300",
                        }}
                        {...register("amount", {
                            required: "Amount is Required",
                            min: {
                                value: 1,
                                message: "Amount must be greater than 0"
                            }
                        })}
                        value={amount} 
                        onChange={(e) => {
                            setValue("amount", Number(e.target.value));
                            trigger("amount");
                            setAmount(Number(e.target.value))
                        }}
                        placeholder='50000'
                     />
                    </InputGroup>
                    {errors.amount && (
                    <Text fontSize="sm" color="red.500">
                        {errors.amount.message}
                    </Text>
                    )}
                </FormControl> 
                <Button
                    w={"full"}
                    mt={4} 
                    colorScheme='blue' 
                    disabled={loading}
                    isLoading={loading}
                    loadingText='Requesting OTP'
                    type='submit'
                >
                    Withdraw Funds
                </Button>
            </form>
        </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default WithdrawFunds