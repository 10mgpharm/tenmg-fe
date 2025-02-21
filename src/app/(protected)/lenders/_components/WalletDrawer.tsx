'use client'
import React, { useRef } from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  Divider,
} from '@chakra-ui/react'
import Image from 'next/image'
import { FaCircleCheck } from 'react-icons/fa6'

export default function WalletDrawer() {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  return (
    <>
      <Button ref={btnRef} colorScheme='primary' onClick={onOpen} variant={'ghost'} size={'sm'}>
        View
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
        size={'sm'}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader >Loan Summary</DrawerHeader>

          <DrawerBody>
            <div>
              <div>
                <h4 className='font-semibold text-xl'>$ 9,000,000</h4>
                <p className='font-light text-xs'>Date Disbursed: Tue, 10 Sept 2024. 19:40</p>
                <Divider my={3} />
              </div>

              <div className='my-6'>
                <p className=' font-light text-xs'>Customer Information & Loan ID</p>
                <p className='border border-slate-200 rounded-md py-2 px-4 text-[12px]'>
                  Lisa Olanrawaju - 10MG-LN001
                </p>
                <Divider my={3} />
              </div>

              <p className=' mb-1 font-light text-xs'>Repayment Information</p>
              <div className='border border-slate-200 rounded-md px-4 py-4 w-full'>

                <StatusCard status={'paid'} />
                <StatusCard status={'unpaid'} />
                <StatusCard status={'overdue'} />

              </div>
            </div>

          </DrawerBody>

          <DrawerFooter className='m-0 p-0' m={"0px"}>
            <Image
              alt=""
              src="/assets/images/base_img.png"
              width={200}
              height={200}
              className='w-full'
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}


const StatusCard = ({ status }) => {
  return (
    <div className={`flex items-center justify-between text-xs my-3 ${status === "paid"
      ? "text-green-500" : status === 'overdue' ? "text-red-500" : 'text-gray-300'}`}>
      <div className='flex gap-2'>
        <FaCircleCheck />
        <div className={`text-[12px]`}>
          <p className={`font-light `}>Nov 14, 2024</p>
          <p className='font-light'>{status}</p>
        </div>
      </div>
      <p className='font-semibold'>₦1,300,000</p>
    </div>
  )
}