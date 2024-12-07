import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import icon from '@public/assets/images/image 20.svg';
import Image from 'next/image';

const DeleteModal = ({isOpen, onClose, title}: {isOpen: boolean, onClose: () => void, title: string}) => {
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
                    <h3 className='text-xl font-semibold'>Delete {title}</h3>
                    <p className='text-sm text-gray-500 mt-2'>{title} will removed permanently. Are you sure?</p>
                    <div className="flex flex-col gap-1 mt-8">
                        {/* TODO: Refactor this to perform the right function. */}
                        <button className='bg-red-600 text-white p-3 rounded-md' onClick={() => onClose()}>
                            Yes, Delete {title}
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