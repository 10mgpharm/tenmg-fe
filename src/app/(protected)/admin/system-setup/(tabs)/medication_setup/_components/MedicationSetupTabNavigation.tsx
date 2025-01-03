'use client';

import { Tabs, TabList, Tab, Text } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const tabs = [
    { label: 'Brands', href: '/admin/system-setup/medication_setup/brands' },
    { label: 'Categories', href: '/admin/system-setup/medication_setup/categories' },
    { label: 'Medication Types', href: '/admin/system-setup/medication_setup/medication_types' },
    { label: 'Measurement Setup', href: '/admin/system-setup/medication_setup/measurement_setup' },
    { label: 'Presentation Setup', href: '/admin/system-setup/medication_setup/presentation_setup' },
];

export default function MedicationSetupTabNavigation() {
    const pathname = usePathname();
    const activeIndex = tabs.findIndex((tab) => pathname.startsWith(tab.href));

    return (
        <Tabs orientation='vertical' index={activeIndex} variant="unstyled" minW={'200px'}>
            <TabList overflow={"auto"} gap={3}>
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        as={Link}
                        href={tab.href}
                        justifyContent={'start'}
                        color="gray.500"
                        fontWeight={"500"}
                        _selected={{
                            color: "primary.500",
                            fontWeight: "600",
                            outline: "none"
                        }}
                        pl={0}
                    >
                        <div className="flex justify-start items-center gap-3">
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
