import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'

const DeactiveModal = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>
                <h3 className='text-xl font-semibold'>Deactivate Product</h3>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <div className="mb-8">
                    <p className='leading-6 text-gray-500 mt-2'>
                    You are about to deactivate Global Pentazocine, once deactivated, this product will not appear in your public shop.
                    There is no fee for reactivating a product.
                    </p>
                    <div className="flex flex-col gap-3 mt-8">
                        <button className='bg-primary-600 text-white p-3 rounded-md'>
                            Deactivate
                        </button>
                        <button className='cursor-pointer mt-2' onClick={() => onClose()}>Cancel</button>
                    </div>
                </div>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default DeactiveModal