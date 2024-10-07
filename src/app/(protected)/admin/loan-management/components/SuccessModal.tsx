import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
} from '@chakra-ui/react'

import success from '@public/assets/images/success.svg'
import Image from 'next/image'
import Link from 'next/link'

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
                <Text fontWeight={"600"} textAlign={"center"} fontSize={"large"}>Loan Application Created</Text>
                <Text color={"gray.500"} textAlign={"center"} fontSize={"14px"} mt={2}>Congratulations! Your Credit Application was created. Please keep an eye on your email, where you&apos;ll soon receive more information, including important details about the next steps.</Text>
                <div className="my-6 flex flex-col gap-2">
                    <Link href={'/admin/loan-management/new'} className='bg-primary-500 text-center text-white p-3 rounded-md'>View Loan Information</Link>
                    <button onClick={onClose} className='border rounded p-3'>Return to Dashboard</button>
                </div>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default SuccessModal