"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
    HStack, 
    Tab, 
    TabList, 
    TabPanel,
    TabPanels, 
    Tabs, 
    Text 
} from '@chakra-ui/react';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import pill from '@public/assets/images/Rectangle19718.png';
import Essentials from '../components/Essentials';
import Statistics from '../components/Statistics';
import Reviews from '../components/Reviews';

const ProductDetail = () => {
    const router = useRouter();
    return (
    <div className='p-8'>
        <HStack onClick={() => router.back()} cursor={"pointer"}>
            <ArrowLeftIcon className='w-5 h-5'/>
            <Text>Back</Text>
        </HStack>
        <div className="mt-5">
            <h2 className='text-xl font-semibold mb-4'>Global Pentazocine</h2>
            <div className="flex gap-5 mb-3">
                <div className="">
                    <Image src={pill} alt='' className='w-[380px] h-auto'/>
                    <div className="grid grid-cols-3 gap-x-2 gap-y-6 mt-3">
                        <div className="space-y-2">
                            <p className='text-gray-600 text-sm'>Name</p>
                            <p className='text-gray-700 font-medium'>Zimax</p>
                        </div>
                        <div className="space-y-2">
                            <p className='text-gray-600 text-sm'>Brand</p>
                            <p className='text-gray-700 font-medium'>Azithromycin</p>
                        </div>
                        <div className="space-y-2">
                            <p className='text-gray-600 text-sm'>Weight</p>
                            <p className='text-gray-700 font-medium'>500mg</p>
                        </div>
                        <div className="space-y-2">
                            <p className='text-gray-600 text-sm'>Category</p>
                            <p className='text-gray-700 font-medium'>Tablet</p>
                        </div>
                        <div className="space-y-2">
                            <p className='text-gray-600 text-sm'>Manufacturer</p>
                            <p className='text-gray-700 font-medium'>Healthcare</p>
                        </div>
                        <div className="space-y-2">
                            <p className='text-gray-600 text-sm'>Expire Date</p>
                            <p className='text-gray-700 font-medium'>19/12/2024</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-white p-5 rounded-md">
                    <Tabs>
                        <TabList>
                            <Tab>Product Essentials</Tab>
                            <Tab>Product Statistics</Tab>
                            <Tab>Product Reviews</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Essentials />
                            </TabPanel>
                            <TabPanel>
                                <Statistics />
                            </TabPanel>
                            <TabPanel>
                                <Reviews />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductDetail