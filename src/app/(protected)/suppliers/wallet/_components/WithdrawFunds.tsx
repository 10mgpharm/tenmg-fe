import React, { useState } from 'react'
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
import { toast } from 'react-toastify';

const WithdrawFunds = ({ isOpen, onClose, otpOpen, bankDetails }: { isOpen: boolean, onClose: () => void; otpOpen: () => void; bankDetails: BankInfo }) => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [amount, setAmount] = useState<number>(0);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isNaN(Number(value))) {
            setAmount(Number(value));
        }
    };

    const handleWithdraw = async () => {
        // Handle the withdraw logic here
        console.log(`Withdrawing ${amount} from account ${bankDetails?.accountNumber}`);

        // const data = {
        //     amount: amount,
        // };
        try {
            const response = await requestClient({ token: token }).post(
                `/vendor/withdraw-funds`, { amount: amount }
            );
            console.log("response", response);
        } catch (error) {
            console.log(error)
            if (error.amount) {
                toast.error(error.amount[0] || "An error occurred");
            }

            if (error.message) {
                toast.error(error.message || "An error occurred");
            }
            // return;
        }

        onClose();
        otpOpen();
    };


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
                            <Input type='number' placeholder='1234567890' disabled value={bankDetails?.accountNumber} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Select Bank</FormLabel>
                            <Select disabled>
                                <option value={bankDetails?.accountName}>{bankDetails?.accountName}</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Amount</FormLabel>
                            <Input type='number' placeholder='#50,0000' onChange={handleAmountChange} value={amount} />
                        </FormControl>
                        <Button
                            w={"full"}
                            mt={4}
                            colorScheme='blue'
                            onClick={() => {
                                handleWithdraw();
                                // onClose();
                                // otpOpen()
                            }}
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