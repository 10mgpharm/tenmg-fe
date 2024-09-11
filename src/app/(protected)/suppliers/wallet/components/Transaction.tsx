import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import TransactionTable from './TransactionTable';

const transactions = [
    {name: "Chidi Victor", email: "chidivictor@gmail.com", brand: "Global Pentazocine", quantity: "100", price: "#50,000", dateOfPurchase: "Jan 6, 2022", paymentMethod: "Cash", status: "Pending"},
    {name: "Chidi Victor", email: "chidivictor@gmail.com", brand: "Global Pentazocine", quantity: "100", price: "#50,000", dateOfPurchase: "Jan 6, 2022", paymentMethod: "Cash", status: "Completed"},
    {name: "Chidi Victor", email: "chidivictor@gmail.com", brand: "Global Pentazocine", quantity: "100", price: "#50,000", dateOfPurchase: "Jan 6, 2022", paymentMethod: "Cash", status: "Pending"},
    {name: "Chidi Victor", email: "chidivictor@gmail.com", brand: "Global Pentazocine", quantity: "100", price: "#50,000", dateOfPurchase: "Jan 6, 2022", paymentMethod: "Cash", status: "Completed"},
    {name: "Chidi Victor", email: "chidivictor@gmail.com", brand: "Global Pentazocine", quantity: "100", price: "#50,000", dateOfPurchase: "Jan 6, 2022", paymentMethod: "Cash", status: "Completed"},
    {name: "Chidi Victor", email: "chidivictor@gmail.com", brand: "Global Pentazocine", quantity: "100", price: "#50,000", dateOfPurchase: "Jan 6, 2022", paymentMethod: "Cash", status: "Completed"},
    {name: "Chidi Victor", email: "chidivictor@gmail.com", brand: "Synthetic opioids", quantity: "100", price: "#50,000", dateOfPurchase: "Jan 6, 2022", paymentMethod: "Cash", status: "Completed"},
]
const Transaction = () => {

    const completeTransaction = transactions.filter((item) => item.status === "Completed") 
    const pendingTransaction = transactions.filter((item) => item.status === "Pending");

  return (
    <div>
        <Tabs variant={"unstyled"}>
            <TabList>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>All Transactions</Text>
                        <p className='bg-purple-50 text-purple-500 py-0.5 px-2 rounded-full text-sm'>{transactions?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Completed</Text>
                        <p className='bg-green-50 text-green-500 py-0.5 px-2 rounded-full text-sm'>{completeTransaction?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Pending</Text>
                        <p className='bg-orange-50 text-orange-500 py-0.5 px-2 rounded-full text-sm'>{pendingTransaction?.length}</p>
                    </div>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel px={0}>
                    <TransactionTable data={transactions}/>
                </TabPanel>
                <TabPanel>
                    <TransactionTable data={completeTransaction}/>
                </TabPanel>
                <TabPanel>
                    <TransactionTable data={pendingTransaction}/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
  )
}

export default Transaction