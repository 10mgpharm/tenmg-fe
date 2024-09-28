import { Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Text } from '@chakra-ui/react'
import AllOrders from './components/AllOrders'
import SearchComponent from './components/SearchComponent'
import { orderData } from '@/data/mockdata'

const OrderUI = () => {

    const completedOrder = orderData.filter((item) => item.status === "Completed") 
    const pendingOrder = orderData.filter((item) => item.status === "Pending");
    const unpaidOrder = orderData.filter((item) => item.status === "Unpaid");
    const cancelledOrder = orderData.filter((item) => item.status === "Cancelled");

  return (
    <div className='p-8 min-h-[calc(100vh-155px)]'>
        <HStack justify={"space-between"} mb={4}>
            <Text fontWeight={"semibold"} fontSize={"2xl"}>Orders</Text>
            <SearchComponent placeholder='Search for a customer'/>
        </HStack>
        <Tabs variant={"unstyled"}>
            <TabList>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>All Orders</Text>
                        <p className='bg-purple-50 text-purple-500 py-1 px-1.5 rounded-full text-sm'>{orderData?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Completed</Text>
                        <p className='bg-green-50 text-green-500 py-1 px-1.5 rounded-full text-sm'>{completedOrder?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Pending</Text>
                        <p className='bg-orange-50 text-orange-500 py-1 px-1.5 rounded-full text-sm'>{pendingOrder?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Unpaid</Text>
                        <p className='bg-blue-50 text-blue-500 py-1 px-1.5 rounded-full text-sm'>{unpaidOrder?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Cancelled</Text>
                        <p className='bg-red-50 text-red-500 py-1 px-1.5 rounded-full text-sm'>{cancelledOrder?.length}</p>
                    </div>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel px={0}>
                    <AllOrders data={orderData} type="all" />
                </TabPanel>
                <TabPanel>
                    <AllOrders data={completedOrder} type="completed" />
                </TabPanel>
                <TabPanel>
                    <AllOrders data={pendingOrder} type="pending" />
                </TabPanel>
                <TabPanel>
                    <AllOrders data={unpaidOrder} type="unpaided"/>
                </TabPanel>
                <TabPanel>
                    <AllOrders data={cancelledOrder} type="cancelled" />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
  )
}

export default OrderUI