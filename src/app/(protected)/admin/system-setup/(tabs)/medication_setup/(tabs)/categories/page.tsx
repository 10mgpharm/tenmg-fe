'use client';

import React, { useCallback, useEffect, useState } from 'react'
import BrandSetup from '../../../../_components/BrandSetup'
import requestClient from '@/lib/requestClient';
import { useSession } from 'next-auth/react';
import { MedicationResponseData, NextAuthUserSession } from '@/types';
import { useDebouncedValue } from '@/utils/debounce';

export default function ProductCategorySetupPage() {
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const [pageCount, setPageCount] = useState<number>(1);
  const [searchWord, setSearchWord] = useState<string>("");
  const [categoryData, setCategoryData] = useState<MedicationResponseData>();
  const [categoryLoading, setCateogryLoading] = useState(false);

  const debouncedSearch = useDebouncedValue(searchWord, 500);

  const fetchingCategoriesTypes = useCallback(async () => {
    setCateogryLoading(true)
    try {
      const response = await requestClient({ token: token }).get(
        `/admin/settings/categories?page=${pageCount}&search=${debouncedSearch}`
      );
      if (response.status === 200) {
        setCategoryData(response.data.data);
        setCateogryLoading(false)
      }
    } catch (error) {
      console.error(error)
      setCateogryLoading(false)
    }
  }, [token, debouncedSearch, pageCount]);

  useEffect(() => {
    if (!token) return;
    fetchingCategoriesTypes();
  }, [token, fetchingCategoriesTypes]);

  return (
    <BrandSetup
      data={categoryData?.data}
      type="Category"
      searchWord={searchWord}
      setSearchWord={setSearchWord}
      meta={categoryData?.links}
      setPageCount={setPageCount}
      loading={categoryLoading}
      refetchingTypes={fetchingCategoriesTypes}
    />
  )
}
