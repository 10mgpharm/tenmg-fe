'use client';

import { Tabs, TabList, Tab, Text, useBreakpointValue, Box } from '@chakra-ui/react';
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
    const orientation = useBreakpointValue({ base: 'horizontal', md: 'vertical' }) as 'horizontal' | 'vertical';
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Box position="relative" width="100%">
            {isMobile && (
                <Box 
                    position="absolute" 
                    right="0" 
                    top="0" 
                    bottom="0" 
                    width="20px"
                    background="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)"
                    pointerEvents="none"
                    zIndex="1"
                />
            )}
            <Tabs 
            orientation={orientation}
            sx={{
                '& .chakra-tabs__tab-list': {
                    flexDirection: ['row', 'column'],
                    overflowX: ['auto', 'hidden'],
                    overflowY: ['hidden', 'auto'],
                    maxHeight: ['none', 'calc(100vh - 200px)'],
                    gap: [2, 3],
                    paddingBottom: [2, 0],
                    paddingRight: [4, 0],
                    whiteSpace: ['nowrap', 'normal'],
                    width: ['100%', 'auto'],
                    borderBottom: ['none', 'none'],
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    position: 'relative',
                },
                '& .chakra-tabs__tab': {
                    width: ['auto', '100%'],
                    justifyContent: ['center', 'flex-start'],
                    padding: ['8px 12px', '8px 0'],
                    minWidth: ['auto', '100%'],
                    borderRadius: ['8px', '0'],
                    transition: 'all 0.2s ease',
                    fontSize: ['xs', 'sm'],
                },
            }}
            className='no-scrollbar' index={activeIndex} variant="unstyled" minW={['auto', '200px']}>
                <TabList overflow="auto" className="no-scrollbar">
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            as={Link}
                            href={tab.href}
                            flexShrink={0}
                            color="gray.500"
                            fontWeight="500"
                            _selected={{
                                color: "primary.500",
                                bg: ['primary.50', 'transparent'],
                                fontWeight: "600",
                                outline: "none",
                            }}
                        >
                            <div className="flex items-center gap-2 md:gap-3">
                                <Text fontSize={{ base: "xs", md: "sm" }}>
                                    {tab.label}
                                </Text>
                            </div>
                        </Tab>
                    ))}
                </TabList>
            </Tabs>
        </Box>
    );
}
