"use client";

import { SETUPTYPE } from "@/app/globalTypes";
import {  Flex, Stack, Text } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react";
import { boolean } from "yup";
import MedicationTypes from "./MedicationTypes";
import { useSession } from "next-auth/react";
import { MedicationResponseData, NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import BrandSetup from "./BrandSetup";

export const setupOptions = [
  {
    value: SETUPTYPE.TYPE,
    label: SETUPTYPE.TYPE.toLocaleUpperCase(),
    __isNew__: typeof boolean,
  },
  { 
    value: SETUPTYPE.CATEGORIES, 
    label: SETUPTYPE.CATEGORIES.toUpperCase(), 
    __isNew__: typeof boolean 
  },
  {
    value: SETUPTYPE.BRANDS,
    label: SETUPTYPE.BRANDS.toUpperCase(),
    __isNew__: typeof boolean,
  },
  { 
    value: SETUPTYPE.STRENGTH, 
    label: SETUPTYPE.STRENGTH.toUpperCase(), 
    __isNew__: typeof boolean 
  },
  { 
    value: SETUPTYPE.PACKAGE, 
    label: SETUPTYPE.PACKAGE.toUpperCase(), 
    __isNew__: typeof boolean 
  },
  { 
    value: SETUPTYPE.PRESENTATION, 
    label: SETUPTYPE.PRESENTATION.toUpperCase(), 
    __isNew__: typeof boolean 
  },
];

const MedicationSetup = () => {

  const [brandLoading, setBrandLoading] = useState(false);
  const [categoryLoading, setCateogryLoading] = useState(false);
  const [medicationLoading, setMedicationLoading] = useState(false);
  const [brandData, setBrandData] = useState<MedicationResponseData>();
  const [categoryData, setCategoryData] = useState<MedicationResponseData>();
  const [medicationData, setMedicationData] = useState<MedicationResponseData>();
  const [currentView, setCurrentView] = useState<string>("BRAND");

  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const fetchingMedicationTypes = useCallback(async() => {
    setMedicationLoading(true)
    try {
      const response = await requestClient({ token: token }).get(
        `/admin/settings/medication-types`
      );
      if(response.status === 200){
        setMedicationData(response.data.data);
        setMedicationLoading(false)
      }
    } catch (error) {
      console.error(error)
      setMedicationLoading(false)
    }
  },[token]);

  const fetchingBrandTypes = useCallback(async() => {
    setBrandLoading(true)
    try {
      const response = await requestClient({ token: token }).get(
        `/admin/settings/brands`
      );
      if(response.status === 200){
        setBrandData(response.data.data);
        setBrandLoading(false);
      }
    } catch (error) {
      console.error(error)
      setBrandLoading(false);
    }
  },[token]);

  const fetchingCategoriesTypes = useCallback(async() => {
    setCateogryLoading(true)
    try {
      const response = await requestClient({ token: token }).get(
        `/admin/settings/categories`
      );
      if(response.status === 200){
        setCategoryData(response.data.data);
        setCateogryLoading(false)
      }
    } catch (error) {
      console.error(error)
      setCateogryLoading(false)
    }
  },[token]);

  useEffect(() => {
    if(!token) return;
    fetchingMedicationTypes();
    fetchingBrandTypes();
    fetchingCategoriesTypes();
  }, [token, fetchingMedicationTypes, fetchingBrandTypes, fetchingCategoriesTypes]);
  
  const renderMedicationSetup = (setupType: string) => {
    switch (setupType) {
      case "BRAND":
        return (
         <BrandSetup 
         data={brandData?.data} 
         type="Brand"
         loading={brandLoading}
         refetchingTypes={fetchingBrandTypes}
         />
        );
      case "ESSENTIAL":
        return (
          <BrandSetup 
          data={categoryData.data} 
          type="Category"
          loading={categoryLoading}
          refetchingTypes={fetchingCategoriesTypes}
          />
        );
      case "MEDICATION":
        return (
          <MedicationTypes 
          data={medicationData?.data} 
          loading={medicationLoading}
          fetchingMedicationTypes={fetchingMedicationTypes}/>
        );
    }
  };

  console.log(brandData);

  return (
   <Stack className="max-w-5xl">
      <Text fontSize={"1rem"} fontWeight={700} color={"gray.700"}>Medication Setup</Text>
      <Text color={"gray.500"} fontSize={"small"}>Perform system related medication setup here</Text>
      <Flex mt={5} gap={8}>
        <Stack gap={4}>
            <Text 
            cursor={"pointer"}
            fontWeight={currentView === "BRAND" ? 600 : 500} 
            color={currentView === "BRAND" ? "blue.600" : "gray.500"} 
            onClick={() => setCurrentView("BRAND")}>
              Brand Setup
            </Text>
            <Text 
              cursor={"pointer"}
              fontWeight={currentView === "ESSENTIAL" ? 600 : 500} 
              color={currentView === "ESSENTIAL" ? "blue.600" : "gray.500"} 
              onClick={() => setCurrentView("ESSENTIAL")}
              >
                Categories
              </Text>
            <Text 
            cursor={"pointer"}
            fontWeight={currentView === "MEDICATION" ? 600 : 500} 
            color={currentView === "MEDICATION" ? "blue.600" : "gray.500"}
            onClick={() => setCurrentView("MEDICATION")}>
              Medication Type
            </Text>
        </Stack>
        {renderMedicationSetup(currentView)}
      </Flex>
   </Stack>
  )
}

export default MedicationSetup