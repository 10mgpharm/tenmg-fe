'use client'
import React, { useState } from 'react'
import { Button, Flex, FormControl, FormLabel, HStack, Input, Stack, Text, FormErrorMessage, } from "@chakra-ui/react"
import { HiddenFileUpload } from '../../../_components/(settings-component)/HiddenFileUpload';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';
import { useToast } from '@chakra-ui/react'
export default function ProfileInformation() {

  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const toast = useToast();

  interface IFormInput {
    businessName: string;
    contactEmail: string;
    contactPerson: string;
    contactPhone: string;
    businessAddress: string;
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      businessName: "",
      contactEmail: "",
      contactPerson: "",
      contactPhone: "",
      businessAddress: "",
    },
  });

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = (data) => {

    if (!filePreview || !file) {
      // toast.error: {  }
      // toast.error({
      //   position: 'bottom-left',
      //   title: 'Promise rejected', description: 'Something wrong'
      // })
      return;


    }

    console.log(data)
    const formData = new FormData();
    formData.append("businessName", data.businessName);
    formData.append("contactEmail", data.contactEmail);
    formData.append("contactPerson", data.contactPerson);
    formData.append("contactPhone", data.contactPhone);
    formData.append("businessAddress", data.businessAddress);
    formData.append("businessAddress", data.businessAddress);

  }


  return (
    <Stack>
      <div className="flex gap-4 items-center">
        <div className="size-28 rounded-full bg-cover bg-center bg-no-repeat shadow-gray-400 shadow-md" style={{
          backgroundImage: `url(${filePreview ? filePreview : '/assets/images/avatar.jpg'})`,
        }} />
        <div className="flex flex-col justify-between gap-3">
          <Text fontSize={"1rem"} fontWeight={600} color="gray.700">Upload Image</Text>
          <Text fontSize={"14px"} fontWeight={400} color="gray.700">Min 400x400px, PNG or JPEG</Text>

          <HiddenFileUpload
            setFilePreview={setFilePreview}
            setFile={setFile}
          />

        </div>
      </div>
      <form className="space-y-5 mt-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <HStack gap={5}>
          <FormControl>
            <FormLabel>Business Name</FormLabel>
            <Input type="text" placeholder={'Jacquelyn’s Pharmacy'}
              {...register("businessName", {
                required: "Business Name is required",
              })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Contact Person Name</FormLabel>
            <Input type="text" placeholder={'Jacquelyn Bernard'}
              {...register("contactPerson", {
                required: "Contact Person is required",
              })}
            />
          </FormControl>
        </HStack>
        <HStack gap={5}>
          <FormControl>
            <FormLabel>Business Email</FormLabel>
            <Input type="email" placeholder={'olivia@untitledui.com'}
              {...register("contactEmail", {
                required: "Business Email is required",
              })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Contact Phone Number</FormLabel>
            <Input type="tel" placeholder={'08123456789'}
              {...register("contactPhone", {
                required: "Contact Person Phone is required",
              })}
            />
          </FormControl>
        </HStack>
        <HStack gap={5}>
          <FormControl>
            <FormLabel>Business Address</FormLabel>
            <Input type="text" placeholder={'Plot 360 Obafemi Awolowo way, Jabi District, Abuja'}
              {...register("businessAddress", {
                required: "business Address is required",
              })}
            />
          </FormControl>

          <div className='w-full' />
        </HStack>
        <div className='w-fit mx-auto mt-10' >
          <Flex className="flex items-center gap-3">
            <Button variant={"outline"}>Discard</Button>
            <Button bg={"blue.700"} type="submit">Save Changes</Button>
          </Flex>
        </div>
      </form>
    </Stack>
  )
}
