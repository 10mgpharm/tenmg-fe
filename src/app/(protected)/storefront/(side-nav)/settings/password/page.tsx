import { Button, Divider, Flex, FormControl, FormLabel, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React from 'react'


export default function Password() {
  return (
    <div>
      <VStack>
        <div className="flex flex-col justify-between gap-3 w-full">
          <Text fontSize={"1rem"} fontWeight={600} color="gray.700">Change Password</Text>
          <Text fontSize={"14px"} fontWeight={400} color="gray.700">Please enter your current password to change your password.</Text>
        </div>
        <Divider my={3} />

        <form className="space-y-5 w-full">
          <HStack className='w-full'>
            <FormControl className='flex w-full gap-4'>
              <FormLabel className='w-1/4'>Current Password</FormLabel>
              <div className='w-2/4'>
                <Input type="password" defaultValue={'Jacquelyn’s Pharmacy'} className='w-fit' />
              </div>
            </FormControl>
          </HStack>
          <Divider my={3} />
          <HStack className='w-full'>
            <FormControl className='flex w-full gap-4'>
              <FormLabel className='w-1/4'>New Password</FormLabel>
              <div className='w-2/4'>
                <Input type="password" defaultValue={'Jacquelyn’s Pharmacy'} className='w-fit' />
              </div>
            </FormControl>
          </HStack>
          <Divider my={3} />
          <HStack className='w-full'>
            <FormControl className='flex w-full gap-4'>
              <FormLabel className='w-1/4'>Confirm New Password</FormLabel>
              <div className='w-2/4'>
                <Input type="password" defaultValue={'Jacquelyn’s Pharmacy'} className='w-fit' />
              </div>
            </FormControl>
          </HStack>
          <Divider my={3} />

          <div className='w-fit mx-auto mt-10' >
            <Flex className="flex items-center gap-3">
              <Button variant={"outline"}>Discard</Button>
              <Button bg={"blue.700"}>Save Changes</Button>
            </Flex>
          </div>
        </form>

      </VStack>
    </div>
  )
}
