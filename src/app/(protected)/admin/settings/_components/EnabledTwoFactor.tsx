"use client";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    SimpleGrid,
    Stack,
    Flex,
} from '@chakra-ui/react'
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

const EnabledTwoFactor = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void;}) => {

    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Enable Two-Factor Enabled</ModalHeader>
            <ModalCloseButton />
            <ModalBody mb={5}>
                <Text>Now you can use your authenticator app to get authentication codes when you want to sign in.</Text>
                <Text mt={4}>Download and store these backup codes somewhere safe. If you lose your authentication device you can use any of these codes to securely login to your account</Text>
                <Stack gap={6} className='border p-4 bg-gray-50 rounded max-w-md mx-auto' mt={8}>
                    <SimpleGrid columns={3} justifyItems={"center"} rowGap={5}>
                        <Text color={"gray.600"}>10mgchudiv</Text>
                        <Text color={"gray.600"}>10mgchudiv</Text>
                        <Text color={"gray.600"}>10mgchudiv</Text>
                        <Text color={"gray.600"}>10mgchudiv</Text>
                        <Text color={"gray.600"}>10mgchudiv</Text>
                        <Text color={"gray.600"}>10mgchudiv</Text>
                        <Text color={"gray.600"}>10mgchudiv</Text>
                        <Text color={"gray.600"}>10mgchudiv</Text>
                        <Text color={"gray.600"}>10mgchudiv</Text>
                    </SimpleGrid>
                    <Flex gap={3}>
                        <CopyToClipboard onCopy={handleCopy} text="10mgchudiv, 10mgchudiv, 10mgchudiv, 10mgchudiv, 10mgchudiv, 10mgchudiv, 10mgchudiv">
                            <Button bg={"white"} _hover={{bg: "white", color: "gray.700"}} color={"gray.800"} border={"1px solid #EAECF0"} width={"98px"}>{copied ? "Copied!" : "Copy"}</Button>
                        </CopyToClipboard>
                        <Button bg={"white"} _hover={{bg: "white", color: "gray.700"}} color={"gray.800"} border={"1px solid #EAECF0"} flex={1}>Download as .txt file</Button>
                    </Flex>
                </Stack>
                <Text mt={8} fontSize={"15px"} color={"gray.500"}>Once you use a backup code to sign in, that code becomes inactive.</Text>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default EnabledTwoFactor