"use client";

import avatar from '@public/assets/images/Avatar.svg';
import { Button, Center, Flex, FormControl, FormLabel, HStack, Input, Textarea, useToast } from '@chakra-ui/react';
import Image from 'next/image';
import { useState } from 'react';

const PersonalInformation = () => {

    const toast = useToast()
    const [iconFile, setIconFile] = useState<string>("");

    const onLoadImage = (event: any) => {
        if (!event.target.files) return;
        if (event.target.files[0].size >= 5 * 1024 * 1024)
          return toast({
            title: "Warning",
            status: "warning",
            description: "A file selected is larger than the maximum 5MB limit, Please select a file smaller than 5MB.",
            duration: 2000,
            position: "bottom"
        })
        const inputFile = event.target.files[0];
        if (event?.target?.files?.length > 0) {
            setIconFile(URL.createObjectURL(inputFile));
        }
    };


  return (
    <div className="p-5 rounded-md bg-white max-w-3xl">
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Image src={iconFile ? iconFile : avatar } width={50} height={50} alt='' className='rounded-full h-[55px] w-[55px]'/>
                <div className="">
                    <h3 className='font-medium text-gray-500'>Upload Image</h3>
                    <p className="text-gray-400 text-sm">PDF, PNG or JPG 
                        <br></br>
                        <span className="text-xs">(Max size 5MB, 800x400px)</span>
                    </p>
                </div>
            </div>
            <Center 
                as="button" 
                flexDir={"column"} 
                width={"98px"}
                pos={"relative"} 
                overflow={"hidden"}
                >
                <input
                type="file"
                id="image_uploads"
                name="image"
                onChange={onLoadImage}
                accept=".png, .jpg, .pdf"
                style={{
                    opacity: "0",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                }}
                />
                <span className='border p-2 rounded-md px-4 text-center'>Upload</span>
            </Center>
        </div>
        <form className='space-y-5 mt-5 mb-8'>
            <HStack gap={5}>
                <FormControl>
                    <FormLabel>Contact Person&apos;s Name</FormLabel>
                    <Input placeholder='Enter contact name'/>
                </FormControl>
                <FormControl>
                    <FormLabel>Business Name</FormLabel>
                    <Input placeholder='Enter business name'/>
                </FormControl>
            </HStack>
            <HStack gap={5}>
                <FormControl>
                    <FormLabel>Business email</FormLabel>
                    <Input type='email' placeholder='Enter business email'/>
                </FormControl>
                <FormControl>
                    <FormLabel>Contact Phone Number</FormLabel>
                    <Input type='number' placeholder='Enter phone number'/>
                </FormControl>
            </HStack>
            <FormControl>
                <FormLabel>Business Address</FormLabel>
                <Textarea placeholder='Enter business address'/>
            </FormControl>
            <HStack justify={"end"}>
                <Flex>
                    <Button colorScheme='blue'>Save Changes</Button>
                </Flex>
            </HStack>
        </form>
    </div>
  )
}

export default PersonalInformation