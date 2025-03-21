"use client";

import { Checkbox } from '@chakra-ui/react'
import EmptyCard from '../../suppliers/_components/EmptyCard'
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import requestClient from '@/lib/requestClient';

const Insight = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchOverview = useCallback(async () => {
        setLoading(true);
        try {
            let query = `/admin/insights`;
            
            const response = await requestClient({ token: token }).get(query);
            if (response.status === 200) {
                setData(response.data.data);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if(!token) return;
        fetchOverview();
    }, [token, fetchOverview]);

    console.log(data)

  return (
    <div className='p-8 min-h-[calc(100vh-108px)]'>
        <h2 className='text-2xl font-semibold text-gray-700'>Insight</h2>
        <div className="flex items-center justify-between mt-4">
            <div className="">
            </div>
            <div className="flex items-center gap-2">
                <Checkbox>
                    <span className='text-primary-500 underline'>Auto Refresh</span>
                </Checkbox>
            </div>
        </div>
        <div className="flex gap-5 mt-6">
            <div className="flex-1 bg-white p-5 rounded-md">
                <h3 className="text-gray-600 font-semibold text-lg">Total Product Sold</h3>
                <EmptyCard/>
            </div>
            <div className="flex-1 bg-white p-5 rounded-md">
                <h3 className="text-gray-600 font-semibold text-lg">Total Revenue</h3>
                <EmptyCard/>
            </div>
            <div className="flex-1 bg-white p-5 rounded-md">
                <h3 className="text-gray-600 font-semibold text-lg">Best Selling Products</h3>
                <EmptyCard/>
            </div>
        </div>
    </div>
  )
}

export default Insight