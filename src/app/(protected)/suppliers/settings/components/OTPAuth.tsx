import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
  } from '@chakra-ui/react'
import Image from 'next/image'
import qr from '@/assets/Images/QR Code.svg';

const OTPAuth = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Set up OTP Authenticator</ModalHeader>
            <ModalCloseButton />
            <ModalBody mb={6}>
                <Text fontSize={"14px"}>Use your own authenticator to secure all your online accounts.</Text>
                <div className="border flex items-center rounded-md mt-3">
                    <Image src={qr} alt='' className='p-1'/>
                    <div className="ml-2 text-center border-l px-3 flex-1 space-y-1">
                        <p className='font-medium text-center text-sm'>MANUAL ENTRY</p>
                        <p className='font-medium text-center'>CMNN NMO7 QYRC DUKM</p>
                        <p className='text-gray-500 text-sm text-center'>Spaces don&apos;t matter</p>
                    </div>
                </div>
                <p className='text-sm mt-3'>Scan this QR code with any authenticator app and click Next.</p>
                <Button colorScheme='blue' mt={4} w={"full"}>
                    Next
                </Button>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default OTPAuth