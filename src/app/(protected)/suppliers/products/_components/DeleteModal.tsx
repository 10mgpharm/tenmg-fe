import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import icon from '@public/assets/images/image 20.svg';
import Image from 'next/image';

const DeleteModal = (
    {isOpen, onClose, deleteFn, isLoading}: 
    {isOpen: boolean, onClose: () => void, deleteFn: () => void, isLoading: boolean}
) => {
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
                        <Button 
                        isLoading={isLoading}
                        onClick={deleteFn}
                        loadingText="Deleting..."
                        bg={"red.600"}
                        color={"white"}
                        >
                            Yes, Delete Product
                        </Button>
                        <Button 
                        variant={"outline"}
                        className='mt-2' 
                        onClick={() => onClose()}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default DeleteModal