'use client';

import { useCallback, useEffect, useState } from 'react'
import MedicationTypes from '@/app/(protected)/admin/system-setup/_components/MedicationTypes'
import { MedicationResponseData, NextAuthUserSession } from '@/types';
import { useSession } from 'next-auth/react';
import requestClient from '@/lib/requestClient';
import { useDebouncedValue } from '@/utils/debounce';

export default function ProductMedicationTypeSetupPage() {
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const [pageCount, setPageCount] = useState<number>(1);
  const [searchWord, setSearchWord] = useState<string>("");
  const [medicationLoading, setMedicationLoading] = useState(false);
  const [medicationData, setMedicationData] = useState<MedicationResponseData>();

  const debouncedSearch = useDebouncedValue(searchWord, 500);

  const fetchingMedicationTypes = useCallback(async () => {
    setMedicationLoading(true)
    try {
      const response = await requestClient({ token: token }).get(
        `/admin/settings/medication-types?page=${pageCount}&search=${debouncedSearch}`
      );
      if (response.status === 200) {
        setMedicationData(response.data.data);
        setMedicationLoading(false)
      }
    } catch (error) {
      console.error(error)
      setMedicationLoading(false)
    }
  }, [token, debouncedSearch, pageCount]);

  useEffect(() => {
    if (!token) return;
    fetchingMedicationTypes();
}, [token, fetchingMedicationTypes]);

console.log(medicationData)

  return (
    <MedicationTypes
      data={medicationData?.data}
      loading={medicationLoading}
      searchWord={searchWord}
      setSearchWord={setSearchWord}
      setPageCount={setPageCount}
      meta={medicationData?.links}
      fetchingMedicationTypes={fetchingMedicationTypes} />
  )
}
