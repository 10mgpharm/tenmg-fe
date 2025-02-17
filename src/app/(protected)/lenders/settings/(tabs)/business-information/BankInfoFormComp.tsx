'use client'
import { Button, Divider, FormControl, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form';

export default function BankInfoFormComp() {


  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      bankName: "",
      bankAccountName: "",
      bankAccountNo: "",
    },
  });

  return (
    <div>
      <div className='space-y-5 w-full flex justify-between p-5 '>
        <div>
          <h3 className='font-semibold text-lg'>Bank Information</h3>
          <p className='text-sm text-slate-300'>Manage your bank information and other information for payout</p>
        </div>
        <Button size={'sm'} variant={'solid'} colorScheme={'primary'}>Save Changes</Button>
      </div>

      <div className="p-5 rounded-lg bg-white/70 border border-slate-300">
        <form className="space-y-4">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className=''>
              <FormLabel>Bank Name</FormLabel>
              {/* <p className='text-sm'>Registered name of Business</p> */}
            </div>

            <FormControl className='col-span-2'>
              <Input type="text"
                placeholder={""}
                {...register("bankName", {
                  required: "Business name is required",
                })}
              />
            </FormControl>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className=''>
              <FormLabel>{`Account Name`}</FormLabel>
              {/* <p className='text-sm'>{`Contact person's name`}</p> */}
            </div>

            <FormControl className='col-span-2'>
              <Input type="text"
                placeholder={"Olivia Bellingham"}
                {...register("bankAccountName", {
                  required: "Contact person name is required",
                })}
              />
            </FormControl>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className=''>
              <FormLabel>{`Account Number`}</FormLabel>
              {/* <p className='text-sm'>{`Associated business email address`}</p> */}
            </div>

            <FormControl className='col-span-2'>
              <Input type="text"
                placeholder={""}
                {...register("bankAccountNo", {
                  required: "Account Number is required",
                })}
              />
            </FormControl>
          </div>
        </form>
      </div>
    </div>
  )
}
