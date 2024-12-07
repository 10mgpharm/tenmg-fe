import { Flex, Stack, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import MedicationSetupTabNavigation from './_components/MedicationSetupTabNavigation';

export default function MedicationSetupLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Stack className="w-full">
            <Text fontSize={"1rem"} fontWeight={700} color={"gray.700"}>Medication Setup</Text>
            <Text color={"gray.500"} fontSize={"small"}>Perform system related medication setup here</Text>
            <Flex mt={5} gap={8}>
                <Tabs display={'flex'} className='w-full'>
                    <MedicationSetupTabNavigation />
                    <TabPanels className='flex-1 w-full'>
                        <TabPanel>
                            {children}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        </Stack>
  )
}
