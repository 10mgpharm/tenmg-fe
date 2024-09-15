'use client';

import { useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { FaEyeSlash } from 'react-icons/fa6';
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
    Text 
} from '@chakra-ui/react'

const PasswordForm = () => {

    const [show, setShow] = useState<boolean>(false);
  return (
    <div className='max-w-2xl bg-white p-5 rounded-md'>
        <form className='space-y-5'>
            <FormControl>
                <FormLabel>Current Password</FormLabel>
                <InputGroup size={"lg"}>
                    <Input type={show ? "text": "password"} placeholder='***********'/>
                    <InputRightElement>
                    {
                        show ? 
                        <FaEye onClick={() => setShow(!show)} className='text-gray-500 w-5 h-5'/>
                        : <FaEyeSlash onClick={() => setShow(!show)} className='text-gray-500 w-5 h-5' />
                    }
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl>
                <FormLabel>New Password</FormLabel>
                <InputGroup size={"lg"}>
                    <Input type={show ? "text": "password"} placeholder='***********'/>
                    <InputRightElement>
                    {
                        show ? 
                        <FaEye onClick={() => setShow(!show)} className='text-gray-500 w-5 h-5'/>
                        : <FaEyeSlash onClick={() => setShow(!show)} className='text-gray-500 w-5 h-5' />
                    }
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size={"lg"}>
                    <Input type={show ? "text": "password"} placeholder='***********'/>
                    <InputRightElement>
                    {
                        show ? 
                        <FaEye onClick={() => setShow(!show)} className='text-gray-500 w-5 h-5'/>
                        : <FaEyeSlash onClick={() => setShow(!show)} className='text-gray-500 w-5 h-5' />
                    }
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='2fa' mb='0'>
                   <Text fontWeight={"medium"}>Multi-Factor Authenticator</Text>
                   <Text fontSize={"13px"} maxW={"60%"} color={"gray.400"}>Use multi-factor authentication (MFA) to add an extra layer of security to your account.</Text>
                </FormLabel>
                <Switch id='2fa' />
            </FormControl>
        </form>
        <HStack justify={"end"} my={6}>
            <Flex>
                <Button variant='outline' mr={3}>
                Cancel
                </Button>
                <Button colorScheme='blue'>Save Changes</Button>
            </Flex>
        </HStack>
    </div>
  )
}

export default PasswordForm