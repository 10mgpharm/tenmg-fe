'use client'
import { Button, Divider, FormControl, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form';

export default function BusinessInfoFormComp() {


  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      businessName: "",
      contactName: "",
      businessEmail: "",
    },
  });

  return (
    <div>
      <div className='space-y-5 w-full flex justify-between p-5 '>
        <div>
          <h3 className='font-semibold text-lg'>Business Information</h3>
          <p className='text-sm'>Manage your business information</p>
        </div>
        <Button size={'sm'} variant={'solid'} colorScheme={'primary'}>Save Changes</Button>
      </div>

      <div className="p-5 rounded-lg bg-white/70 border border-slate-300">
        <form className="space-y-4">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className=''>
              <FormLabel>Business Name</FormLabel>
              <p className='text-sm'>Registered name of Business</p>
            </div>

            <FormControl className='col-span-2'>
              <Input type="text"
                placeholder={"Business Name"}
                {...register("businessName", {
                  required: "Business name is required",
                })}
              />
            </FormControl>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className=''>
              <FormLabel>{`Contact Person's Name`}</FormLabel>
              <p className='text-sm'>{`Contact person's name`}</p>
            </div>

            <FormControl className='col-span-2'>
              <Input type="text"
                placeholder={"Olivia Bellingham"}
                {...register("contactName", {
                  required: "Contact person name is required",
                })}
              />
            </FormControl>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className=''>
              <FormLabel>{`Email Address`}</FormLabel>
              <p className='text-sm'>{`Associated business email address`}</p>
            </div>

            <FormControl className='col-span-2'>
              <Input type="email"
                placeholder={"olivia.bellingham@me.com"}
                {...register("businessEmail", {
                  required: "Business email is required",
                })}
              />
            </FormControl>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className=''>
              <FormLabel>{`Phone Number`}</FormLabel>
              <p className='text-sm'>{`Associated business phone number`}</p>
            </div>

            <FormControl className='col-span-2'>
              <Input type="tel"
                placeholder={"(123) 456-7890"}
                {...register("businessEmail", {
                  required: "phone number is required",
                })}
              />
            </FormControl>
          </div>

        </form>


      </div>
    </div>
  )
}
