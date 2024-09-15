import avatar from '@/assets/Images/Avatar.svg';
import { Button, Flex, FormControl, FormLabel, HStack, Input, Textarea } from '@chakra-ui/react';
import Image from 'next/image';

const PersonalInformation = () => {
  return (
    <div className="p-5 rounded-md bg-white max-w-3xl">
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Image src={avatar} alt=''/>
                <div className="">
                    <h3 className='font-medium text-gray-500'>Upload Image</h3>
                    <p className='text-gray-400'>Min 400x400px, PNG or JPEG</p>
                </div>
            </div>
            <button className='border p-2 rounded-md px-4'>Upload</button>
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
                    <Input type='email' placeholder='Enter contact name'/>
                </FormControl>
                <FormControl>
                    <FormLabel>Contact Phone Number</FormLabel>
                    <Input type='number' placeholder='Enter phone number'/>
                </FormControl>
            </HStack>
            <FormControl>
                <FormLabel>Business Address</FormLabel>
                <Textarea placeholder='Enter here'/>
            </FormControl>
            <HStack justify={"end"}>
                <Flex>
                    <Button variant='outline' mr={3}>
                    Cancel
                    </Button>
                    <Button colorScheme='blue'>Save Changes</Button>
                </Flex>
            </HStack>
        </form>
    </div>
  )
}

export default PersonalInformation