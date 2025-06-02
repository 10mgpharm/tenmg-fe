"Use client";
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
    Button,
    Flex,
} from '@chakra-ui/react'
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import { handleServerErrorMessage } from '@/utils';
import requestClient from '@/lib/requestClient';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';

const OTPModal = (
    {isOpen, onClose, handleWithdraw, setOtp, otp, loading}: 
    {isOpen: boolean, onClose: () => void; handleWithdraw: () => void; setOtp: Dispatch<SetStateAction<string>>; otp: string; loading: boolean;}
) => {
    const [countdown, setCountdown] = useState(60); // 1 minute in seconds
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        setIsResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isOpen, countdown]);

    useEffect(() => {
        if (isOpen) {
            setCountdown(60);
            setIsResendDisabled(true);
        }
    }, [isOpen]);

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const handleResendOTP = async () => {
        try {
            const response = await requestClient({ token }).post(
                `/resend-otp`,
                { type: "WITHDRAW_FUND_TO_BANK_ACCOUNT" }
            );
            if (response.status === 200) {
                toast.success('OTP has been resent to your email.');
                setCountdown(60);
                setIsResendDisabled(true);
            }
        } catch (error) {
            toast.error(handleServerErrorMessage(error));
        }
    }

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} size={"md"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>OTP Verification</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontSize={"small"} mb={5}>
                        A one-time password (OTP)  has been sent to your email address. Enter OTP code to continue. 
                    </Text>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        inputType='text'
                        containerStyle={{display:"flex", gap: "12px", justifyContent: "center"}}
                        inputStyle={{width: "55px", height: "55px", padding: "5px", border: "1px solid #EAECF0", borderRadius: "5px", fontSize: "24px", fontWeight: "bold"}}
                        renderInput={(props) => <input {...props} />}
                    />
                    <Button 
                        w={"full"} 
                        mt={6} 
                        colorScheme='blue' 
                        py={3} 
                        onClick={handleWithdraw} 
                        isLoading={loading} 
                        loadingText='Verifying OTP'
                    >   
                        Continue
                    </Button>
                    <Flex justifyContent={"center"} alignItems={"center"}>
                        <Text fontSize={"small"} color={"gray.500"}>Didn&apos;t get a code?</Text>
                        <Button 
                            variant='ghost' 
                            textAlign={"center"}
                            fontSize={"small"}
                            _disabled={{ opacity: 0.5 }}
                            _hover={{ bg: "transparent" }}
                            maxW={"fit-content"}
                            px={2}
                            py={1}
                            onClick={handleResendOTP}
                            isDisabled={isResendDisabled}
                        >
                            {countdown > 0 ? (
                                <span className='text-primary-500 ml-1'>Resend ({formatTime(countdown)})</span>
                            ) : (
                                <span className='text-primary-500 ml-1'>Resend</span>
                            )}
                        </Button>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default OTPModal