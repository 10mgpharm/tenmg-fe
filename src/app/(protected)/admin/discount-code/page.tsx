"use client";
import { 
    Button, 
    Flex, 
    HStack, 
    Text,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel, 
} from "@chakra-ui/react"
import SearchComponent from "../../suppliers/orders/_components/SearchComponent"
import { discountData } from "@/data/mockdata"
import DiscountTable from "./_components/DiscountTable";

const Page = () => {

    const activeDiscount = discountData?.filter((discount) => discount.status === "Active");
    const expiredDiscount = discountData?.filter((discount) => discount.status === "Expired");

    return (
    <div className='p-8'>
        <HStack justify={"space-between"} mb={4}>
            <Text fontWeight={"semibold"} fontSize={"2xl"}>Discount</Text>
            <Flex gap={2}>
                <SearchComponent placeholder='Search for a discount'/>
                <Button h={""} px={4} variant={"outline"} className="border-primary-500 text-primary-600 bg-white">Create discount</Button>
            </Flex>
        </HStack>
        <Tabs variant={"unstyled"}>
            <TabList>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>All Discount</Text>
                        <p className='bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm'>{discountData?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Active</Text>
                        <p className='bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm'>{activeDiscount?.length}</p>
                    </div>
                </Tab>
                <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                    <div className='flex items-center gap-3'>
                        <Text>Expired</Text>
                        <p className='bg-red-50 text-red-500 py-0.5 px-1.5 rounded-full text-sm'>{expiredDiscount?.length}</p>
                    </div>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel px={0}>
                    <DiscountTable data={discountData}/>
                </TabPanel>
                <TabPanel>
                    <DiscountTable data={activeDiscount}/>
                </TabPanel>
                <TabPanel>
                    <DiscountTable data={expiredDiscount}/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
  )
}

export default Page