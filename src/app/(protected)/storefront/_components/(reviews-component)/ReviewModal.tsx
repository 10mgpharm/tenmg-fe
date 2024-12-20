'use client'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import ReviewForm from './ReviewForm'

export default function WriteReviewModal() {

  const { isOpen, onOpen, onClose } = useDisclosure()
  // const finalRef = React.useRef(null)

  return (
    <div>
      <Button onClick={onOpen} variant={"outline"} colorScheme={"blue"} size="sm">Write A Review</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Write A Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ReviewForm onClose={onClose} />
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme='blue' onClick={onClose} size='sm' variant="ghost">
              Close
            </Button>

          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </div>
  )
}
