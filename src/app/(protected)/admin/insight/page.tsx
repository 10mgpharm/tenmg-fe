"use client";

import { Checkbox } from '@chakra-ui/react'
import EmptyCard from '../../suppliers/_components/EmptyCard'
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import requestClient from '@/lib/requestClient';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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

    const mockdata = [
        {
          name: '12:00am',
          uv: 2760,
        },
        {
          name: '6:00am',
          uv: 3400,
        },
        {
          name: '12:00pm',
          uv: 9000,
        },
        {
          name: '6:00pm',
          uv: 1002,
      
        },
    ];
    const mockdata2 = [
        {
          name: 'Mon',
          uv: 2760,
        },
        {
          name: 'Tue',
          uv: 3400,
        },
        {
          name: 'Wed',
          uv: 9000,
        },
        {
          name: 'Thur',
          uv: 1002,
      
        },
        {
          name: 'Fri',
          uv: 102,
      
        },
        {
          name: 'Sat',
          uv: 197,
      
        },
        {
          name: 'Sun',
          uv: 342,
      
        },
      ];

    const formatYAxisTick = (tickItem: any) => {
        if (tickItem >= 1000) {
          return `${(tickItem).toLocaleString()}`;
        }
        return tickItem;
    };

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
                <h3 className="text-gray-600 font-semibold text-lg mb-5">Total Product Sold</h3>
                {
                    (data?.totalProductsSold?.midnightToSixAm && data?.totalProductsSold?.sixAmToTwelvePm) ?
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                        <AreaChart
                            width={500}
                            height={300}
                            data={mockdata}
                            margin={{
                            top: 10,
                            right: 10,
                            left: -5,
                            bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeOpacity={0.5} strokeDasharray="12 10" color='#F2F4F7' vertical={false}/>
                            <XAxis tickLine={false} axisLine={false} fontSize={"14px"} dataKey="name" />
                            <YAxis tickLine={false} axisLine={false} fontSize={"14px"} tickFormatter={formatYAxisTick}/>
                            <Tooltip />
                            <Area type="monotone" dataKey="uv" stroke="#FDB022" strokeWidth={"2px"} fill="#FFF7ED" />
                        </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    : <EmptyCard/> 
                }
            </div>
            <div className="flex-1 bg-white p-5 rounded-md">
                <h3 className="text-gray-600 font-semibold text-lg">Total Revenue</h3>
                {
                    (data?.totalRevenue?.midnightToSixAm && data?.totalRevenue?.sixAmToTwelvePm) ?
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                        <AreaChart
                            width={500}
                            height={300}
                            data={mockdata}
                            margin={{
                            top: 10,
                            right: 10,
                            left: -5,
                            bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeOpacity={0.5} strokeDasharray="12 10" color='#F2F4F7' vertical={false}/>
                            <XAxis tickLine={false} axisLine={false} fontSize={"14px"} dataKey="name" />
                            <YAxis tickLine={false} axisLine={false} fontSize={"14px"} tickFormatter={formatYAxisTick}/>
                            <Tooltip />
                            <Area type="monotone" dataKey="uv" stroke="#FDB022" strokeWidth={"2px"} fill="#FFF7ED" />
                        </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    : <EmptyCard/> 
                }
            </div>
            <div className="flex-1 bg-white p-5 rounded-md">
                <h3 className="text-gray-600 font-semibold text-lg">Best Selling Products</h3>
                {
                    (data?.bestSellingProducts?.length > 0) ?
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                        <AreaChart
                            width={500}
                            height={300}
                            data={mockdata2}
                            margin={{
                            top: 10,
                            right: 10,
                            left: -5,
                            bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeOpacity={0.5} strokeDasharray="12 10" color='#F2F4F7' vertical={false}/>
                            <XAxis tickLine={false} axisLine={false} fontSize={"14px"} dataKey="name" />
                            <YAxis tickLine={false} axisLine={false} fontSize={"14px"} tickFormatter={formatYAxisTick}/>
                            <Tooltip />
                            <Area type="monotone" dataKey="uv" stroke="#FDB022" strokeWidth={"2px"} fill="#FFF7ED" />
                        </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    : <EmptyCard/> 
                }
            </div>
        </div>
    </div>
  )
}

export default Insight