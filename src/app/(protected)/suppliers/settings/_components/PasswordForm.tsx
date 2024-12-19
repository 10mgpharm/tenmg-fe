"use client";

import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
    Switch,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import OTPAuth from './OTPAuth';

const PasswordForm = () => {
    // Separate states for each password field
    const [showCurrent, setShowCurrent] = useState<boolean>(false);
    const [showNew, setShowNew] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <div className='max-w-2xl bg-white p-5 rounded-md'>
            <form className='space-y-5'>
                <FormControl>
                    <FormLabel>Current Password</FormLabel>
                    <InputGroup size={"lg"}>
                        <Input
                            type={showCurrent ? "text" : "password"}
                            placeholder='***********'
                        />
                        <InputRightElement>
                            {showCurrent ? (
                                <FaEye
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className='text-gray-500 w-5 h-5 cursor-pointer'
                                />
                            ) : (
                                <FaEyeSlash
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className='text-gray-500 w-5 h-5 cursor-pointer'
                                />
                            )}
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>New Password</FormLabel>
                    <InputGroup size={"lg"}>
                        <Input
                            type={showNew ? "text" : "password"}
                            placeholder='***********'
                        />
                        <InputRightElement>
                            {showNew ? (
                                <FaEye
                                    onClick={() => setShowNew(!showNew)}
                                    className='text-gray-500 w-5 h-5 cursor-pointer'
                                />
                            ) : (
                                <FaEyeSlash
                                    onClick={() => setShowNew(!showNew)}
                                    className='text-gray-500 w-5 h-5 cursor-pointer'
                                />
                            )}
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup size={"lg"}>
                        <Input
                            type={showConfirm ? "text" : "password"}
                            placeholder='***********'
                        />
                        <InputRightElement>
                            {showConfirm ? (
                                <FaEye
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className='text-gray-500 w-5 h-5 cursor-pointer'
                                />
                            ) : (
                                <FaEyeSlash
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className='text-gray-500 w-5 h-5 cursor-pointer'
                                />
                            )}
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl display='flex' alignItems='center'>
                    <FormLabel htmlFor='2fa' mb='0'>
                        <Text fontWeight={"medium"}>Multi-Factor Authenticator</Text>
                        <Text fontSize={"13px"} maxW={"60%"} color={"gray.400"}>
                            Use multi-factor authentication (MFA) to add an extra layer of security to your account.
                        </Text>
                    </FormLabel>
                    <Switch id='2fa' />
                </FormControl>
            </form>
            <HStack justify={"end"} my={6}>
                <Flex>
                    <Button variant='outline' mr={3}>
                        Cancel
                    </Button>
                    <Button onClick={onOpen} colorScheme='blue'>Save Changes</Button>
                </Flex>
            </HStack>
            <OTPAuth isOpen={isOpen} onClose={onClose} />
        </div>
    );
};

export default PasswordForm;
