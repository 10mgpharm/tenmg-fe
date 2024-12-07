'use client';

import React, { useCallback, useEffect, useState } from 'react'
import BrandSetup from '../../../../_components/BrandSetup'
import requestClient from '@/lib/requestClient';
import { useSession } from 'next-auth/react';
import { MedicationResponseData, NextAuthUserSession } from '@/types';

export default function ProductCategorySetupPage() {
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const [categoryData, setCategoryData] = useState<MedicationResponseData>();
  const [categoryLoading, setCateogryLoading] = useState(false);

  const fetchingCategoriesTypes = useCallback(async () => {
    setCateogryLoading(true)
    try {
      const response = await requestClient({ token: token }).get(
        `/admin/settings/categories`
      );
      if (response.status === 200) {
        setCategoryData(response.data.data);
        setCateogryLoading(false)
      }
    } catch (error) {
      console.error(error)
      setCateogryLoading(false)
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchingCategoriesTypes();
  }, [token, fetchingCategoriesTypes]);

  return (
    <BrandSetup
      data={categoryData?.data}
      type="Category"
      loading={categoryLoading}
      refetchingTypes={fetchingCategoriesTypes}
    />
  )
}
