import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
} from '@chakra-ui/react'

import success from '@/assets/images/success.svg'
import Image from 'next/image'

const SuccessModal = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>
                <Image src={success} alt='' className='mx-auto'/>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text fontWeight={"semibold"} textAlign={"center"} fontSize={"x-large"}>Product Added Successfully</Text>
                <Text color={"gray.500"} textAlign={"center"} mt={2}>You&apos;ve successfully added Global Pentazocine to your store.</Text>
                <div className="my-6 flex flex-col gap-2">
                    <button className='bg-primary-500 text-white p-3 rounded-md'>Go Home</button>
                    <button className='border rounded p-3'>Add Another</button>
                </div>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default SuccessModal