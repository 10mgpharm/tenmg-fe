"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HStack, Text } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import pill from '@public/assets/images/Rectangle19718.png';
import Statistics from '@/app/(protected)/admin/products/_components/Statistics';
import ExploreData from '@/app/(protected)/admin/products/_components/ExploreData';

const ProductDetail = () => {
    const router = useRouter();
    return (
    <div className='p-8'>
        <HStack onClick={() => router.back()} cursor={"pointer"}>
            <ArrowLeftIcon className='w-5- h-5'/>
            <Text>Back</Text>
        </HStack>
        <div className="mt-5">
            <div className="flex gap-5 mb-3">
                <div className="">
                    <Image src={pill} alt='' className='w-[380px] h-[340px] object-cover rounded-md'/>
                </div>
                <div className="flex-1 bg-white p-5 rounded-md pb-9">
                    <div className="flex items-center justify-between">
                        <h2 className='text-lg font-semibold mb-4'>Global Pentazocine</h2>
                        <h2 className='text-lg font-semibold mb-4 text-primary-500'>₦100,000</h2>
                    </div>
                    <p className=''>Pentazocine works by interacting with specific receptors in the brain, primarily the mu-opioid receptors (MOR) and kappa-opioid receptors (KOR). 1  This interaction helps to reduce pain signals and provide relief. Pentazocine is often used to manage pain after surgical procedures.</p>
                    <ul className='list-disc mt-5 space-y-2 list-inside ml-4'>
                        <li className='text-sm'>Brand: <span className='font-semibold'>Emzor</span></li>
                        <li className='text-sm'>Value (strength):<span className='font-semibold'>500</span></li>
                        <li className='text-sm'>Value (strength):<span className='font-semibold'>kg</span></li>
                        <li className='text-sm'>Presentation:<span className='font-semibold'>Syrup</span></li>
                        <li className='text-sm'>Product Weight:<span className='font-semibold'>100</span></li>
                        <li className='text-sm'>Expiration Date:<span className='font-semibold'>25-12-2025</span></li>
                    </ul>
                </div>
            </div>
            <div className="mt-5">
                <Statistics />
                <ExploreData />
            </div>
        </div>
        {/* <div className="mt-5">
            <h2 className='text-xl font-semibold mb-4'>Global Pentazocine</h2>
            <div className="flex gap-5 mb-3 max-w-7xl">
                <Image src={pill} alt=''/>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="space-y-5">
                            <p className='text-gray-500'>
                                Price:
                                <span className='font-semibold'> #100,000</span>
                            </p>
                            <p className='text-gray-500'>
                                Current Stock:
                                <span className='font-semibold'> 50</span>
                            </p>
                        </div>
                        <div className="space-y-5">
                            <p className='text-gray-500'>
                                Brand:
                                <span className='font-semibold'> Pentazocine (NEML 23.1)</span>
                            </p>
                            <p className='text-gray-500'>
                                Date Uploaded:
                                <span className='font-semibold'> 24th August, 202</span>
                            </p>
                        </div>
                    </div>
                    <div className="mt-5">
                        <p className='font-semibold'>Descriptions</p>
                        <p className='leading-6'>Pentazocine works by interacting with specific receptors in the brain, primarily the mu-opioid receptors (MOR) and kappa-opioid receptors (KOR). 1  This interaction helps to reduce pain signals and provide relief. Pentazocine is often used to manage pain after surgical procedures.</p>
                    </div>
                </div>
            </div>
            <Divider />
            <div className="flex justify-end">
                <div className="mt-5 max-w-2xl border-2 p-3 rounded-md border-gray-100">
                    <h3 className='font-semibold text-lg mb-3'>Improvement Suggestions</h3>
                    <ul className='list-inside'>
                        <li className='list-disc'>Add clear photo so pharmacist can see every details.</li>
                        <li className='list-disc'>Items with longer descriptions sell better-- shoot for at least 300 characters. Buyers want to know the story behind their purchase</li>
                    </ul>
                </div>
            </div>
            <div className="flex items-center gap-5 mt-6">
                <div className="flex-1 bg-white p-5 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="">
                            <h3 className="text-gray-600 font-semibold text-lg">Visits</h3>
                            <p className='font-semibold'>5</p>
                        </div>
                        <select className="border p-2 rounded-lg text-gray-500 outline-none">
                            {
                                options.map((option) => (
                                    <option key={option.label} value={option.value} className="text-gray-500">{option.label}</option>
                                ))
                            }
                        </select>
                    </div>
                    <StockChart />
                </div>
                <div className="flex-1 bg-white p-5 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 font-semibold text-lg">Products Sold</h3>
                        <select className="border p-2 rounded-lg text-gray-500 outline-none">
                            {
                                options.map((option) => (
                                    <option key={option.label} value={option.value} className="text-gray-500">{option.label}</option>
                                ))
                            }
                        </select>
                    </div>
                    <RevenueChart />
                </div>
                <div className="flex-1 bg-white p-5 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="">
                            <h3 className="text-gray-600 font-semibold text-lg">Revenue</h3>
                            <p className='font-semibold'>#500,000.08</p>
                        </div>
                        <select className="border p-2 rounded-lg text-gray-500 outline-none">
                            {
                                options.map((option) => (
                                    <option key={option.label} value={option.value} className="text-gray-500">{option.label}</option>
                                ))
                            }
                        </select>
                    </div>
                    <RevenueChart />
                </div>
            </div>
            <div className="mt-6">
                <div className="flex items-center justify-between">
                    <div className="max-w-sm">
                        <h3 className='text-gray-600 font-semibold text-lg'>Explore your data</h3>
                        <p className='text-gray-500 leading-8'>How many visits result in an order? Look for trends and relationships between your numbers</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <LucideClock4 />
                        <p className='text-gray-500'>Updated just now</p>
                    </div>
                </div>
                <div className="bg-white p-5 mt-5">
                    <StackBarComponent />
                </div>
            </div>
        </div> */}
    </div>
  )
}

export default ProductDetail