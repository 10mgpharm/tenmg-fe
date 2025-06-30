import { Flex, Stack, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React from 'react'
import MedicationSetupTabNavigation from './_components/MedicationSetupTabNavigation';

export default function MedicationSetupLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Stack className="w-full">
            <Text fontSize={{base: "md", md: "lg", lg: "1rem"}} fontWeight={700} color={"gray.700"}>Medication Setup</Text>
            <Text color={"gray.500"} fontSize={{base: "xs", md: "small"}}>Perform system related medication setup here</Text>
            <Flex mt={{base: 3, md: 4, lg: 5}} gap={{base: 3, md: 5, lg: 8}} direction={{base: "column", md: "row"}} className="w-full">
                <Tabs display={'flex'} className='w-full' flexDir={{base: "column", md: "row"}}>
                    <div className="w-full md:max-w-[200px] mb-2 md:mb-0">
                        <MedicationSetupTabNavigation />
                    </div>
                    <TabPanels className='flex-1 w-full'>
                        <TabPanel px={{base: 0, md: 4}} py={{base: 3, md: 4}}>
                            {children}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        </Stack>
    )
}
