"use client";
import {
    Flex,
    HStack,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react"
import DiscountTable from "./_components/DiscountTable";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DiscountResponseData, NextAuthUserSession } from "@/types";
import { useDebouncedValue } from "@/utils/debounce";
import requestClient from "@/lib/requestClient";
import SearchInput from "../../vendors/_components/SearchInput";
import Link from "next/link";
interface CountProps {
    active: number;
    total: number;
    inactive: number;
    expired: number;
}

const Page = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>("");
    const [counts, setCount] = useState<CountProps>();
    const [discount, setDiscount] = useState<DiscountResponseData>();
    const [countLoading, setCountLoading] = useState<boolean>(false);
    const [pageCount, setPageCount] = useState<number>(1);
    const [globalFilter, setGlobalFilter] = useState<string>("");

    const debouncedSearch = useDebouncedValue(globalFilter, 500);

    const fetchDiscounts = useCallback(async () => {
        setLoading(true);
        try {
            let query = `/admin/discounts/search?status=${status}&page=${pageCount}`;
            if (debouncedSearch) {
                query += `&search=${debouncedSearch}`;
            }
            const response = await requestClient({ token: token }).get(query);
            if (response.status === 200) {
                setDiscount(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [token, status, pageCount, debouncedSearch]);

    const fetchDiscountCount = useCallback(async () => {
        setCountLoading(true);
        try {
            let query = `/admin/discounts/count`;
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
        if (!token) return;
        fetchDiscounts();
        fetchDiscountCount();
    }, [token, fetchDiscounts]);

    return (
        <div className='p-4 md:p-8'>
            <Text fontWeight={"semibold"} fontSize={{base: "xl", md: "2xl"}}>Discount</Text>
            <div className="flex flex-col gap-4 mb-4 md:mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                    <div className="w-full sm:max-w-[350px]">
                        <SearchInput
                            placeholder="Search with discount code"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                    <Link 
                        href={'/admin/discount-code/create'} 
                        className="border-primary-500 text-primary-600 border py-2 px-3 font-medium rounded-md bg-white text-center whitespace-nowrap w-full sm:w-auto"
                    >
                        Create Discount
                    </Link>
                </div>
            </div>
            <Tabs variant={"unstyled"}>
                <TabList className="flex flex-nowrap gap-2 overflow-x-auto pb-2 no-scrollbar mb-2">
                    <Tab onClick={() => setStatus("")} _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }} className="whitespace-nowrap">
                        <div className='flex items-center gap-2 text-sm md:text-base'>
                            <Text>All Discount</Text>
                            <p className='bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-xs md:text-sm'>
                                {counts?.total}
                            </p>
                        </div>
                    </Tab>
                    <Tab onClick={() => setStatus("ACTIVE")} _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }} className="whitespace-nowrap">
                        <div className='flex items-center gap-2 text-sm md:text-base'>
                            <Text>Active</Text>
                            <p className='bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-xs md:text-sm'>
                                {counts?.active}
                            </p>
                        </div>
                    </Tab>
                    <Tab onClick={() => setStatus("INACTIVE")} _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }} className="whitespace-nowrap">
                        <div className='flex items-center gap-2 text-sm md:text-base'>
                            <Text>Inactive</Text>
                            <p className='bg-red-50 text-red-500 py-0.5 px-1.5 rounded-full text-xs md:text-sm'>
                                {counts?.inactive}
                            </p>
                        </div>
                    </Tab>
                    <Tab onClick={() => setStatus("EXPIRED")} _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }} className="whitespace-nowrap">
                        <div className='flex items-center gap-2 text-sm md:text-base'>
                            <Text>Expired</Text>
                            <p className='bg-red-50 text-red-500 py-0.5 px-1.5 rounded-full text-xs md:text-sm'>
                                {counts?.expired}
                            </p>
                        </div>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px={0}>
                        <DiscountTable
                            type=""
                            loading={loading}
                            data={discount}
                            pageCount={pageCount}
                            fetchDiscounts={fetchDiscounts}
                            setPageCount={setPageCount}
                            fetchDiscountCount={fetchDiscountCount}
                        />
                    </TabPanel>
                    <TabPanel>
                        <DiscountTable
                            type="Active"
                            loading={loading}
                            data={discount}
                            pageCount={pageCount}
                            fetchDiscounts={fetchDiscounts}
                            setPageCount={setPageCount}
                            fetchDiscountCount={fetchDiscountCount}
                        />
                    </TabPanel>
                    <TabPanel>
                        <DiscountTable
                            type="Inactive"
                            loading={loading}
                            data={discount}
                            pageCount={pageCount}
                            fetchDiscounts={fetchDiscounts}
                            setPageCount={setPageCount}
                            fetchDiscountCount={fetchDiscountCount}
                        />
                    </TabPanel>
                    <TabPanel>
                        <DiscountTable
                            type="Expired"
                            loading={loading}
                            data={discount}
                            pageCount={pageCount}
                            fetchDiscounts={fetchDiscounts}
                            setPageCount={setPageCount}
                            fetchDiscountCount={fetchDiscountCount}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    )
}

export default Page