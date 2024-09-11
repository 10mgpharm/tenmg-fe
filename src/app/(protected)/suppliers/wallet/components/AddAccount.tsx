import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
  } from '@chakra-ui/react'

const AddAccount = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void;}) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Bank Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form className='space-y-4 mb-6'>
                <FormControl>
                    <FormLabel>Bank Name</FormLabel>
                    <Input type='text' placeholder='GT Bank'/>
                </FormControl>
                <FormControl>
                    <FormLabel>Account Number</FormLabel>
                    <Input type='number' placeholder='123456789'/>
                </FormControl>
                <FormControl>
                    <FormLabel>Account Name</FormLabel>
                    <Input type='text' placeholder='Chidi Victor'/>
                </FormControl>
                <FormControl>
                    <FormLabel>Routing Number/Sort Code</FormLabel>
                    <Input type='text' placeholder='12345678'/>
                </FormControl>
                <Button w={"full"} mt={4} colorScheme='blue' onClick={onClose}>
                    Add Account
                </Button>
            </form>
          </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default AddAccount