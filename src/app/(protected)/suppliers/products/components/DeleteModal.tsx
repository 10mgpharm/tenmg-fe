import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import icon from '@public/assets/images/image 20.svg';
import Image from 'next/image';

const DeleteModal = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>
                <Image src={icon} alt='' className='mx-auto' />
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <div className="text-center mb-8">
                    <h3 className='text-xl font-semibold'>Delete Product</h3>
                    <p className='text-sm text-gray-500 mt-2'>Deleting this product will remove it permanently from your store. Are you sure?</p>
                    <div className="flex flex-col gap-1 mt-8">
                        <button className='bg-red-600 text-white p-3 rounded-md'>
                            Yes, Delete Product
                        </button>
                        <button className='cursor-pointer mt-2 p-3 rounded-md border' onClick={() => onClose()}>Cancel</button>
                    </div>
                </div>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default DeleteModal