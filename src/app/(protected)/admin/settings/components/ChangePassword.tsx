import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Flex,
    FormControl,
    FormLabel,
    Input,
    HStack,
    Button,
    Select,
    InputGroup,
    InputRightAddon,
    InputLeftElement,
    InputRightElement
  } from '@chakra-ui/react'

import shape from '@public/assets/images/Rectangle 43.svg';
import { Eye } from 'lucide-react';
import Image from 'next/image';

const ChangePassword = (
    {isOpen, onClose}: 
    {isOpen: boolean, onClose: () => void}
) => {
  return (
    <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        size={"md"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader className='capitalize'>Change Password</DrawerHeader>
          <DrawerBody>
            <form>
                <FormControl>
                    <FormLabel>Old Password</FormLabel>
                    <InputGroup>
                        <Input type='password' placeholder='' />
                        <InputRightElement>
                            <Eye className='w-5 h-5 text-gray-600'/>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl mt={5}>
                    <FormLabel>New Password</FormLabel>
                    <InputGroup>
                        <Input type='password' placeholder='' />
                        <InputRightElement>
                            <Eye className='w-5 h-5 text-gray-600'/>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl mt={5}>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                        <Input type='password' placeholder='' />
                        <InputRightElement>
                            <Eye className='w-5 h-5 text-gray-600'/>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <HStack mt={5} justify={"end"}>
                    <Flex gap={3}>
                        <Button w={"120px"} onClick={onClose} variant={"outline"}>Cancel</Button>
                        <Button 
                        w={"160px"}
                        className='bg-primary-500 text-white'>
                          Change Password
                        </Button>
                    </Flex>
                </HStack>
            </form>
          </DrawerBody>
          <DrawerFooter p={0}>
            <Image src={shape} alt=''/>
          </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}

export default ChangePassword