"use client";

import { SETUPTYPE } from "@/app/globalTypes";
import {  Flex, Stack, Text } from "@chakra-ui/react"
import { useState } from "react";
import { boolean } from "yup";
import SetUpOptions from "./SetUpOptions";
import InventorySetup from "./InventorySetup";

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

const medicationTypeSetup = [
  {type: "Setup Medication Type", options: [{id: 1, name: "Medication One"}, {id: 2, name: "Medication Two"}]},
  {type: "Categories", options: [{id: 3, name: "Milligrams"}, {id: 4, name: "Microgram"}, { id: 5, name: "Grams"}]},
  {type: "Brands", options: [{id: 6, name: "6"}, {id: 7, name: "10"}, {id: 8, name: "20"}]},
]
const essentailSetup = [
  {type: "Measurement", options: [{id: 1, name: "Medication One"}, {id: 2, name: "Medication Two"}]},
  {type: "Presentation", options: [{id: 3, name: "Milligrams"}, {id: 4, name: "Microgram"}, { id: 5, name: "Grams"}]},
  {type: "Package Per Roll", options: [{id: 6, name: "6"}, {id: 7, name: "10"}, {id: 8, name: "20"}]},
]

const MedicationSetup = () => {

  const [currentView, setCurrentView] = useState("MEDICATION")
  
  const renderMedicationSetup = (setupType: string) => {
    switch (setupType) {
      case "MEDICATION":
        return (
         <SetUpOptions data={medicationTypeSetup} type="Brand"/>
        );
      case "ESSENTIAL":
        return (
          <SetUpOptions data={essentailSetup} type="Category"/>
        );
      case "INVENTORY":
        return (
          <InventorySetup/>
        );
    }
  };

  return (
   <Stack className="max-w-5xl">
      <Text fontSize={"1rem"} fontWeight={700} color={"gray.700"}>Medication Setup</Text>
      <Text color={"gray.500"} fontSize={"small"}>Perform system related medication setup here</Text>
      <Flex mt={5} gap={8}>
        <Stack gap={4}>
            <Text 
            cursor={"pointer"}
            fontWeight={currentView === "MEDICATION" ? 600 : 500} 
            color={currentView === "MEDICATION" ? "blue.600" : "gray.500"} 
            onClick={() => setCurrentView("MEDICATION")}>
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
            fontWeight={currentView === "INVENTORY" ? 600 : 500} 
            color={currentView === "INVENTORY" ? "blue.600" : "gray.500"}
            onClick={() => setCurrentView("INVENTORY")}>
              Medication Type
            </Text>
        </Stack>
        {renderMedicationSetup(currentView)}
      </Flex>
   </Stack>
  )
}

export default MedicationSetup