import React, { useCallback, useState } from 'react'
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
} from '@chakra-ui/react'
import { BankInfo } from '../page';
import requestClient from '@/lib/requestClient';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';

const WithdrawFunds = (
    {isOpen, onClose, otpOpen, bankDetails}: 
    {isOpen: boolean, onClose: () => void; otpOpen: () => void; bankDetails: BankInfo}
) => {

    const [loading, setLoading] = useState(false);
    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const requestOTP = useCallback(async () => {
        setLoading(true);
        try {
          const response = await requestClient({ token }).post(
            `/resend-otp`,
            { type: "SUPPLIER_ADD_BANK_ACCOUNT" }
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
    }, [token]);

    return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>Withdraw Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <form className='space-y-4 mb-6'>
                <FormControl>
                    <FormLabel>Account Number</FormLabel>
                    <Input 
                    type='number' 
                    placeholder='1234567890' 
                    disabled value={bankDetails?.accountNumber}
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
                            color: "gray.600",
                        }
                    }
                    >
                        <option 
                        color='gray.600'
                        value={bankDetails?.accountName}>
                            {bankDetails?.accountName}
                        </option>
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <Input type='number' placeholder='#50,0000'/>
                </FormControl> 
                <Button
                    w={"full"}
                    mt={4} 
                    colorScheme='blue' 
                    disabled={loading}
                    isLoading={loading}
                    loadingText='Requesting OTP'
                    type='submit'
                    onClick={requestOTP}
                >
                    Withdraw Fund
                </Button>
            </form>
        </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default WithdrawFunds