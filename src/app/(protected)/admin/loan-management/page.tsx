import { 
    HStack, 
    Stack, 
    Tab, 
    TabList,
    TabPanel, 
    TabPanels, 
    Tabs, 
    Text 
} from '@chakra-ui/react';
import LoanManagement from './_components/LoanManagement';
import LoanApplication from './_components/LoanApplication';
import LoanOffer from './_components/LoanOffer';
import LoanRepayment from './_components/LoanRepayment';

const Page = () => {
  return (
    <div className='p-8'>
        <HStack justify={"space-between"}>
            <Text fontSize={"1.3rem"} fontWeight={700} color={"gray.900"}>Loan Management</Text>
        </HStack>
        <Stack>
            <Tabs>
                <TabList>
                    <Tab>Loan Management</Tab>
                    <Tab>Loan Application</Tab>
                    <Tab>Loan Offers</Tab>
                    <Tab>Loan Repayments</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px={0}>
                        <LoanManagement />
                    </TabPanel>
                    <TabPanel>
                        <LoanApplication />
                    </TabPanel>
                    <TabPanel>
                        <LoanOffer />
                    </TabPanel>
                    <TabPanel>
                        <LoanRepayment />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Stack>
    </div>
  )
}

export default Page