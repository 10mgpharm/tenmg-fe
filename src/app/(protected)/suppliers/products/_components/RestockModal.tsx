import { FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select } from '@chakra-ui/react'

const RestockModal = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>
            <h3 className='text-xl font-semibold'>Restock Product</h3>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <form className="text-center mb-8 space-y-4">
                    <FormControl>
                        <FormLabel>Product Name</FormLabel>
                        <Input placeholder='Synthetic opioids'/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Current Stock</FormLabel>
                        <Input type='number' placeholder='0'/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Desired Quantity</FormLabel>
                        <Select>
                            <option value="">10</option>
                            <option value="">50</option>
                            <option value="">100</option>
                            <option value="">200</option>
                            <option value="">300</option>
                            <option value="">400</option>
                            <option value="">500</option>
                            <option value="">1000</option>
                            <option value="">2000</option>
                            <option value="">3000</option>
                        </Select>
                    </FormControl>
                    <div className="flex flex-col gap-3 pt-5">
                        <button className='bg-primary-500 text-white p-3 rounded-md'>
                            Restock
                        </button>
                        <button className='cursor-pointer mt-2' onClick={() => onClose()}>Cancel</button>
                    </div>
                </form>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default RestockModal