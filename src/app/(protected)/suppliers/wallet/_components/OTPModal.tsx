"Use client";
import { Dispatch, SetStateAction, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
    Button,
} from '@chakra-ui/react'
import OtpInput from 'react-otp-input';

const OTPModal = (
    {isOpen, onClose, handleWithdraw, setOtp, otp, loading}: 
    {isOpen: boolean, onClose: () => void; handleWithdraw: () => void; setOtp: Dispatch<SetStateAction<string>>; otp: string; loading: boolean;}
) => {

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
                // renderSeparator={<span>-</span>}
                inputStyle={{width: "55px", height: "55px", padding: "5px", border: "1px solid #EAECF0", borderRadius: "5px", fontSize: "24px", fontWeight: "bold"}}
                renderInput={(props) => <input {...props} />}
            />
            <Button w={"full"} mt={6} colorScheme='blue' py={3} onClick={handleWithdraw} isLoading={loading} loadingText='Verifying OTP'>   
                Continue
            </Button>
            <Text textAlign={"center"} mt={4} mb={8}>Didn’t get a code? <span className='text-primary-500'>Resend</span> (0:13s)</Text>
        </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default OTPModal