'use client';

import { Tabs, TabList, Tab, Text } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const tabs = [
    { label: 'General Settings', href: '/vendors/settings/general_settings' },
    { label: 'Business Information', href: '/vendors/settings/business_information' },
    { label: 'Notification', href: '/vendors/settings/notifications' },
    { label: 'License Upload', href: '/vendors/settings/license_upload' },
    { label: 'Team Members', href: '/vendors/settings/team_members' },
    { label: 'API Key and Web-hooks', href: '/vendors/settings/api_keys' },
];

export default function TabsNavigation() {
    const pathname = usePathname();
    const activeIndex = tabs.findIndex((tab) => pathname.startsWith(tab.href));

    return (
        <Tabs index={activeIndex} variant="unstyled">
            <TabList overflow={"auto"}>
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        as={Link}
                        href={tab.href}
                        _selected={{
                            color: "primary.500",
                            bg: "primary.50",
                            borderRadius: "10px",
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <Text fontSize={{ base: "xs", md: "sm" }}>
                                {tab.label}
                            </Text>
                        </div>
                    </Tab>
                ))}
            </TabList>
        </Tabs>
    );
}
