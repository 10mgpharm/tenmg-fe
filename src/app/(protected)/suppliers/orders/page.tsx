import { Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Text } from '@chakra-ui/react'
import AllOrders from './components/AllOrders'
import SearchComponent from './components/SearchComponent'
const data = [
    {id: "#3066", customer: "Olivia Rhye", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Pending", total: "#2,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3065", customer: "Phoenix Baker", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Cancelled", total: "#6,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3067", customer: "Lana Steiner", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Completed", total: "#9,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3066", customer: "Olivia Rhye", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Pending", total: "#2,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3065", customer: "Phoenix Baker", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Cancelled", total: "#6,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3067", customer: "Lana Steiner", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Completed", total: "#9,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3066", customer: "Olivia Rhye", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Pending", total: "#2,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3065", customer: "Phoenix Baker", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Cancelled", total: "#6,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3067", customer: "Lana Steiner", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Completed", total: "#9,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3067", customer: "Lana Steiner", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Completed", total: "#9,000", address: "42 Deji Olamiju Street, Gbagada"},
]

const OrderUI = () => {

    const completedOrder = data.filter((item) => item.status === "Completed") 
    const pendingOrder = data.filter((item) => item.status === "Pending");
    const unpaidOrder = data.filter((item) => item.status === "Unpaid");
    const cancelledOrder = data.filter((item) => item.status === "Cancelled");

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
                        <p className='bg-purple-50 text-purple-500 py-1 px-1.5 rounded-full text-sm'>{data?.length}</p>
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
                    <AllOrders data={data} type="all" />
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