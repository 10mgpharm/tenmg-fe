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
  FormControl,
  FormLabel,
  Input,
  chakra,
  HStack,
  Button
} from '@chakra-ui/react'
import shape from '@public/assets/images/shapes.svg';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface IFormInput {
  businessName: string;
  businessEmail: string;
  // businessType: string;
}

const AddNewDrawer = (
  {isOpen, onClose, type, fetchTeamUser}: 
  {isOpen: boolean, onClose: () => void, type: string, fetchTeamUser: any}
) => {

  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    getValues
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const formData = {
      businessName: data.businessName,
      businessEmail: data.businessEmail,
      businessType: type
    }
    try {
      setIsLoading(true);
      const response = await requestClient({token: token}).post(
        "/admin/users",
        formData
      );
      if (response.status === 200) {
        toast.success(response?.data?.message);
        if(type === 'pharmacy'){
          fetchTeamUser('pharmacy', 1);
          }else if(type === 'vendor'){
            fetchTeamUser('vendor', 1);
          }else{
          fetchTeamUser('supplier', 1);
        }
        onClose();
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(handleServerErrorMessage(error));
    }
  };

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
          <DrawerHeader className='capitalize'>Add New {type}</DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={!!errors.businessName} mb={5}>
                <FormLabel>
                  Business Name 
                  <chakra.span className='text-red-600'>*</chakra.span>
                </FormLabel>
                <Input 
                id='businessName'
                errorBorderColor="red.300"
                isInvalid={!!errors.businessName} 
                type='text' 
                placeholder='Enter you business name...' 
                _focus={{
                  border: !!errors.businessName ? "red.300" : "border-gray-300",
                }}
                {...register("businessName", {
                  required: true,
                })}
                />
              </FormControl>
              <FormControl isInvalid={!!errors.businessEmail} mb={10}>
                <FormLabel>
                  Business Email
                  <chakra.span className='text-red-600'>*</chakra.span>
                </FormLabel>
                <Input 
                id='businessEmail'
                errorBorderColor="red.300"
                isInvalid={!!errors.businessEmail} 
                type='email' 
                _focus={{
                  border: !!errors.businessEmail ? "red.300" : "border-gray-300",
                }}
                {...register("businessEmail", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
                placeholder='Enter you business email...' 
                />
              </FormControl>
              <HStack gap={4} mt={6}>
                <Button variant={"outline"}>Cancel</Button>
                <Button 
                type='submit' 
                isLoading={isLoading} 
                className='bg-primary-600 text-white w-[65%]'>
                  Add {type}
                </Button>
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

export default AddNewDrawer