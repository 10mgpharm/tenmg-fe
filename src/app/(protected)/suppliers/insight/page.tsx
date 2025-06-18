"use client";

import { Flex, Spinner } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import EmptyCard from '../_components/EmptyCard'
import requestClient from '@/lib/requestClient';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';

const Insight = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filterQuery, setFilterQuery] = useState("today");

    const fetchOverview = useCallback(async () => {
      setLoading(true);
      try {
        let query = `/supplier/insights?dateFilter=${filterQuery}`;
        const response = await requestClient({ token: token }).get(query);
        if (response.status === 200) {
          setData(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }, [token, filterQuery]);

    useEffect(() => {
        if(!token) return;
        fetchOverview();
    }, [token, fetchOverview]);

    const mockdata = [
        {
          name: '12:00am',
          uv: Number(data?.totalProductsSold?.midnightToSixAm),
        },
        {
          name: '6:00am',
          uv: Number(data?.totalProductsSold?.sixAmToTwelvePm),
        },
        {
          name: '12:00pm',
          uv: Number(data?.totalProductsSold?.twelvePmToSixPm),
        },
        {
          name: '6:00pm',
          uv: Number(data?.totalProductsSold?.sixPmToMidnight),
        },
    ];
    
    const formatYAxisTick = (tickItem: any) => {
        if (tickItem >= 1000) {
            return `${(tickItem).toLocaleString()}`;
        }
        return tickItem;
    };


  return (
    <div className='p-8 min-h-[calc(100vh-108px)]'>
        <h2 className='text-2xl font-semibold text-gray-700'>Insight</h2>
        <div className="flex items-center justify-between mt-4">
            <div className="">
              <select onChange={(e) => setFilterQuery(e.target.value)} className='p-2 shadow-sm rounded-sm focus:outline-none'>
                <option value="today">1 day</option>
                <option value="one_week">1 Week</option>
                <option value="one_month">1 Month</option>
                <option value="six_months">6 Month</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span 
              onClick={() => fetchOverview()} 
              className='text-primary-500 underline cursor-pointer text-sm font-medium'>
                Refresh Record
              </span>
            </div>
        </div>
        {
          loading ?
          (
            <Flex justify="center" align="center" height="200px">
              <Spinner size="xl" />
            </Flex>
          )
          : (
            <div>
              <div className="sm:flex gap-5 mt-6">
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
                              left: -30,
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
                  <h3 className="text-gray-600 font-semibold text-lg mb-5">Total Revenue</h3>
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
                              left: -30,
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
              <div className="mt-6 flex-1">
                <div className="bg-white p-5 rounded-md">
                  <h3 className="text-gray-600 font-semibold text-lg mb-5">Best Selling Products</h3>
                  {
                    (data?.bestSellingProducts?.length > 0) ?
                      <div style={{ width: '100%', height: 320 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                width={500}
                                height={300}
                                data={data?.bestSellingProducts}
                                margin={{
                                top: 10,
                                right: 10,
                                left: -10,
                                bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeOpacity={0.5} strokeDasharray="12 10" color='#F2F4F7' vertical={false}/>
                                <XAxis tickLine={false} axisLine={false} fontSize={"14px"} dataKey="name" />
                                <YAxis tickLine={false} axisLine={false} fontSize={"14px"} tickFormatter={formatYAxisTick}/>
                                <Tooltip />
                                <Area type="monotone" dataKey="totalSold" stroke="#FDB022" strokeWidth={"2px"} fill="#FFF7ED" />
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
    </div>
  )
}

export default Insight