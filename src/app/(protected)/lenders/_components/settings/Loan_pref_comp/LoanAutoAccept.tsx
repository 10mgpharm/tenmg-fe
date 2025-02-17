import { Button, Switch } from '@chakra-ui/react'
import React from 'react'

export default function LoanAutoAccept() {
  return (
    <div>

      <div className='space-y-5 w-full flex justify-between p-5 '>
        <div>
          <h3 className='font-semibold text-lg'>Loan Security</h3>
          <p className='text-sm text-slate-300'>Define your preferences for loan disbursement.</p>
        </div>
        <Button size={'sm'} variant={'solid'} colorScheme={'primary'}>Save Changes</Button>
      </div>

      <div className='space-y-5 w-full flex justify-between p-5 '>
        <div>
          <h3 className='font-semibold text-lg'>Enable Two-Factor Authentication</h3>
          <p className='text-sm text-slate-300'>Two-Factor authentication adds another layer of security to your account.</p>
        </div>
        <Switch colorScheme='primary' />
      </div>

    </div>
  )
}
