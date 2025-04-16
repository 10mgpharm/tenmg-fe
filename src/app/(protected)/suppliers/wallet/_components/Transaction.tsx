"use client";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import TransactionTable from './TransactionTable';
import { WalletData } from '@/types';


const Transaction = ({ data }: { data: WalletData[] }) => {

    // const completeTransaction = transactions.filter((item) => item.status === "Completed")
    // const pendingTransaction = transactions.filter((item) => item.status === "Pending");

    return (
        <div>
            <Tabs variant={"unstyled"}>
                <TabList>
                    <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                        <div className='flex items-center gap-3'>
                            <Text>All Transactions</Text>
                            <p className='bg-purple-50 text-purple-500 py-0.5 px-2 rounded-full text-sm'>{0}</p>
                        </div>
                    </Tab>
                    <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                        <div className='flex items-center gap-3'>
                            <Text>Completed</Text>
                            <p className='bg-green-50 text-green-500 py-0.5 px-2 rounded-full text-sm'>{0}</p>
                        </div>
                    </Tab>
                    <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                        <div className='flex items-center gap-3'>
                            <Text>Pending</Text>
                            <p className='bg-orange-50 text-orange-500 py-0.5 px-2 rounded-full text-sm'>{0}</p>
                        </div>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px={0}>
                        <TransactionTable data={data} />
                    </TabPanel>
                    <TabPanel>
                        <TransactionTable data={data} />
                    </TabPanel>
                    <TabPanel>
                        <TransactionTable data={data} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    )
}

export default Transaction