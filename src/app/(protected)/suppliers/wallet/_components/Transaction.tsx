"use client";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import TransactionTable from './TransactionTable';
import { Daum } from '@/types';

const Transaction = ({ data }: { data: Daum[] }) => {
    console.log(data)
    return (
        <div>
            <Tabs variant={"unstyled"}>
                <TabList className="overflow-x-scroll border-b-0">
                    <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                        <div className='flex items-center gap-3'>
                            <Text>All Transactions</Text>
                            <p className='bg-purple-50 text-purple-500 py-0.5 px-2 rounded-full text-sm'>{0}</p>
                        </div>
                    </Tab>
                    <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                        <div className='flex items-center gap-3'>
                            <Text>Pending Payout</Text>
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
                </TabPanels>
            </Tabs>
        </div>
    )
}

export default Transaction