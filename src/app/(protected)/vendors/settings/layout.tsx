import { Divider, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'
import TabsNavigation from './_components/TabNavigation'
import { NextAuthUserSession } from '@/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function VendorSettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session: NextAuthUserSession = await getServerSession(authOptions);
    return (
        <div className="p-2 md:p-8">
            <h2 className="font-semibold text-2xl text-gray-600">Settings</h2>
            <p className="text-sm font-normal text-gray-500">
                Manage all your personal information and account settings.
            </p>
            <Divider my={[2, 5]} border="1px solid gray.200" />
            <div className="mt-2 md:mt-4">
                <Tabs>
                    <TabsNavigation businessStatus={session?.user?.businessStatus} />
                    <Divider my={[2, 5]} border="1px solid gray.200" />
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
