import React, { Dispatch, SetStateAction, useCallback, useState } from 'react'
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

import requestClient from '@/lib/requestClient';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';
import { BankInfo } from '@/app/(protected)/suppliers/wallet/page';

const WithdrawFunds = (
    { isOpen, onClose, otpOpen, bankDetails, amount, setAmount }:
        { isOpen: boolean, onClose: () => void; otpOpen: () => void; bankDetails: BankInfo, amount: number, setAmount: Dispatch<SetStateAction<number>>; }
) => {

    console.log("bankDetails", bankDetails);

    const [loading, setLoading] = useState(false);
    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const initiateWithdrawal = useCallback(async () => {
        setLoading(true);

        const data = {
            "amount": amount,
            "bankAccountId": bankDetails?.id,
        }

        try {
            const response = await requestClient({ token }).post(
                `/vendor/withdrawals/init`, data
            );
            if (response.status === 200) {
                console.log(response)
                onClose();
                otpOpen();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [token, amount, bankDetails?.id]);

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
                            <Input
                                type='number'
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                placeholder='#50,0000'
                            />
                        </FormControl>
                        <Button
                            w={"full"}
                            mt={4}
                            colorScheme='blue'
                            disabled={loading}
                            isLoading={loading}
                            loadingText='Requesting OTP'
                            type='submit'
                            onClick={initiateWithdrawal}
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