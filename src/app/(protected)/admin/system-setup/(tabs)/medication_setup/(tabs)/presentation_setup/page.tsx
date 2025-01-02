"use client";
import { useCallback, useEffect, useState } from "react";
import BrandSetup from "../../../../_components/BrandSetup"
import requestClient from "@/lib/requestClient";
import { MedicationResponseData, NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";

const PresentationSetup = () => {

    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;

    const [presentationLoading, setPresentationLoading] = useState(false);
    const [presentationData, setPresentationData] = useState<MedicationResponseData>();

    const fetchingPresentationTypes = useCallback(async () => {
        setPresentationLoading(true)
        try {
        const response = await requestClient({ token: token }).get(
            `/admin/settings/presentations`
        );
        if (response.status === 200) {
            setPresentationData(response.data);
            setPresentationLoading(false)
        }
        } catch (error) {
            console.error(error)
            setPresentationLoading(false)
        }
    }, [token]);

    useEffect(() => {
        if (!token) return;
        fetchingPresentationTypes();
    }, [token, fetchingPresentationTypes]);
    
  return (
    <BrandSetup
        data={presentationData?.data}
        type="Presentation"
        loading={presentationLoading}
        refetchingTypes={fetchingPresentationTypes}
    />
  )
}

export default PresentationSetup