'use client';

import React, { useCallback, useEffect, useState } from 'react'
import MedicationTypes from '@/app/(protected)/admin/system-setup/_components/MedicationTypes'
import { MedicationResponseData, NextAuthUserSession } from '@/types';
import { useSession } from 'next-auth/react';
import requestClient from '@/lib/requestClient';

export default function ProductMedicationTypeSetupPage() {
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const [medicationLoading, setMedicationLoading] = useState(false);
  const [medicationData, setMedicationData] = useState<MedicationResponseData>();

  const fetchingMedicationTypes = useCallback(async () => {
    setMedicationLoading(true)
    try {
      const response = await requestClient({ token: token }).get(
        `/admin/settings/medication-types`
      );
      if (response.status === 200) {
        setMedicationData(response.data.data);
        setMedicationLoading(false)
      }
    } catch (error) {
      console.error(error)
      setMedicationLoading(false)
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchingMedicationTypes();
}, [token, fetchingMedicationTypes]);

  return (
    <MedicationTypes
      data={medicationData?.data}
      loading={medicationLoading}
      fetchingMedicationTypes={fetchingMedicationTypes} />
  )
}
