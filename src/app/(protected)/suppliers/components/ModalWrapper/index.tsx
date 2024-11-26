import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import React from "react";


const ModalWrapper = (
    {isOpen, onClose, children, title}: 
    {isOpen: boolean, onClose: () => void, children: React.ReactNode; title: string}
) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>
                <h3 className='text-xl font-semibold'>{title}</h3>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {children}
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default ModalWrapper