"use client";
import { 
    Flex, 
    HStack, 
    Text,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from "@chakra-ui/react"
import totalPattern from '@public/assets/images/bgPattern.svg';
import orderPattern from '@public/assets/images/orderPattern.svg';
import productPattern from '@public/assets/images/productpatterns.svg';
import OverviewCard from "./components/OverviewCard";
import { useState } from "react";
import { classNames } from "@/utils";
import Link from "next/link";
import { transactionData } from "@/data/mockdata";
import WalletTable from "./components/WalletTable";

const timeLines = [
    {id: 1, timeline: "12 months"},
    {id: 2, timeline: "30 days"},
    {id: 3, timeline: "7 days"},
    {id: 4, timeline: "24 hours"},
]

const Page = () => {
    const [selected, setSelected] = useState(1);

    const awaiting = transactionData.filter((item) => item.type === "Awaiting")
    const completed = transactionData.filter((item) => item.type === "Completed")
    const history = transactionData.filter((item) => item.type === "History")

    return (
    <div className="p-8">
        <HStack justify={"space-between"}>
            <Text fontSize={"1.3rem"} fontWeight={700} color={"gray.900"}>Wallet</Text>
            <Flex className="border rounded-md">
                {
                    timeLines?.map((item) => (
                        <Text 
                        onClick={() => setSelected(item.id)}
                        key={item.id} 
                        p={3}
                        cursor={"pointer"}
                        className={classNames(selected === item.id ? "bg-gray-100": "white")}>
                            {item.timeline}
                        </Text>
                    ))
                }
            </Flex>
        </HStack>
        <div className="grid grid-cols-3 gap-4 mt-5">
            <OverviewCard 
            title="Total Commission Earned"
            value="₦5,600"
            fromColor="from-[#53389E]"
            toColor="to-[#7F56D9]"
            image={totalPattern}
            />
            <OverviewCard 
            title="Total Payouts to Suppliers"
            value="#2,300"
            fromColor="from-[#DC6803]"
            toColor="to-[#DC6803]"
            image={orderPattern}
            />
            <OverviewCard 
            title="Wallet Balance"
            value="50,000"
            fromColor="from-[#E31B54]"
            toColor="to-[#E31B54]"
            image={productPattern}
            />
        </div>
        <HStack justify={"space-between"} mt={8}>
            <Text fontSize={"xl"} fontWeight={"medium"} color={"gray.800"}>Transaction</Text>
            <Link className="py-2 px-4 rounded-md border text-sm font-medium text-gray-600 border-gray-300" href={'#'}>View all</Link>
        </HStack>
        <Tabs variant={"unstyled"}>
            <TabList>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Awaiting Payout</Text>
                        <p className='bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm'>{awaiting?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Completed Payout</Text>
                        <p className='bg-green-50 text-green-500 py-0.5 px-1.5 rounded-full text-sm'>{completed?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Transaction History</Text>
                        <p className='bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm'>{history?.length}</p>
                    </div>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel px={0}>
                    <WalletTable data={awaiting} type="awaiting" />
                </TabPanel>
                <TabPanel>
                    <WalletTable data={completed} type="completed" />
                </TabPanel>
                <TabPanel>
                    <WalletTable data={history} type="history" />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
  )
}

export default Page