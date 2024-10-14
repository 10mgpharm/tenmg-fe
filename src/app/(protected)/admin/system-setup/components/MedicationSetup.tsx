"use client";

import { SETUPTYPE } from "@/app/globalTypes";
import {  Button, Flex, HStack, Stack, Tag, TagCloseButton, TagLabel, Text } from "@chakra-ui/react"
import { ChangeEvent, KeyboardEvent, useState } from "react";
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
         <SetUpOptions data={medicationTypeSetup}/>
        );
      case "ESSENTIAL":
        return (
          <SetUpOptions data={essentailSetup}/>
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
      <Text color={"gray.500"} fontSize={"small"}>Placeholder goes here</Text>
      <Flex mt={5} gap={8}>
        <Stack gap={4}>
            <Text 
            cursor={"pointer"}
            fontWeight={currentView === "MEDICATION" ? 600 : 500} 
            color={currentView === "MEDICATION" ? "gray.700" : "gray.500"} 
            onClick={() => setCurrentView("MEDICATION")}>
              Setup Medication Type
            </Text>
            <Text 
              cursor={"pointer"}
              fontWeight={currentView === "ESSENTIAL" ? 600 : 500} 
              color={currentView === "ESSENTIAL" ? "gray.700" : "gray.500"} 
              onClick={() => setCurrentView("ESSENTIAL")}
              >
                Setup Essentials
              </Text>
            <Text 
            cursor={"pointer"}
            fontWeight={currentView === "INVENTORY" ? 600 : 500} 
            color={currentView === "INVENTORY" ? "gray.700" : "gray.500"}
            onClick={() => setCurrentView("INVENTORY")}>
              Setup Inventory
            </Text>
        </Stack>
        {renderMedicationSetup(currentView)}
      </Flex>
   </Stack>
  )
}

export default MedicationSetup