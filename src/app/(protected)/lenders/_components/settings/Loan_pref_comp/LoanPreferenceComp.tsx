'use client'
import { Button, Divider, FormControl, FormLabel, Input, Select } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form';


export default function LoanPreferenceComp() {

  const loan_tenure = ['3 months', '6 months', '12 months'];

  const category = ['Category A  (Above 75%)',
    'Category B  (Above 50%)',
    'Category C  (Above 25%)',
    'Category D  (Below 25%)'
  ]

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      loanTenureOption: "",
      loanInterestRate: "",
      CustomerCategory: "",
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
              <FormLabel>Loan Tenure Option</FormLabel>
              <p className='text-sm text-slate-300'>Loan Duration</p>
            </div>

            <FormControl className="col-span-2">
              <Select
                {...register("loanTenureOption", {
                  required: "Loan tenure option is required",
                })}
                defaultValue=""
              >
                <option value="" disabled>
                  Select loan tenure
                </option>
                {loan_tenure.map((option, i) =>
                  <option value={option} key={i}>{option}</option>
                )}
              </Select>
            </FormControl>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className=''>
              <FormLabel>{`Interest Rate`}</FormLabel>
              <p className='text-sm text-slate-300'>{`System Default interest rate `}</p>
            </div>

            <FormControl className='col-span-2'>
              <Input type="text"
                placeholder={"9%"}
                {...register("loanInterestRate", {
                  required: "Loan interest rate is required",
                })}
              />
            </FormControl>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className=''>
              <FormLabel>{`Customer Credit Score Category`}</FormLabel>
              <p className='text-sm text-slate-300'>{`Specify the customer categories you would like to give credit to`}</p>
            </div>
            {/* category */}
            <FormControl className='col-span-2'>
              <Select
                {...register("CustomerCategory", {
                  required: "Please specify customer category",
                })}
                defaultValue=""
              >
                <option value="" disabled>
                  Select loan tenure
                </option>
                {loan_tenure.map((option, i) =>
                  <option value={option} key={i}>{option}</option>
                )}
              </Select>
            </FormControl>
          </div>
        </form>
      </div>
    </div>
  )
}
