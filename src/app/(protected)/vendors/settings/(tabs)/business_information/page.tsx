'use client';

import React from 'react'
import BusinessInformation from '../../_components/BusinessInformation'
import { useSession } from 'next-auth/react';
import { User } from '@/types';

export default function BusinessInformationPage() {
    const session = useSession();
    const sessionData = session?.data?.user as User;

    return (
        <BusinessInformation user={sessionData} />
    )
}
