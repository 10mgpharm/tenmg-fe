import { Divider, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'
import TabsNavigation from './_components/TabNavigation';

export default function AdminSettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="p-8">
            <h2 className='text-2xl font-semibold text-gray-700 mb-2'>Settings</h2>
            <Tabs>
                <TabsNavigation />
                <TabPanels>
                    <TabPanel>
                        {children}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    )
}
