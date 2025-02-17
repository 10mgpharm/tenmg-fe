import { Button } from '@chakra-ui/react'
import React from 'react'
import { PiCaretLeftBold } from 'react-icons/pi'

export default function LoanEvaluationPage() {

  const options = {
    // series: [44, 55, 13, 33],
    // labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
  }

  return (
    <div className='px-10 py-4 bg-white border-l border-slate-300'>
      <div className='flex items-center justify-between w-full'>
        <Button leftIcon={<PiCaretLeftBold />} colorScheme='primary' variant='unstyled' size={'sm'}>
          Back
        </Button>

        <div className='flex items-center gap-3 my-4'>
          <Button size='sm' colorScheme={'primary'} variant={'solid'}>
            Download Transaction History
          </Button>
          <Button size="sm" colorScheme={'primary'} variant={'outline'}>
            View Uploaded Transction History
          </Button>
        </div>
      </div>

      <div>
        <h4 className="font-semibold">Application Details</h4>
        <p className="text-sm">Overview of borrower’s loan details, including their evaluation reference and credit score.</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 my-10'>
        {/*  */}
        <div>
          <div className='w-full rounded-t-xl overflow-hidden border border-slate-300'>
            <div className='bg-[#F1F2F4] px-5 py-3 '>
              <h4 className="font-semibold">Customer Information</h4>
            </div>

            <div className="w-full p-3 bg-white">

              <div className="space-y-1 my-2">
                <p className='text-xs'>Name</p>
                <h4 className="font-semibold text-xs">Sunday Ajayi</h4>
              </div>

              <div className="space-y-1 my-2">
                <p className='text-xs'>Email Address</p>
                <h4 className="font-semibold text-xs">sundayajayi@lendsqr.com</h4>
              </div>

              <div className="space-y-1 my-2">
                <p className='text-xs'>Evaluation ID</p>
                <h4 className="font-semibold text-xs">Eval-20241030-1624-29404</h4>
              </div>

              <div className="space-y-1 my-2">
                <p className='text-xs'>Customer ID</p>
                <h4 className="font-semibold text-xs">10MG-C23404</h4>
              </div>

              <div className="space-y-1 my-2">
                <p className='text-xs'>Vendor</p>
                <h4 className="font-semibold text-xs">Bubbles Pharmacy LTD</h4>
              </div>

            </div>
          </div>
        </div>

        {/*  */}
        <div className='flex flex-col gap-4 h-full justify-between'>

          <div className='border border-slate-300 rounded-md p-5 space-y-3'>
            <p className='text-xs'>Average Transaction Volume</p>
            <p className='text-sm font-semibold'>₦161,060</p>
          </div>

          <div className='border border-slate-300 rounded-md p-5 space-y-3'>
            <p className='text-xs'>Average Transaction Volume</p>
            <p className='text-sm font-semibold'>₦161,060</p>
          </div>

          <div className='border border-slate-300 rounded-md p-5 space-y-3'>
            <p className='text-xs'>Average Transaction Volume</p>
            <p className='text-sm font-semibold'>₦161,060</p>
          </div>

        </div>

        <div className='flex flex-col gap-4 justify-between h-full'>
          <div className='grid grid-cols-3'>

            <div className='col-span-1 flex flex-col justify-between'>
              <h5 className='font-semibold text-sm'>Credit Score</h5>

              <div className='space-y-2'>
                <p className='text-xs'>Score Category</p>
                <p className='text-sm font-semibold'>Category A</p>
              </div>
              <div className='space-y-2'>
                <p className='text-xs'>Score Value</p>
                <p className='text-sm font-semibold'>855/950  </p>
              </div>
            </div>

            <div className='col-span-2'>


            </div>
          </div>
          <div>
            <div className='border border-slate-300 rounded-md p-5 space-y-3'>
              <p className='text-sm font-semibold'>Affordability Amount</p>
              <div className='flex justify-between items-center'>
                <div>
                  <p className='text-xs'>Min Amount</p>
                  <p className='text-sm font-semibold'>₦161,060</p>
                </div>
                <div>
                  <p className='text-xs'>Max Amount</p>
                  <p className='text-sm font-semibold'>₦161,060</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
