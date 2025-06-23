"use client";

import { useSession } from 'next-auth/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Text, Flex } from '@chakra-ui/react'
import { NextAuthUserSession, OrderResponseData } from '@/types'
import { useCallback, useEffect, useState } from 'react'
import { useDebouncedValue } from '@/utils/debounce'
import requestClient from '@/lib/requestClient'
import OrderPage from './_components/OrderPage';
import SearchInput from '../../vendors/_components/SearchInput'
import { CountProps } from '../../admin/orders/page';

const OrderUI = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [status, setStatus] = useState<string>("");
    const [counts, setCount] = useState<CountProps[]>([]);
    const [pageCount, setPageCount] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [orders, setOrders] = useState<OrderResponseData>();
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [allCount, setAllCount] = useState<number>(0)

    const debouncedSearch = useDebouncedValue(globalFilter, 500);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            let query = `/supplier/orders?status=${status}&page=${pageCount}`;
            if (debouncedSearch) {
                query += `&search=${debouncedSearch}`;
            }
            const response = await requestClient({ token: token }).get(query);
            if (response.status === 200) {
                setOrders(response.data.data);
                if (!status || status === "all") {
                    setAllCount(response.data?.data?.meta?.total)
                }
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [token, status, pageCount, debouncedSearch]);

    const fetchOrderCount = useCallback(async () => {
        setLoading(true);
        try {
            let query = `/supplier/orders/get-orders-status-count`;
            const response = await requestClient({ token: token }).get(query);
            if (response.status === 200) {
                setCount(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) return;
        fetchOrders();
        fetchOrderCount();
    }, [fetchOrders, fetchOrderCount, token]);

    return (
        <div className='p-4 md:p-8 min-h-[calc(100vh-155px)]'>
            <Text fontWeight={"semibold"} fontSize={{base: "xl", md: "2xl"}}>Orders</Text>
            <HStack justify={"space-between"} mb={4} mt={4}>
                <Flex gap={2} wrap={"wrap"} w="full">
                    <SearchInput
                        placeholder="Search with customer's name"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </Flex>
            </HStack>
            <Tabs variant={"unstyled"}>
                <TabList 
                className="flex flex-nowrap gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <Tab onClick={() => setStatus("")} _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }} className="whitespace-nowrap">
                        <div className='flex items-center gap-2 text-sm md:text-base'>
                            <Text>All Orders</Text>
                            <p className='bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm'>
                                {allCount}
                            </p>
                        </div>
                    </Tab>
                    {
                        counts?.filter((item) => item.status !== "DELIVERED")?.map((count: CountProps) => (
                            <Tab
                                onClick={() => setStatus(count.status)}
                                _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}
                                key={count.status}
                                className="whitespace-nowrap"
                            >
                                <div className='flex items-center gap-2'>
                                    <p className='text-sm md:text-base lowercase first-letter:uppercase'>{count?.status}</p>
                                    <p className='bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm'>
                                        {count.total}
                                    </p>
                                </div>
                            </Tab>
                        ))
                    }
                </TabList>
                <TabPanels className="no-scrollbar">
                    <TabPanel px={0}>
                        <OrderPage
                            orders={orders}
                            loading={loading}
                            type="all"
                            fetchOrders={fetchOrders}
                            pageCount={pageCount}
                            globalFilter={globalFilter}
                            setPageCount={setPageCount}
                        />
                    </TabPanel>
                    <TabPanel>
                        <OrderPage
                            orders={orders}
                            loading={loading}
                            type="PENDING"
                            fetchOrders={fetchOrders}
                            pageCount={pageCount}
                            globalFilter={globalFilter}
                            setPageCount={setPageCount}
                        />
                    </TabPanel>
                    <TabPanel>
                        <OrderPage
                            orders={orders}
                            loading={loading}
                            type="PROCESSING"
                            fetchOrders={fetchOrders}
                            pageCount={pageCount}
                            globalFilter={globalFilter}
                            setPageCount={setPageCount}
                        />
                    </TabPanel>
                    <TabPanel>
                        <OrderPage
                            orders={orders}
                            loading={loading}
                            type="SHIPPED"
                            fetchOrders={fetchOrders}
                            pageCount={pageCount}
                            globalFilter={globalFilter}
                            setPageCount={setPageCount}
                        />
                    </TabPanel>
                    <TabPanel>
                        <OrderPage
                            orders={orders}
                            loading={loading}
                            type="CANCELED"
                            fetchOrders={fetchOrders}
                            pageCount={pageCount}
                            globalFilter={globalFilter}
                            setPageCount={setPageCount}
                        />
                    </TabPanel>
                    <TabPanel>
                        <OrderPage
                            orders={orders}
                            loading={loading}
                            type="COMPLETED"
                            fetchOrders={fetchOrders}
                            pageCount={pageCount}
                            globalFilter={globalFilter}
                            setPageCount={setPageCount}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    )
}

export default OrderUI