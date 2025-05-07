'use client'
import React, { useRef, useState } from 'react'
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
import StatusBadge from '../../_components/StatusBadge'
import { convertDate } from '@/utils/formatDate'
import { convertLetterCase, formatAmountString } from '@/utils'

export default function TransactionHistoryDrawer({records}: {records: any}) {

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
                <h4 className='font-semibold text-xl mb-2'>₦{formatAmountString(records?.amount)}</h4>
                <p className='font-light text-sm'>{convertDate(records?.createdAt)}</p>
              </div>

              <div>
                <p className='mt-4 font-light text-sm mb-2'>Details</p>
                <p className='border border-slate-500 rounded-md py-2 px-4 text-semibold'>
                  {records?.business?.name}
                </p>
              </div>

              <div className='border border-slate-500 rounded-md px-4 py-4 w-full my-8'>

                <div className='flex items-center justify-between text-xs my-3'>
                  <p className='font-light'>Status</p>
                  <p className='font-semibold '><StatusBadge status={convertLetterCase(records?.status)} bgColor="green.50" color="green.500" isDot/></p>
                </div>
                {/* <div className='flex items-center justify-between text-xs my-3'>
                  <p className='font-light'>Wallet debited</p>
                  <p className='font-semibold'>Admin</p>
                </div> */}
                <div className='flex items-center justify-between text-xs my-3'>
                  <p className='font-light'>Transaction Type</p>
                  <p className='font-semibold'>{records?.type}</p>
                </div>
                <div className='flex items-center justify-between text-xs my-3'>
                  <p className='font-light'>Transaction ID</p>
                  <p className='font-semibold'>{records?.identifier}</p>
                </div>
                <div className='flex items-center justify-between text-xs my-3'>
                  <p className='font-light'>Remark</p>
                  <p className='font-semibold'>{records?.description}</p>
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