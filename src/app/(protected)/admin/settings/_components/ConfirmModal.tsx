import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
} from '@chakra-ui/react'

import success from '@public/assets/images/cancel-Icon.svg';
import Image from 'next/image'

const ConfirmModal = ({isOpen, onClose, handleRequest}: {isOpen: boolean, onClose: () => void,  handleRequest: () => void;}) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>
                <Image src={success} alt='' className='mx-auto'/>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text fontWeight={"semibold"} textAlign={"center"} fontSize={"x-large"}>Revoke Invite</Text>
                <Text color={"gray.500"} textAlign={"center"} mt={2}>Are your sure you want to revoke this invite.</Text>
                <div className="my-6 flex flex-col gap-2">
                    <button className='bg-red-500 text-white p-3 rounded-md' onClick={handleRequest}>Yes, Revoke</button>
                    <button onClick={onClose} className='border rounded p-3'>Cancel</button>
                </div>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default ConfirmModal