import { 
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel, 
    HStack, 
    Text, 
    Button, 
    Flex
} from '@chakra-ui/react'
import SearchComponent from "../../suppliers/orders/components/SearchComponent"
import { adminOrderData } from '@/data/mockdata'
import OrderPage from './components/OrderPage';

const Orders = () => {

    const pendingOrder = adminOrderData.filter((order) => order.status === "Pending");
    const completedOrder = adminOrderData.filter((order) => order.status === "Completed");
    const cancelledOrder = adminOrderData.filter((order) => order.status === "Cancelled");
    const shippedOrders = adminOrderData.filter((order) => order.status === "Shipped");
  return (
    <div className='p-8'>
        <HStack justify={"space-between"} mb={4}>
            <Text fontWeight={"semibold"} fontSize={"2xl"}>Orders</Text>
            <Flex gap={2}>
                <SearchComponent placeholder='Search with customer&apos;s name'/>
                <Button h={""} px={4} variant={"outline"} className="border-primary-500 text-primary-600 bg-white">View shopping list</Button>
            </Flex>
        </HStack>
        <Tabs variant={"unstyled"}>
            <TabList>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>All Orders</Text>
                        <p className='bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm'>{adminOrderData?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Pending</Text>
                        <p className='bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm'>{pendingOrder?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Cancelled</Text>
                        <p className='bg-red-50 text-red-500 py-0.5 px-1.5 rounded-full text-sm'>{cancelledOrder?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Shipped</Text>
                        <p className='bg-blue-50 text-blue-500 py-0.5 px-1.5 rounded-full text-sm'>{shippedOrders?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Completed</Text>
                        <p className='bg-green-50 text-green-500 py-0.5 px-1.5 rounded-full text-sm'>{completedOrder?.length}</p>
                    </div>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel px={0}>
                    <OrderPage data={adminOrderData} type="all" />
                </TabPanel>
                <TabPanel>
                    <OrderPage data={pendingOrder} type="pending" />
                </TabPanel>
                <TabPanel>
                    <OrderPage data={cancelledOrder} type="cancelled" />
                </TabPanel>
                <TabPanel>
                    <OrderPage data={shippedOrders} type="shipped"/>
                </TabPanel>
                <TabPanel>
                    <OrderPage data={completedOrder} type="completed" />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
  )
}

export default Orders