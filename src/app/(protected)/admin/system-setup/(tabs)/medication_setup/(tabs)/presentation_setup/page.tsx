"use client";
import { useCallback, useEffect, useState } from "react";
import BrandSetup from "../../../../_components/BrandSetup"
import requestClient from "@/lib/requestClient";
import { MedicationResponseData, NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import { useDebouncedValue } from "@/utils/debounce";

const PresentationSetup = () => {

    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;

    const [pageCount, setPageCount] = useState<number>(1);
    const [searchWord, setSearchWord] = useState<string>("");
    const [presentationLoading, setPresentationLoading] = useState(false);
    const [presentationData, setPresentationData] = useState<MedicationResponseData>();
    
    const debouncedSearch = useDebouncedValue(searchWord, 500);

    const fetchingPresentationTypes = useCallback(async () => {
        setPresentationLoading(true)
        try {
        const response = await requestClient({ token: token }).get(
            `/admin/settings/presentations?page=${pageCount}&search=${debouncedSearch}`
        );
        if (response.status === 200) {
            setPresentationData(response.data.data);
            setPresentationLoading(false)
        }
        } catch (error) {
            console.error(error)
            setPresentationLoading(false)
        }
    }, [token, debouncedSearch, pageCount]);

    useEffect(() => {
        if (!token) return;
        fetchingPresentationTypes();
    }, [token, fetchingPresentationTypes]);
    
  return (
    <BrandSetup
        data={presentationData?.data}
        type="Presentation"
        loading={presentationLoading}
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        meta={presentationData?.links}
        setPageCount={setPageCount}
        refetchingTypes={fetchingPresentationTypes}
    />
  )
}

export default PresentationSetup