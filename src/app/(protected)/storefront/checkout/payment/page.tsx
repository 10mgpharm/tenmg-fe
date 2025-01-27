'use client'
import React, { useEffect, useState } from 'react'
import BreadCrumbBanner from '../../_components/BreadCrumbBanner'
import { Box, Button, Divider, Flex, FormLabel, Image, Input, Stack } from '@chakra-ui/react'
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';
import requestClient from '@/lib/requestClient';
import { toast } from 'react-toastify';
import { handleServerErrorMessage } from '@/utils';
import { Radio, RadioGroup } from '@chakra-ui/react'
import { useCartStore } from '../../storeFrontState/useCartStore';
import { CheckIcon } from '@heroicons/react/20/solid';
import { FaCheck } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {

  const [cartItems, setCartItems] = useState<any>({});
  const { cart, } = useCartStore();

  const router = useRouter();

  useEffect(() => {
    if (cart) {
      setCartItems(cart)
    }
  }, [cart])


  const breadCrumb = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Checkout',
      link: '/storefront/checkout'
    },
    {
      text: `Payment`,
      link: '#'
    }
  ]

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const userToken = sessionData?.user?.token;
  const [shippingAddresses, setShippingAddresses] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('1')

  useEffect(() => {
    if (!userToken) return;

    const fetchAddresses = async () => {
      setIsLoading(true);
      try {
        const response = await requestClient({ token: userToken }).get(
          "/storefront/shipping-addresses"
        );
        if (response.status === 200) {
          const data = response.data.data;
          setShippingAddresses(data[0] || []);
        } else {
          toast.error(`Error: ${response.data.message}`);
        }
      } catch (error) {
        const errorMessage = handleServerErrorMessage(error);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [userToken]);


  return (
    <>
      <BreadCrumbBanner breadCrumbsData={breadCrumb} />
      <Box p={4} mt={2} className='grid grid-cols-1 lg:grid-cols-6 w-full lg:w-10/12 mx-auto gap-8'>

        <div className='col-span-1 lg:col-span-4 '>
          <div className='w-full border border-r-gray-100 rounded-t-2xl overflow-hidden'>
            <div className='flex items-center justify-between p-4 bg-primary-100'>
              <h3 className='font-semibold text-lg'>Order Summary</h3>
              <Button onClick={() => router.push('/storefront/settings/shipping-address')} variant={'outline'} colorScheme={'primary'} size={'sm'}>Edit</Button>
            </div>
            <div>
              <div
                className="p-5 flex flex-col gap-2 mx-auto w-full"
              >
                <h2 className="text-xl font-bold">{shippingAddresses.name}</h2>
                <p className="text-base font-bold">{shippingAddresses.phoneNumber}</p>
                <p className="text-sm text-gray-500">
                  {shippingAddresses.address}, {shippingAddresses.city}, {shippingAddresses.state}, {shippingAddresses.country}
                </p>

              </div>
            </div>
          </div>

          <div className='w-full border border-r-gray-100 rounded-t-2xl overflow-hidden mt-10'>
            <div className='p-4 bg-primary-100'>
              <h3 className='font-semibold text-lg'>Payment Method</h3>
            </div>
            <div className='p-4'>

              <RadioGroup onChange={setValue} value={value} className='w-full'>
                <Stack direction='column'>

                  <div className='flex items-center justify-between w-full hover:bg-primary-50 p-3'>
                    <p className='font-semibold'>Pay with Card</p>
                    <Radio value='1' className='' />
                  </div>
                  <div className='flex items-center p-3 justify-between w-full cursor-not-allowed hover:bg-primary-50'>
                    <p className='font-semibold'>Pay with 10Mg Credit</p>
                    <Radio value='2' className='' disabled />
                  </div>


                </Stack>
              </RadioGroup>

            </div>
          </div>
        </div>
        <div className='col-span-1 lg:col-span-2 border border-r-gray-100 rounded-2xl overflow-hidden'>
          <div className=' flex items-center justify-between p-4'>
            <h3 className='font-semibold text-lg'>Order Summary</h3>
            <Button variant={'outline'} colorScheme={'primary'} size={'sm'} onClick={() => router.push('/storefront/checkout')}>Edit</Button>
          </div>
          <Divider />
          <div className='p-4 '>
            <div className='h-48 overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-primary-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-primary-300
  dark:[&::-webkit-scrollbar-track]:bg-primary-700
  dark:[&::-webkit-scrollbar-thumb]:bg-primary-500'>
              {
                cartItems?.items?.map((item, i) =>
                (<div key={i} className=' flex items-center gap-4 hover:bg-primary-50 p-3'>
                  <Image
                    src={item?.product?.thumbnailFile}
                    alt={item?.product?.name}
                    boxSize={'75px'}
                    objectFit={'cover'}
                    rounded={'md'}
                  />
                  <div>
                    <p className='font-semibold'>{item?.product?.name} {item?.product?.variation?.strengthValue}{item?.product?.measurement?.name}</p>
                    <p>Qty: {item?.quantity}</p>
                    <div className='flex items-center gap-x-1'>
                      {item?.discountPrice > 0 && (
                        <p className="text-gray-900 font-semibold my-2 text-sm">
                          ₦{parseInt(item?.discountPrice)}
                        </p>
                      )}
                      <p className={`font-semibold my-2 text-sm ${item?.discountPrice > 0 ? "text-gray-400 line-through" : "text-gray-900"}`}>
                        ₦{item?.actualPrice}
                      </p>
                    </div>
                    {/* <p className='font-semibold'>₦ {item?.discountPrice > 0 ? item?.discountPrice : item?.actualPrice}</p> */}
                  </div>
                </div>)
                )
              }
            </div>
            <Divider my={5} />
            <div className=''>
              <FormLabel>Coupon Code</FormLabel>
              <div className='flex items-center gap-2'>
                <Input
                  type="text"
                  placeholder=""
                />
                <Button colorScheme={'primary'} size={'sm'}><FaCheck className='text-white text-xl' /></Button>
              </div>
            </div>
            <Divider my={5} />

            <div>
              <div className='flex items-center gap-x-2'>
                <p>Cart Total:</p>
                <p className='font-semibold'>{cartItems?.orderTotal}</p>
              </div>
              {/* <div>
                <p>Discount Total:</p>
                <p></p>
              </div> */}
              <div>
                <p>Shipping fee:</p>
                <p></p>
              </div>
            </div>
            <Divider my={5} />

            <div className='flex items-center gap-x-2'>
              <p>Total:</p>
              <p className='font-semibold'>{cartItems?.orderTotal}</p>
            </div>

            <Divider my={5} />
            <Button colorScheme={'primary'}>Pay Now</Button>
          </div>
        </div>
      </Box>
    </>
  )
}
// EditAddressModal