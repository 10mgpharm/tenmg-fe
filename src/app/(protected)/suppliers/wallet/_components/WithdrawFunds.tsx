import React from 'react'
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
    Select,
  } from '@chakra-ui/react'

const WithdrawFunds = ({isOpen, onClose, otpOpen}: {isOpen: boolean, onClose: () => void; otpOpen: () => void;}) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>Withdraw Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <form className='space-y-4 mb-6'>
                <FormControl>
                    <FormLabel>Account Number</FormLabel>
                    <Input type='number' placeholder='1234567890'/>
                </FormControl>
                <FormControl>
                    <FormLabel>Select Bank</FormLabel>
                    <Select>
                        <option value="">GT Bank</option>
                        <option value="">Access Bank</option>
                        <option value="">Union Bank</option>
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <Input type='number' placeholder='#50,0000'/>
                </FormControl> 
                <Button
                    w={"full"}
                    mt={4} 
                    colorScheme='blue' 
                    onClick={() => {
                        onClose();
                        otpOpen()
                    }}
                >
                    Withdraw Fund
                </Button>
            </form>
        </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default WithdrawFunds