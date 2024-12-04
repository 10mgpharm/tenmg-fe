"use client";
import { 
    Drawer,
    DrawerBody, 
    DrawerCloseButton, 
    DrawerContent, 
    DrawerHeader, 
    DrawerOverlay, 
    Tab, 
    TabList, 
    TabPanel, 
    TabPanels, 
    Tabs 
} from "@chakra-ui/react"
import { ChevronLeft } from "lucide-react";
import PurchasePattern from "./PurchasePattern";

const BreakdownRecords = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {

    return (
      <>
        <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={onClose}
          size={"md"}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader className="flex items-center gap-2">
                <ChevronLeft className="w-5 h-5 text-gray-600"/>
                <span className="text-gray-600 text-md">EVAL-20241030-1624-29404</span>
            </DrawerHeader>
            <DrawerBody>
                <Tabs>
                    <TabList>
                        <Tab>Purchase Pattern</Tab>
                        <Tab>Credit Pattern</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel px={0}>
                            <PurchasePattern />
                        </TabPanel>
                        <TabPanel px={0}>
                            <PurchasePattern />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
}

export default BreakdownRecords;