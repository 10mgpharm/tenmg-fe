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
import { adminOrderData } from '@/data/mockdata'
import OrderPage from './_components/OrderPage';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession, OrderResponseData } from '@/types';
import requestClient from '@/lib/requestClient';
import { useDebouncedValue } from '@/utils/debounce';
import SearchInput from '../../vendors/_components/SearchInput';

const Orders = () => {

    const pendingOrder = adminOrderData.filter((order) => order.status === "Pending");
    const completedOrder = adminOrderData.filter((order) => order.status === "Completed");
    const cancelledOrder = adminOrderData.filter((order) => order.status === "Cancelled");
    const shippedOrders = adminOrderData.filter((order) => order.status === "Shipped");

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [status, setStatus] = useState<string>("");
    const [pageCount, setPageCount] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [orders, setOrders] = useState<OrderResponseData>();
    const [globalFilter, setGlobalFilter] = useState<string>("");

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
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [token, status, pageCount, debouncedSearch]);

    useEffect(() => {
        if(!token) return;
        fetchOrders();
    },[fetchOrders, token]);

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
                            {adminOrderData?.length}
                        </p>
                    </div>
                </Tab>
                <Tab onClick={() => setStatus("pending")} _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Pending</Text>
                        <p className='bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm'>
                            {pendingOrder?.length}
                        </p>
                    </div>
                </Tab>
                <Tab onClick={() => setStatus("canceled")} _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Cancelled</Text>
                        <p className='bg-red-50 text-red-500 py-0.5 px-1.5 rounded-full text-sm'>
                            {cancelledOrder?.length}
                        </p>
                    </div>
                </Tab>
                <Tab onClick={() => setStatus("shipped")} _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Shipped</Text>
                        <p className='bg-blue-50 text-blue-500 py-0.5 px-1.5 rounded-full text-sm'>
                            {shippedOrders?.length}
                        </p>
                    </div>
                </Tab>
                <Tab onClick={() => setStatus("completed")} _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Completed</Text>
                        <p className='bg-green-50 text-green-500 py-0.5 px-1.5 rounded-full text-sm'>
                            {completedOrder?.length}
                        </p>
                    </div>
                </Tab>
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
                    />
                </TabPanel>
                <TabPanel>
                    <OrderPage 
                    orders={orders} 
                    loading={loading} 
                    type="pending" 
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
                    type="cancelled" 
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
                    type="shipped"
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
                    type="completed" 
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

export default Orders