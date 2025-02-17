'use client'
import { Button, Divider, FormControl, FormLabel, Input, Switch } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form';

export default function Page() {

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  return (
    <div>
      <div className='w-full flex justify-between p-5 '>
        <div className='space-y-5'>
          <div>
            <h3 className='font-semibold text-lg'>Personal Information</h3>
            <p className='text-sm text-slate-300'>Update your personal detials</p>
          </div>

          <div className='rounded-full size-[100px] shadow-black shadow-md' />

          <div className='flex gap-4 '>
            <Button size={'sm'} variant={'outline'} colorScheme={'primary'}>Change Logo</Button>
            <Button size={'sm'} variant={'solid'} colorScheme={'red'}>Delete Logo</Button>
          </div>
        </div>
        <Button size={'sm'} variant={'solid'} colorScheme={'primary'}>Save Changes</Button>
      </div>

      <div className="p-5 rounded-lg bg-white/70 border border-slate-200">

        <form className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text"
                placeholder={"Chudi"}
                {...register("firstName", {
                  required: "First Name is required",
                })}
              />
            </FormControl>
            <FormControl>
              <Input type="text"
                placeholder={"Victor"}
                {...register("lastName", {
                  required: "Last Name is required",
                })}
              />
            </FormControl>
          </div>

          <Divider />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <FormLabel>Email</FormLabel>
            <FormControl className='col-span-2'>
              <Input type="email"
                placeholder={"olivia@untitledui.com"}
                {...register("email", {
                  required: "email is required",
                })}

              />
            </FormControl>
          </div>
        </form>
      </div>

      <div className='space-y-5 w-full flex justify-between p-5 '>
        <div>
          <h3 className='font-semibold text-lg'>Security</h3>
          <p className='text-sm text-slate-300'>Manage your password and 2FA</p>
        </div>
        <Button size={'sm'} variant={'solid'} colorScheme={'primary'}>Save Changes</Button>
      </div>
      <div className="p-5 rounded-lg bg-white/70 border border-slate-200">
        <div className='space-y-5 w-full flex justify-between p-5 '>
          {/* <div className='space-y-5'> */}
          <div>
            <h3 className='font-semibold text-lg'>Password</h3>
            <p className='text-sm text-slate-300'>Change your current password</p>
          </div>
          <Button size={'sm'} variant={'outline'} colorScheme={'primary'}>Change Password</Button>
          {/* </div> */}
        </div>

        <Divider my={4} />

        <div className='space-y-5 w-full flex justify-between p-5 '>
          <div>
            <h3 className='font-semibold text-lg'>Enable Two-Factor Authentication</h3>
            <p className='text-sm text-slate-300'>Two-Factor authentication adds another layer of security to your account.</p>
          </div>
          <Switch colorScheme='primary' />
        </div>


      </div>
    </div >
  )
}
