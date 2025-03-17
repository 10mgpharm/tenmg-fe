'use client'
import { Badge, Box, Divider, Flex, HStack, Progress, Spinner, Tag, TagLabel, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from '@chakra-ui/react'
import { FaDotCircle } from "react-icons/fa";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';
import { useOrdersStore } from '@/app/(protected)/storefront/storeFrontState/useMyOrders';
import OrderDetailsCardComp from '@/app/(protected)/storefront/_components/(my-orders-component)/OrderDetailsCardComponent';
import { set } from 'react-hook-form';


export default function OrderDetailsPage() {

  const { id } = useParams();

  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const { getSingleOrder, loading, order } = useOrdersStore();

  useEffect(() => {
    if (userData?.user?.token) getSingleOrder(userData?.user?.token, id);
  }, [getSingleOrder, userData?.user?.token, id])

  console.log("order", order);

  const steps = [
    { title: 'Order Submitted', description: 'Order Submitted' },
    { title: 'Processing', description: 'Shipment in Progress' },
    { title: 'Shipped', description: 'Out For Delivery' },
    { title: 'Completed', description: 'Transaction Complete' },
  ]

  const [stepIndex, setStepIndex] = useState<number | null>(null)
  // const []= useState()


  const { activeStep, setActiveStep } = useSteps({
    index: stepIndex,
    count: steps.length,
  });

  useEffect(() => {
    const status = order?.status?.toLowerCase();

    const stepIndex = status === "completed" ? 4
      : status === "delivered" ? 3
        : status === "shipping" ? 2
          : status === "processing" ? 1
            : status === "pending" ? 1
              : -1;

    setStepIndex(stepIndex)
    setActiveStep(stepIndex)


  }, [order?.status, setActiveStep])

  return (
    <>
      {loading ?
        <Box my={'16px'} className='border border-gray-100 p-8 rounded-md flex items-center justify-center'>
          <Spinner />
        </Box>
        :
        <Box my={'16px'} >
          <Box className='border border-gray-100 p-8 rounded-md'>
            <HStack>
              <h1 className='text-xl font-semibold'>Order Details</h1>
              <Badge
                colorScheme={order?.status?.toLowerCase() === 'completed' || order?.status?.toLowerCase() === "delivered" ? "green" :
                  order?.status?.toLowerCase() === "pending" || order?.status?.toLowerCase() === "processing" ? "warning" : "red"}
                fontSize="10px" px="2" py="1" borderRadius="xl" variant={'solid'}>
                {/* <span style={{ textTransform: 'capitalize' }}>{order?.status}</span> */}
                <span style={{ textTransform: 'capitalize' }}>{order?.status.toLowerCase() === "cancelled" || order?.status.toLowerCase() === "canceled" ? order?.refundStatus : order?.status}</span>
              </Badge>
            </HStack>

            <Flex gap={'16px'} py={'8px'} my={'4px'} flexWrap={'wrap'}>
              <HStack>
                <h4 className='text-xs lg:text-sm '>Order Date:</h4>
                <span className='text-sm lg:text-base font-semibold'>{order?.createdAt?.split("T")[0]} {order?.createdAt?.split("T")[1].split(".")[0]}</span>
              </HStack>
              <HStack>
                <h4 className='text-xs lg:text-sm '>Order No:</h4>
                <span className='text-sm lg:text-base font-semibold'>{order?.id}</span>
              </HStack>
              <HStack>
                <h4 className='text-xs lg:text-sm '>Waybill Number:</h4>
                <span className='text-sm lg:text-base font-semibold'></span>
              </HStack>
            </Flex>

            {/*  */}

            <Stepper index={activeStep} size={'sm'} className='mt-4 '>
              {steps.map((step, index) => (
                <Step key={index} className='' >
                  <div className='flex flex-col items-center relative'>
                    <StepIndicator
                      className='border-none'
                    >
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<FaDotCircle className='w-full h-full fill-gray-300' />}
                        active={<FaDotCircle className='w-full h-full fill-primary' />}
                      />
                    </StepIndicator>
                    <StepDescription className='text-xs mt-2 absolute text-nowrap top-3/4'>{step.title}</StepDescription>

                  </div>
                  <StepSeparator className=' w-[100%] absolute left-4' />

                </Step>

              ))}
            </Stepper>
          </Box>
          {/*  */}
          <Box className='border border-gray-100 p-8 rounded-md my-8'>

            <h4 className='mb-2 font-semibold'>Shipping Address</h4>
            <Divider className='' />

            <div>
              <h4 className='font-semibold'>
                {order?.deliveryAddress}
              </h4>
              <p>{order?.customer?.phone}</p>
              {/* <p>
            Apt. 721 56357 Abshire Squares, Jonesbury, AR 66477
          </p> */}
            </div>
          </Box>
          {/*  */}
          <Box>
            <h4 className='mb-2 font-semibold'>Purchased Items</h4>
            <Divider className='' />

            <div>
              {/* <div key={index} className='border border-gray-100 rounded-md p-4 mb-4'> */}
              {
                order?.items?.map((item, index) => (
                  <OrderDetailsCardComp key={index} prod={item} />
                ))
              }
            </div>
          </Box>
        </Box>}
    </>
  )
}
