'use client'
import { Button, Divider, Flex, FormControl, FormLabel, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'


export default function Password() {

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

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
              <div className='w-2/4 relative'>
                <div className='w-fit absolute z-10 top-1/2 -translate-y-1/2 right-2 ' >
                  {showCurrentPassword ?
                    <EyeSlashIcon className='w-4 cursor-pointer text-gray-400' onClick={() => setShowCurrentPassword(!showCurrentPassword)} /> :
                    <EyeIcon className='w-4 cursor-pointer text-gray-400' onClick={() => setShowCurrentPassword(!showCurrentPassword)} />}
                </div>
                <Input type={showCurrentPassword ? "text" : "password"} defaultValue={'current password'} className='w-fit' />
              </div>
            </FormControl>
          </HStack>
          <Divider my={3} />
          <HStack className='w-full'>
            <FormControl className='flex w-full gap-4'>
              <FormLabel className='w-1/4'>New Password</FormLabel>
              <div className='w-2/4'>

                <div className='w-full relative'>
                  <div className='w-fit absolute z-10 top-1/2 -translate-y-1/2 right-2 ' >
                    {showPassword ?
                      <EyeSlashIcon className='w-4 cursor-pointer text-gray-400' onClick={() => setShowPassword(!showPassword)} /> :
                      <EyeIcon className='w-4 cursor-pointer text-gray-400' onClick={() => setShowPassword(!showPassword)} />}
                  </div>
                  <Input type={showPassword ? "text" : "password"} defaultValue={'new password'} className='w-fit' />
                </div>
                <p className='text-sm text-gray-500 font-semibold'>Your new password must be more than 8 characters.</p>
              </div>
            </FormControl>
          </HStack>
          <Divider my={3} />
          <HStack className='w-full'>
            <FormControl className='flex w-full gap-4'>
              <FormLabel className='w-1/4'>Confirm New Password</FormLabel>
              <div className='w-2/4 relative'>
                <div className='w-fit absolute z-10 top-1/2 -translate-y-1/2 right-2 ' >
                  {showConfirmedPassword ?
                    <EyeSlashIcon className='w-4 cursor-pointer text-gray-400' onClick={() => setShowConfirmedPassword(!showConfirmedPassword)} /> :
                    <EyeIcon className='w-4 cursor-pointer text-gray-400' onClick={() => setShowConfirmedPassword(!showConfirmedPassword)} />}
                </div>
                <Input type={showConfirmedPassword ? "text" : "password"} defaultValue={'confirm password'} className='w-fit' />
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
