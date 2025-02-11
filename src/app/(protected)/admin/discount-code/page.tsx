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
    Button,
    useDisclosure, 
} from "@chakra-ui/react"
import { discountData } from "@/data/mockdata"
import DiscountTable from "./_components/DiscountTable";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DiscountResponseData, NextAuthUserSession } from "@/types";
import { useDebouncedValue } from "@/utils/debounce";
import requestClient from "@/lib/requestClient";
import SearchInput from "../../vendors/_components/SearchInput";
import Link from "next/link";
import ModalWrapper from "../../suppliers/_components/ModalWrapper";

const Page = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>("ACTIVE");
    const [discount, setDiscount] = useState<DiscountResponseData>();
    const [pageCount, setPageCount] = useState<number>(1);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [allCount, setAllCount] = useState<number>(0)

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
                // if(!status || status === "all"){
                //     setAllCount(response.data?.data?.meta?.total)
                // }
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [token, status, pageCount, debouncedSearch]);

    useEffect(() => {
        if(!token) return;
        fetchDiscounts();
    },[token, fetchDiscounts]);

    console.log(discount)

    return (
    <div className='p-8'>
        <HStack justify={"space-between"} mb={4}>
            <Text fontWeight={"semibold"} fontSize={"2xl"}>Discount</Text>
            <Flex gap={2}>
                <SearchInput
                placeholder="Search with discount code"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                />
                <Link href={'/admin/discount-code/create'} className="border-primary-500 text-primary-600 border p-3 font-medium rounded-md bg-white">
                    Create discount
                </Link>
            </Flex>
        </HStack>
        <Tabs variant={"unstyled"}>
            <TabList>
                <Tab onClick={() => setStatus("")} _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>All Discount</Text>
                        <p className='bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm'>
                            {9}
                        </p>
                    </div>
                </Tab>
                <Tab onClick={() => setStatus("ACTIVE")} _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Active</Text>
                        <p className='bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm'>
                            {6}
                        </p>
                    </div>
                </Tab>
                <Tab onClick={() => setStatus("INACTIVE")} _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Inactive</Text>
                        <p className='bg-red-50 text-red-500 py-0.5 px-1.5 rounded-full text-sm'>
                            {1}
                        </p>
                    </div>
                </Tab>
                <Tab onClick={() => setStatus("EXPIRED")} _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Expired</Text>
                        <p className='bg-red-50 text-red-500 py-0.5 px-1.5 rounded-full text-sm'>
                            {0}
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
                    />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
  )
}

export default Page