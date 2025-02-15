import React from 'react'
import LoanLayout from '../../_components/LoanLayout'
import { ApplicationDto, BusinessDto, CustomerDto } from '@/types';
import { Box, Button, Flex, Link, Text, VStack } from '@chakra-ui/react';
import { Eye, LockIcon, Percent, ShoppingBag } from 'lucide-react';
import config from '@/lib/config';
import LoanProfile from '../../_components/LoanProfile';

interface Props {
    business: BusinessDto;
    customer: CustomerDto;
    application: ApplicationDto;
    navigateBackAction?: () => void;
    onContinueAction?: () => void;
}

export default function StepOneConsent({ business, customer, navigateBackAction, onContinueAction }: Props) {
  return (
      <LoanLayout
          name={business?.name}
          logo={business?.logo}
          navigateBackAction={navigateBackAction}
          title='Pay With 10MG Credit - Buy Now Pay Later'
      >
          <Text fontSize={'sm'} fontWeight={'medium'} mb={10}>
              Hi <b className='text-blue-500'>{customer?.name}</b>,  grant permission to access your account information on <span className='text-blue-500'>{business?.name} ECommerce</span>.
          </Text>

          <VStack align={'self-start'} className='space-y-5'>

              <Flex gap={5}>
                  <ShoppingBag strokeWidth={2.5} className='h-8 w-8' />
                  <Box>
                      <Text fontSize={'sm'} fontWeight={'bold'}>
                          Transaction Analysis
                      </Text>
                      <Text fontSize={'sm'} fontWeight={'normal'}>
                          Evaluate your 6-Months transaction history to derive meaningful insight for credit elegibility.
                      </Text>
                  </Box>
              </Flex>

              <Flex gap={5}>
                  <Percent strokeWidth={2.5} className='h-8 w-8' />
                  <Box>
                      <Text fontSize={'sm'} fontWeight={'bold'}>
                          AI-Driven Credit Score
                      </Text>
                      <Text fontSize={'sm'} fontWeight={'normal'}>
                        AI-Driven credit scoring system that enables you to qualify for 10mg Credit with our lending partners.
                      </Text>
                  </Box>
              </Flex>

              <Flex gap={5}>
                  <LockIcon strokeWidth={2.5} className='h-8 w-8' />
                  <Box>
                      <Text fontSize={'sm'} fontWeight={'bold'}>
                          Secured
                      </Text>
                      <Text fontSize={'sm'} fontWeight={'normal'}>
                        Your information is 100% secure, encrypted in transit and at rest.
                      </Text>
                  </Box>
              </Flex>

              <Flex gap={5}>
                  <Eye strokeWidth={2.5} className='h-8 w-8' />
                  <Box>
                      <Text fontSize={'sm'} fontWeight={'bold'}>
                          Privacy
                      </Text>
                      <Text fontSize={'sm'} fontWeight={'normal'}>
                          Your information will only be used to provide you with the {config.appName} credit service
                      </Text>
                  </Box>
              </Flex>


              <Button colorScheme="purple" size="lg" w="full" type="submit" onClick={onContinueAction}>
                  Continue
              </Button>

              <Flex mb={10} alignItems="center" justify="center" gap={2}>
                  <Text color="gray.500" fontSize="sm" align="center">
                      By using this service, you agree to the
                      <Link href="#" color={"blue.500"}>
                          {" "}
                          Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="#" color={"blue.500"}>
                          Privacy Policy
                      </Link>
                  </Text>
              </Flex>
              
          </VStack>

      </LoanLayout>
  )
}
