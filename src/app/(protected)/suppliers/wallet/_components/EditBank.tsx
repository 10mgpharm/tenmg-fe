import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React from 'react'

interface Props {
    isOpen: boolean;
    onClose: () => void;
    fetchingWallet: () => void;
    endpoint: string;
}
const EditBank = ({isOpen, onClose}: Props) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Add Bank Account</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <form>
          <div className="mb-4">
            <label htmlFor="bankName" className="block text-gray-700 text-sm font-bold mb-2">
              Bank Name
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={""}
            //   onChange={(e) => setBankName(e.target.value)}         
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
        </form>
      </ModalBody>
    </ModalContent>
  </Modal>
  )
}

export default EditBank