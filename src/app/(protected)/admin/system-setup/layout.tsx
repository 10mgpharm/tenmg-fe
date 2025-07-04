import { TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'
import SystemSetupTabNavigation from './_components/SystemSetupTabNavigation';

export default function AdminSystemSetupSettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="p-6 sm:p-8">
            <h2 className='text-xl sm:text-2xl font-semibold text-gray-700 mb-2'>System Setup</h2>
            <Tabs>
                <SystemSetupTabNavigation />
                <TabPanels>
                    <TabPanel px={0}>
                        {children}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    )
}
