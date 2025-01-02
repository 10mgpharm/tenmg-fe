"use client";
import { useCallback, useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import { MedicationResponseData, NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import BrandSetup from "../../../_components/BrandSetup";

const MeasurementSetup = () => {

    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;
    const [loading, setLoading] = useState(false);
    const [measurementData, setMeasurementData] = useState<MedicationResponseData>();

    const fetchingMeasurementTypes = useCallback(async () => {
        setLoading(true)
        try {
        const response = await requestClient({ token: token }).get(
            `/admin/settings/measurements`
        );
        if (response.status === 200) {
            setMeasurementData(response.data);
            setLoading(false)
        }
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }, [token]);

    useEffect(() => {
        if (!token) return;
        fetchingMeasurementTypes();
    }, [token, fetchingMeasurementTypes]);

  return (
    <BrandSetup
        data={measurementData?.data}
        type="Measurement"
        loading={loading}
        refetchingTypes={fetchingMeasurementTypes}
    />
  )
}

export default MeasurementSetup;