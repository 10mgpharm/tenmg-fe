'use client';

import { Box, Skeleton, SkeletonText } from '@chakra-ui/react';

export function BusinessRuleSkeleton() {
    return (
        <div className="flex flex-col space-y-6 w-full h-screen">
            {/* Header & Save Button Skeleton */}
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton height="24px" width="200px" />
                    <Skeleton height="18px" width="300px" />
                </div>
                <Skeleton height="36px" width="120px" />
            </div>

            {/* Base Score Input Skeleton */}
            <div className="shadow-sm bg-white p-4 rounded-md space-y-4 mt-2 flex flex-row flex-wrap md:flex-nowrap items-center justify-between gap-5">
                <Box width="400px">
                    <Skeleton height="20px" mb="2" />
                    <Skeleton height="32px" />
                </Box>
                <Skeleton height="20px" width="100px" />
            </div>

            {/* Table Header Skeleton */}
            <div className="overflow-x-auto w-full flex-1">
                <div className="flex space-x-4 mb-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} height="24px" className='w-full' />
                    ))}
                </div>

                {/* Table Rows Skeleton */}
                <div className="space-y-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="flex space-x-4">
                            {Array.from({ length: 7 }).map((_, j) => (
                                <Skeleton key={j} height="32px" className='w-full' />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
