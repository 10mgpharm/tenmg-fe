"use client";
import requestClient from '@/lib/requestClient';
import { NextAuthUserSession } from '@/types';
import { handleServerErrorMessage } from '@/utils';
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
    InputGroup,
    InputRightElement,
    Text
  } from '@chakra-ui/react'
import { EyeSlashIcon } from '@heroicons/react/20/solid';

import shape from '@public/assets/images/Rectangle 43.svg';
import { Eye } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface IFormInput {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

const ChangePassword = (
  {isOpen, onClose}: 
  {isOpen: boolean, onClose: () => void}
) => {

  const session = useSession();
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const data = session.data as NextAuthUserSession;

  const onSubmit: SubmitHandler<IFormInput> = async (value) => {
    try {
     setIsLoading(true);
     const response = await requestClient({token: data.user.token}).patch(
      "account/settings/password",
      {
        ...value
      }
     )
     if (response.status === 200) {
        toast.success(response.data.message);
        setIsLoading(false);
      } else {
        toast.error(`Password change failed: ${response.data.message}`);
      }
    } catch (error) {
     setIsLoading(false);
     const errorMessage = handleServerErrorMessage(error);
     toast.error(`Password change failed: ${errorMessage}`);
    }
 };
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    watch
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: ''
    }
  });

  const password = watch("newPassword");

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
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={!!errors.currentPassword?.message}>
                  <FormLabel>Old Password</FormLabel>
                  <InputGroup>
                    <Input 
                      type={show ? 'text' : 'password'}
                      placeholder='' 
                      {...register("currentPassword", {
                        required: "Current password is required"
                      })}
                    />
                    <InputRightElement onClick={() => {setShow(!show)}}>
                      {
                        show ? 
                        <Eye className='w-5 h-5 text-gray-600'/>
                        : <EyeSlashIcon className='w-5 h-5 text-gray-600' />
                      }
                    </InputRightElement>
                  </InputGroup>
                  {errors.currentPassword && (
                    <Text as={"span"} className="text-red-500 text-sm">
                    {errors.currentPassword?.message}
                    </Text>
                  )}
                </FormControl>
                <FormControl mt={5} isInvalid={!!errors.newPassword?.message}>
                  <FormLabel>New Password</FormLabel>
                  <InputGroup>
                    <Input 
                    type={show1 ? 'text' : 'password'}
                    placeholder='' 
                    {...register("newPassword", {
                      required: "New password is required"
                    })}
                    />
                    <InputRightElement onClick={() => {setShow1(!show1)}}>
                      {
                        show1 ? 
                        <Eye className='w-5 h-5 text-gray-600'/>
                        : <EyeSlashIcon className='w-5 h-5 text-gray-600' />
                      }
                    </InputRightElement>
                  </InputGroup>
                  {errors.newPassword && (
                    <Text as={"span"} className="text-red-500 text-sm">
                    {errors.newPassword?.message}
                    </Text>
                  )}
                </FormControl>
                <FormControl mt={5} isInvalid={!!errors.newPasswordConfirmation?.message}>
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input 
                    type={show2 ? 'text' : 'password'}
                    placeholder='' 
                    {...register("newPasswordConfirmation", {
                      required: "Confirm New password is required",
                      validate: (value) =>
                        value === password || "Passwords do not match"
                    })}
                    />
                    <InputRightElement onClick={() => {setShow2(!show2)}}>
                      {
                        show2 ? 
                        <Eye className='w-5 h-5 text-gray-600'/>
                        : <EyeSlashIcon className='w-5 h-5 text-gray-600' />
                      }
                    </InputRightElement>
                  </InputGroup>
                  {errors.newPasswordConfirmation && (
                    <Text as={"span"} className="text-red-500 text-sm">
                    {errors.newPasswordConfirmation?.message}
                    </Text>
                  )}
                </FormControl>
                <HStack mt={5} justify={"end"}>
                  <Flex gap={3}>
                    <Button 
                    w={"120px"} 
                    onClick={onClose} 
                    variant={"outline"}>
                      Cancel
                    </Button>
                    <Button 
                    w={"160px"}
                    type='submit'
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    loadingText="Submitting..."
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