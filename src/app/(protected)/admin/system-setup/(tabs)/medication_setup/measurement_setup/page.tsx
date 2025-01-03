"use client";
import { useCallback, useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import { MedicationResponseData, NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import BrandSetup from "../../../_components/BrandSetup";
import { useDebouncedValue } from "@/utils/debounce";

const MeasurementSetup = () => {

    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;

    const [loading, setLoading] = useState(false);
    const [pageCount, setPageCount] = useState<number>(1);
    const [searchWord, setSearchWord] = useState<string>("");
    const [measurementData, setMeasurementData] = useState<MedicationResponseData>();

    const debouncedSearch = useDebouncedValue(searchWord, 500);

    const fetchingMeasurementTypes = useCallback(async () => {
        setLoading(true)
        try {
        const response = await requestClient({ token: token }).get(
            `/admin/settings/measurements?page=${pageCount}&search=${debouncedSearch}`
        );
        if (response.status === 200) {
            setMeasurementData(response.data);
            setLoading(false)
        }
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }, [token, debouncedSearch, pageCount]);

    useEffect(() => {
        if (!token) return;
        fetchingMeasurementTypes();
    }, [token, fetchingMeasurementTypes]);

  return (
    <BrandSetup
        data={measurementData?.data}
        type="Measurement"
        loading={loading}
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        meta={measurementData?.links}
        setPageCount={setPageCount}
        refetchingTypes={fetchingMeasurementTypes}
    />
  )
}

export default MeasurementSetup;