'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { MedicationResponseData, NextAuthUserSession } from '@/types';
import { useSession } from 'next-auth/react';
import requestClient from '@/lib/requestClient';
import BrandSetup from '../../../../_components/BrandSetup';

export default function ProductBrandSetupPage() {
    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;

    const [brandLoading, setBrandLoading] = useState(false);
    const [brandData, setBrandData] = useState<MedicationResponseData>();

    const fetchingBrandTypes = useCallback(async () => {
        setBrandLoading(true)
        try {
            const response = await requestClient({ token: token }).get(
                `/admin/settings/brands`
            );
            if (response.status === 200) {
                setBrandData(response.data.data);
                setBrandLoading(false);
            }
        } catch (error) {
            console.error(error)
            setBrandLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) return;
        fetchingBrandTypes();
    }, [token, fetchingBrandTypes]);
    
    return (
        <BrandSetup
            data={brandData?.data}
            type="Brand"
            loading={brandLoading}
            refetchingTypes={fetchingBrandTypes}
        />
    )
}
