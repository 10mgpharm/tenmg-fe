import { TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'
import SystemSetupTabNavigation from './_components/SystemSetupTabNavigation';

export default function AdminSystemSetupSettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="p-8">
            <h2 className='text-2xl font-semibold text-gray-700 mb-2'>System Setup</h2>
            <Tabs>
                <SystemSetupTabNavigation />
                <TabPanels>
                    <TabPanel>
                        {children}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    )
}
