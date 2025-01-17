'use client'
import { Box, Divider, Flex, HStack, Tag, TagLabel, VStack } from '@chakra-ui/react'
import React from 'react'
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
import OrderDetailsCardComp from '../../_components/(my-orders-component)/OrderDetailsCardComponent';


export default function OrderDetailsPage() {

  const steps = [
    { title: 'Order Submitted', description: 'Order Submitted' },
    { title: 'Order Submitted', description: 'Shipment in Progress' },
    { title: 'Out For Delivery', description: 'Out For Delivery' },
    { title: 'Transaction Complete', description: 'Transaction Complete' },
  ]

  const { activeStep } = useSteps({
    index: 1,
    count: steps.length,
  })
  return (
    <Box my={'16px'} >
      <Box className='border border-gray-100 p-8 rounded-md'>
        <HStack>
          <h1 className='text-xl font-semibold'>Order Details</h1>
          <Tag
            size="sm"
            ml="1"
            borderRadius={"full"}
            color={"warning.500"}
            bgColor={"warning.100"}
          >
            <TagLabel>{"Pending"}</TagLabel>
          </Tag>
        </HStack>

        <Flex gap={'16px'} py={'8px'} my={'4px'} flexWrap={'wrap'}>
          <HStack>
            <h4 className='text-xs lg:text-sm '>Order Date:</h4>
            <span className='text-sm lg:text-base font-semibold'>2024-08-17 18:37:05</span>
          </HStack>
          <HStack>
            <h4 className='text-xs lg:text-sm '>Order No:</h4>
            <span className='text-sm lg:text-base font-semibold'>10MG240817627433</span>
          </HStack>
          <HStack>
            <h4 className='text-xs lg:text-sm '>Waybill Number:</h4>
            <span className='text-sm lg:text-base font-semibold'>NG020202587810</span>
          </HStack>
        </Flex>

        {/*  */}

        <Stepper index={activeStep} size={'sm'} className='mt-4'>
          {steps.map((step, index) => (
            <Step key={index} className='' >
              <div className='flex flex-col items-center '>
                <StepIndicator
                  className='border-none'
                >
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<FaDotCircle className='w-full h-full fill-gray-300' />}
                    active={<FaDotCircle className='w-full h-full fill-primary' />}
                  />
                </StepIndicator>
                <StepDescription className='text-xs mt-2'>{step.title}</StepDescription>

              </div>

              <StepSeparator className='mb-5 w-full' />
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
            Pharmacy One
          </h4>
          <p>
            +234-706-344-2345
          </p>
          <p>
            Apt. 721 56357 Abshire Squares, Jonesbury, AR 66477
          </p>
        </div>
      </Box>
      {/*  */}
      <Box>
        <h4 className='mb-2 font-semibold'>Purchased Items</h4>
        <Divider className='' />

        <div>
          <OrderDetailsCardComp />
        </div>
      </Box>
    </Box>
  )
}
