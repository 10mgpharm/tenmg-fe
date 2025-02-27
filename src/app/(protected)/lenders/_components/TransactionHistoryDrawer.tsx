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
} from '@chakra-ui/react'
import Image from 'next/image'

export default function TransactionHistoryDrawer() {

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
        size={'sm'}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader >Transaction History</DrawerHeader>

          <DrawerBody>
            <div>
              <div>
                <h4 className='font-semibold text-xl'>₦9000</h4>
                <p className='font-light text-sm'>Tue, 10 Sept 2024. 19:40</p>
              </div>

              <div>
                <p className='mt-4 font-light text-sm'>Details</p>
                <p className='border border-slate-500 rounded-md py-2 px-4 text-semibold'>
                  Lisa Olanrawaju
                </p>
              </div>

              <div className='border border-slate-500 rounded-md px-4 py-4 w-full my-8'>

                <div className='flex items-center justify-between text-xs my-3'>
                  <p className='font-light'>Status</p>
                  <p className='font-semibold'>Completed</p>
                </div>
                <div className='flex items-center justify-between text-xs my-3'>
                  <p className='font-light'>Wallet debited</p>
                  <p className='font-semibold'>Admin</p>
                </div>
                <div className='flex items-center justify-between text-xs my-3'>
                  <p className='font-light'>Transaction Type</p>
                  <p className='font-semibold'>NIP OUTWARD TRANSFER</p>
                </div>
                <div className='flex items-center justify-between text-xs my-3'>
                  <p className='font-light'>SessionID</p>
                  <p className='font-semibold'>00001324019929464</p>
                </div>
                <div className='flex items-center justify-between text-xs my-3'>
                  <p className='font-light'>Remark</p>
                  <p className='font-semibold'>00001324019929464</p>
                </div>
              </div>
            </div>

          </DrawerBody>

          <DrawerFooter>
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

//
//
//
//
//  