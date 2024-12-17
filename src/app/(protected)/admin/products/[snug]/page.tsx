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
import Essentials from '../_components/Essentials';
import Statistics from '../_components/Statistics';
import Reviews from '../_components/Reviews';
import { useCallback, useEffect, useState } from 'react';
import requestClient from '@/lib/requestClient';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession, ProductResponseData } from '@/types';
import ExploreData from '../_components/ExploreData';

const ProductDetail = ({params}: any ) => {
    const router = useRouter();
    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [loading, setLoading] = useState<boolean>(false);

    const [products, setProducts] = useState<ProductResponseData>();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
        const response = await requestClient({ token: token }).get(
            `/admin/settings/products/2`
        );
        if (response.status === 200) {
            setProducts(response.data.data);
        }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if(!token) return;
        fetchProducts();
    },[fetchProducts, token]);

    console.log(products);

    return (
    <div className='p-8'>
        <HStack onClick={() => router.back()} cursor={"pointer"}>
            <ArrowLeftIcon className='w-5 h-5'/>
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
        </div> */}
    </div>
  )
}

export default ProductDetail