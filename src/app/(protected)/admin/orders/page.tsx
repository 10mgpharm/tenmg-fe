"use client";
import { 
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel, 
    HStack, 
    Text, 
    Button, 
    Flex,
} from '@chakra-ui/react'
import OrderPage from './_components/OrderPage';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession, OrderResponseData } from '@/types';
import requestClient from '@/lib/requestClient';
import { useDebouncedValue } from '@/utils/debounce';
import SearchInput from '../../vendors/_components/SearchInput';
export interface CountProps {
    status: string;
    total: number;
}

const Orders = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [status, setStatus] = useState<string>("");
    const [counts, setCount] = useState<CountProps[]>([]);
    const [pageCount, setPageCount] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [countLoading, setCountLoading] = useState<boolean>(false);
    const [orders, setOrders] = useState<OrderResponseData>();
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [allCount, setAllCount] = useState<number>(0)

    const debouncedSearch = useDebouncedValue(globalFilter, 500);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            let query = `/admin/orders/get-orders?status=${status}&page=${pageCount}`;
            if (debouncedSearch) {
                query += `&search=${debouncedSearch}`;
            }
            const response = await requestClient({ token: token }).get(query);
            if (response.status === 200) {
                setOrders(response.data.data);
                if(!status || status === "all"){
                    setAllCount(response.data?.data?.meta?.total)
                }
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [token, status, pageCount, debouncedSearch]);

    const fetchOrderCount = useCallback(async () => {
        setCountLoading(true);
        try {
            let query = `/admin/orders/get-orders-status-count`;
            const response = await requestClient({ token: token }).get(query);
            if (response.status === 200) {
                setCount(response.data.data);
            }
            setCountLoading(false);
        } catch (error) {
            console.error(error);
            setCountLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if(!token) return;
        fetchOrders();
        fetchOrderCount();
    },[fetchOrders, fetchOrderCount, token]);

    return (
    <div className='p-8'>
        <HStack justify={"space-between"} mb={4}>
            <Text fontWeight={"semibold"} fontSize={"2xl"}>Orders</Text>
            <Flex gap={2}>
                <SearchInput
                placeholder="Search with customer&apos;s name"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                />
                <Button h={""} px={4} variant={"outline"} className="border-primary-500 text-primary-600 bg-white">
                    View shopping list
                </Button>
            </Flex>
        </HStack>
        <Tabs variant={"unstyled"}>
            <TabList>
                <Tab onClick={() => setStatus("")} _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>All Orders</Text>
                        <p className='bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm'>
                        {allCount}
                        </p>
                    </div>
                </Tab>
                {
                    counts?.filter((item) => item.status !== "DELIVERED")?.map((count:CountProps) => (
                        <Tab 
                        onClick={() => setStatus(count.status)} 
                        _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}
                        key={count.status}
                        >
                            <div className='flex items-center gap-3'>
                                <p className='text-base lowercase first-letter:uppercase'>{count?.status}</p>
                                <p className='bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm'>
                                    {count.total}
                                </p>
                            </div>
                        </Tab>
                    ))
                }
            </TabList>
            <TabPanels>
                <TabPanel px={0}>
                    <OrderPage 
                    orders={orders} 
                    loading={loading} 
                    type="all"
                    fetchOrders={fetchOrders}
                    pageCount={pageCount}
                    globalFilter={globalFilter}
                    setPageCount={setPageCount}
                    fetchOrderCount={fetchOrderCount}
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
                    fetchOrderCount={fetchOrderCount}
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
                    fetchOrderCount={fetchOrderCount}
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
                    fetchOrderCount={fetchOrderCount}
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
                    fetchOrderCount={fetchOrderCount}
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
                    fetchOrderCount={fetchOrderCount}
                    />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
  )
}

export default Orders