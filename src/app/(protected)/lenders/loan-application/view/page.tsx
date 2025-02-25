'use client'
import { Badge, Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { BiCaretLeft } from 'react-icons/bi'
import { PiCaretLeftBold } from 'react-icons/pi'

export default function LoanViewPage() {
  const router = useRouter();
  return (
    <div className='mx-10 my-4'>
      <Button leftIcon={<PiCaretLeftBold />} colorScheme='primary' variant='unstyled' onClick={() => { router.push('/lenders/loan-application') }}>
        Back
      </Button>
      {false ?

        <>
          <div className='flex items-center justify-between w-full'>
            <div>
              <h4 className="font-semibold">Application Details</h4>
              <p className="text-sm">Overview of borrower’s loan details, including their evaluation reference and credit score.</p>
            </div>
            <div className='flex items-center gap-3'>
              <Button size='sm' colorScheme={'red'}>
                Decline Offer
              </Button>
              <Button size="sm" colorScheme={'success'}>
                Accept Offer
              </Button>
            </div>
          </div>
          <div className='w-full rounded-t-xl overflow-hidden my-5'>
            <div className='bg-[#D1E9FF] px-5 py-3 '>
              <h4 className="font-semibold">Customer Information</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-5 py-3 bg-white">
              <div className="space-y-2">
                <p className='text-sm'>Borrower’s Name</p>
                <h4 className="font-semibold text-sm">Linda Olanrewaju</h4>
              </div>
              <div className="space-y-2">
                <p className='text-sm'>Email Address</p>
                <h4 className="font-semibold text-sm">ahmed.linda@lendsqr.com</h4>
              </div>
              <div className="space-y-2">
                <p className='text-sm'>Reference ID</p>
                <h4 className="font-semibold text-sm">10MG-10212012</h4>
              </div>
              <div className="space-y-2">
                <p className='text-sm'>Vendor Information</p>
                <h4 className="font-semibold text-sm">720 (Good)</h4>
              </div>
              <div className="space-y-2">
                <p className='text-sm'>Status</p>
                <Badge colorScheme="green" fontSize="10px" px="2" py="1" borderRadius="xl" variant={'subtle'}>
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </>
        :
        <>
          <div className='flex items-center justify-between w-full'>
            <div>
              <h4 className="font-semibold">Application Details</h4>
              <p className="text-sm">Overview of borrower’s loan details, including their evaluation reference and credit score.</p>
            </div>
            <div className='flex items-center gap-3'>
              <Button size='sm' colorScheme={'primary'} variant={'solid'}>
                View Loan
              </Button>
              <Button size="sm" colorScheme={'primary'} variant={'outline'} onClick={() => { router.push('/lenders/loan-application/evaluation') }}>
                View Credit Score
              </Button>
            </div>
          </div>



          <div className='w-full rounded-t-xl overflow-hidden my-5'>
            <div className='bg-[#D1E9FF] px-5 py-3 '>
              <h4 className="font-semibold">Customer Information</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-5 py-3 bg-white">
              <div className="space-y-2">
                <p className='text-sm'>Borrower’s Name</p>
                <h4 className="font-semibold text-sm">Linda Olanrewaju</h4>
              </div>
              <div className="space-y-2">
                <p className='text-sm'>Email Address</p>
                <h4 className="font-semibold text-sm">ahmed.linda@lendsqr.com</h4>
              </div>
              <div className="space-y-2">
                <p className='text-sm'>Reference ID</p>
                <h4 className="font-semibold text-sm">10MG-10212012</h4>
              </div>
              <div className="space-y-2">
                <p className='text-sm'>Credit Score</p>
                <h4 className="font-semibold text-sm">720 (Good)</h4>
              </div>
              <div className="space-y-2">
                <p className='text-sm'>Status</p>
                <Badge colorScheme="green" fontSize="10px" px="2" py="1" borderRadius="xl" variant={'solid'}>
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </>
      }


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
        <div className="rounded-t-xl overflow-hidden">
          <div className='bg-primary px-5 py-3 '>
            <h4 className="font-semibold text-white">Loan Request Details</h4>
          </div>
          <div className="gap-4 px-5 py-3 bg-white space-y-3">
            <div className="space-y-0.5 my-2">
              <p className='text-sm font-thin '>Loan Amount</p>
              <h4 className="font-semibold text-sm">N500,000,000.00</h4>
            </div>
            <div className="space-y-0.5 my-2">
              <p className='text-sm font-thin '>Tenure</p>
              <h4 className="font-semibold text-sm">6 Months</h4>
            </div>
            <div className="space-y-0.5 my-2">
              <p className='text-sm font-thin '>Instalment Amount:</p>
              <h4 className="font-semibold text-sm">N150,000 monthly</h4>
            </div>
            <div className="space-y-0.5 my-2">
              <p className='text-sm font-thin '>Interest Applied:</p>
              <h4 className="font-semibold text-sm">12%</h4>
            </div>
          </div>
        </div>

        <div className="rounded-t-xl overflow-hidden">
          <div className='bg-primary px-5 py-3 flex items-center justify-between'>
            <h4 className="font-semibold text-white">Credit Score</h4>
            <p className='text-white'>View Results</p>
          </div>
          <div className="gap-4 px-5 py-3 bg-white space-y-3">
            <div className="space-y-0.5 my-2">
              <p className='text-sm font-thin'>Credit Score</p>
              <h4 className="font-semibold text-sm">90/100 (Category A)</h4>
            </div>
            <div className="space-y-0.5 my-2">
              <p className='text-sm font-thin'>Total Transaction Volume </p>
              <h4 className="font-semibold text-sm">N500,000,000.00</h4>
            </div>
            <div className="space-y-0.5 my-2">
              <p className='text-sm font-thin'>Average Transaction Amount:</p>
              <h4 className="font-semibold text-sm">N450,000.00</h4>
            </div>
            <div className="space-y-0.5 my-2">
              <p className='text-sm font-thin'>Performance Status:</p>
              <h4 className="font-semibold text-sm">Performing</h4>
            </div>
          </div>
        </div>
      </div>



      <div className="rounded-t-xl overflow-hidden">
        <div className='bg-primary px-5 py-3 '>
          <h4 className="font-semibold text-white">Loan History</h4>

        </div>

        <table className='w-full text-center'>
          <thead className="bg-[#E8F1F8] text-[#1A70B8]">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Transactions</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-b-slate-400 text-xs">
              <td className="py-2">20/11/2014</td>
              <td className="py-2">Purchase Supplies</td>
              <td className="py-2">  <Badge colorScheme="warning" fontSize="10px" px="2" py="1" borderRadius="xl">
                •<span className='' style={{ textTransform: 'capitalize' }}> Outstanding</span>
              </Badge></td>
            </tr>
          </tbody>
        </table>

      </div>


    </div>
  )
}

