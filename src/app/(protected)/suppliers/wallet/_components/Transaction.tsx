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
                            <p className='bg-purple-50 text-purple-500 py-0.5 px-2 rounded-full text-sm'>
                                {data?.total}
                            </p>
                        </div>
                    </Tab>
                    <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                        <div className='flex items-center gap-3'>
                            <Text>Pending Payout</Text>
                            <p className='bg-orange-50 text-orange-500 py-0.5 px-2 rounded-full text-sm'>
                                {payoutData?.total}
                            </p>
                        </div>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px={0}>
                        <TransactionTable 
                        data={data?.data} 
                        hasPagination={hasPagination} 
                        setPageCount={setPageCount}
                        metaData={{
                            links: data?.links,
                            total: data?.total,
                            lastPage: data?.lastPage,
                            perPage: data?.perPage,
                            from: data?.from,
                            to: data?.to,
                            prevPageUrl: data?.prevPageUrl,
                            nextPageUrl: data?.nextPageUrl,
                            currentPage: data?.currentPage,
                            firstPageUrl: data?.firstPageUrl,
                            lastPageUrl: data?.lastPageUrl,
                          }}
                        />
                    </TabPanel>
                    <TabPanel px={0}>
                        <PayoutTable 
                        data={payoutData?.data} 
                        hasPagination={hasPagination}
                        setPageCount={setPageCount}
                        metaData={{
                            links: data?.links,
                            total: data?.total,
                            lastPage: data?.lastPage,
                            perPage: data?.perPage,
                            from: data?.from,
                            to: data?.to,
                            prevPageUrl: data?.prevPageUrl,
                            nextPageUrl: data?.nextPageUrl,
                            currentPage: data?.currentPage,
                            firstPageUrl: data?.firstPageUrl,
                            lastPageUrl: data?.lastPageUrl,
                          }}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    )
}

export default Transaction