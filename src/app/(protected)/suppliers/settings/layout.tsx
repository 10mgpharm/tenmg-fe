import React from 'react'
import { Tabs, TabPanels, TabPanel } from '@chakra-ui/react'
import TabsNavigation from './_components/TabNavigation';

export default async function SupplierSettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="p-8">
            <h2 className="font-semibold text-2xl text-gray-600">Settings</h2>
            <div className="mt-4">
                <Tabs variant={"unstyled"}>
                    <TabsNavigation />
                    <TabPanels>
                        <TabPanel px={0}>
                            {children}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    )
}
