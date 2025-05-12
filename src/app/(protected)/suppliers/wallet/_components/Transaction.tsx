"use client";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import TransactionTable from './TransactionTable';
import { PayoutDataProps, SupplierTransactionDataProps } from '@/types';
import PayoutTable from './PayoutTable';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    data: SupplierTransactionDataProps;
    payoutData?: PayoutDataProps;
    hasPagination: boolean;
    setPageCount?: Dispatch<SetStateAction<number>>;
}
const Transaction = ({ data, payoutData, hasPagination, setPageCount }: Props ) => {
    return (
        <div>
            <Tabs variant={"unstyled"}>
                <TabList 
                borderBottom={"none"}
                className="">
                    <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                        <div className='flex items-center gap-3'>
                            <Text>All Transactions</Text>
                        </div>
                    </Tab>
                    <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                        <div className='flex items-center gap-3'>
                            <Text>Pending Payout</Text>
                        </div>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px={0}>
                        <TransactionTable 
                        data={data?.data} 
                        hasPagination={hasPagination} 
                        setPageCount={setPageCount}
                        />
                    </TabPanel>
                    <TabPanel px={0}>
                        <PayoutTable 
                        data={payoutData?.pendingPayouts?.data} 
                        hasPagination={hasPagination}
                        setPageCount={setPageCount}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    )
}

export default Transaction