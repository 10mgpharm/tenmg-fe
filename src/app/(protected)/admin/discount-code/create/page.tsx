"use client";
import { useCallback, useEffect, useState } from 'react'
import { Flex, Radio, RadioGroup, Select, Stack, Switch, Text } from '@chakra-ui/react'
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession, ProductResponseData } from '@/types';
import requestClient from '@/lib/requestClient';

const CreateDiscount = () => {
    const [method, setMethod] = useState('');
    const [products, setProducts] = useState<ProductResponseData>();
    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [value, setValue] = useState('percentage');

    const fetchingProducts = useCallback(async() => {
        try {
            const response = await requestClient({ token: token }).get(
                `/admin/settings/products`
            );
            if(response.status === 200){
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error(error)
        }
    },[token]);

    useEffect(() => {
        if(!token) return;
        fetchingProducts();
    },[token, fetchingProducts]);

    // console.log(products)
    return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-md my-16">
        <h2 className='font-semibold text-lg text-gray-700'>Create Discount</h2>
        <Stack mt={5}>
            <p className='font-medium text-lg'>Method</p>
            <RadioGroup onChange={setMethod} value={method}>
                <Stack gap={4}>
                    <Radio value='1'>First</Radio>
                    <Radio value='2'>Second</Radio>
                </Stack>
            </RadioGroup>
        </Stack>
        <div className="mt-5">
            <p className='mb-2'>Coupon Code</p>
            <div className="flex items-center gap-3">
                <input type="text" className='border p-3 rounded-md flex-1'/>
                <button className='text-medium bg-black p-3 text-white rounded-md w-36'>Generate</button>
            </div>
            <p className='text-sm text-gray-600 mt-1'>Customer must enter this code at checkout.</p>
        </div>
        <div className="mt-5">
            <p className='mb-2'>Value</p>
            <div className="flex items-center gap-4">
                <p 
                onClick={() => setValue("percentage")} 
                className={cn('py-3 px-5 rounded-md cursor-pointer', value === "percentage" ? "border" : "border-0")}>
                    Percentage
                </p>
                <p 
                onClick={() => setValue("fixed")} 
                className={cn('py-3 px-5 rounded-md cursor-pointer', value === "fixed" ? "border" : "border-0")}>
                    Fixed Amount
                </p>
                <input type="text" className='border p-3 rounded-md flex-1'/>
            </div>
        </div>
        <div className="mt-5">
            <p className='mb-2'>Applies to</p>
            <Select>
                <option value="">All Products</option>
                {
                    products?.data?.map((product) => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                    ))
                }
            </Select>
        </div>
        <div className="mt-5">
            <h4 className='font-semibold text-lg text-gray-700'>Customer Limit</h4>
            <RadioGroup mt={4} onChange={setMethod} value={method}>
                <Stack gap={4}>
                    <Radio value='1'>
                        <Stack gap={0.5}>
                            <Text fontWeight={600}>Limit one per customer</Text>
                            <Text fontSize={"14px"} color={"gray.500"}>Discount can be used once per email address</Text>
                        </Stack>
                    </Radio>
                    <Radio value='2'>
                        <Stack gap={0.5}>
                            <Text fontWeight={600}>Unlimited offer</Text>
                            <Text fontSize={"14px"} color={"gray.500"}>Discount can be used once per email address</Text>
                        </Stack>
                    </Radio>
                </Stack>
            </RadioGroup>
        </div>
        <div className="mt-6 space-y-5">
            <Flex justify={"space-between"}>
                <Stack gap={0.5}>
                    <Text fontWeight={600}>Discount has a start date?</Text>
                    <Text fontSize={"14px"} color={"gray.500"}>Schedule the discount to activate in the future</Text>
                </Stack>
                <Switch size={"md"}/>
            </Flex>
            <Flex justify={"space-between"}>
                <Stack gap={0.5}>
                    <Text fontWeight={600}>Discount has an expiry date?</Text>
                    <Text fontSize={"14px"} color={"gray.500"}>Schedule the discount to deactivate in the future</Text>
                </Stack>
                <Switch size={"md"}/>
            </Flex>
        </div>
        <div className="mt-6 flex justify-end">
            <Flex align={"center"} gap={4}>
                <button className='px-6 py-3 rounded-md border'>Cancel</button>
                <button className='p-3 bg-primary-500 text-white rounded-md w-[158px]'>Publish Code</button>
            </Flex>
        </div>
    </div>
  )
}

export default CreateDiscount