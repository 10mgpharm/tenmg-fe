'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { MedicationResponseData, NextAuthUserSession } from '@/types';
import { useSession } from 'next-auth/react';
import requestClient from '@/lib/requestClient';
import BrandSetup from '../../../../_components/BrandSetup';
import { useDebouncedValue } from '@/utils/debounce';

export default function ProductBrandSetupPage() {
    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;

    const [pageCount, setPageCount] = useState<number>(1);
    const [brandLoading, setBrandLoading] = useState(false);
    const [searchWord, setSearchWord] = useState<string>("");
    const [brandData, setBrandData] = useState<MedicationResponseData>();
    
    const debouncedSearch = useDebouncedValue(searchWord, 500);

    const fetchingBrandTypes = useCallback(async () => {
        setBrandLoading(true)
        try {
            const response = await requestClient({ token: token }).get(
                `/admin/settings/brands?page=${pageCount}&search=${debouncedSearch}`
            );
            if (response.status === 200) {
                setBrandData(response.data.data);
                setBrandLoading(false);
            }
        } catch (error) {
            console.error(error)
            setBrandLoading(false);
        }
    }, [token, debouncedSearch, pageCount]);

    useEffect(() => {
        if (!token) return;
        fetchingBrandTypes();
    }, [token, fetchingBrandTypes]);

    console.log(brandData);
    
    return (
        <BrandSetup
            data={brandData?.data}
            type="Brand"
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            loading={brandLoading}
            meta={brandData?.links}
            setPageCount={setPageCount}
            refetchingTypes={fetchingBrandTypes}
        />
    )
}
