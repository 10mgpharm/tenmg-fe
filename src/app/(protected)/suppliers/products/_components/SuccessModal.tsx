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
import { useRouter } from 'next/navigation'

const SuccessModal = (
    {isOpen, onClose, routeUrl, isEditing, routeUrl2}: 
    {isOpen: boolean, onClose: () => void, routeUrl: string, isEditing: boolean, routeUrl2: string}) => {
    const router = useRouter();
    return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>
                <Image src={success} alt='' className='mx-auto'/>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text fontWeight={"semibold"} textAlign={"center"} fontSize={"x-large"}>
                    {`Product ${isEditing ? "Edited" : "Added"} Successfully`}
                </Text>
                <Text color={"gray.500"} textAlign={"center"} mt={2}>
                    {` You have successfully ${isEditing ? "edited" : "added"} a product to your store.`}
                </Text>
                <div className="my-6 flex flex-col gap-2">
                    <button 
                    onClick={() => router.push(routeUrl)} 
                    className='bg-primary-500 text-white p-3 rounded-md'>
                        Go Back to Products
                    </button>
                    <Link 
                    href={routeUrl2} 
                    className='border rounded p-3 text-center'>
                        Add Another
                    </Link>
                </div>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default SuccessModal