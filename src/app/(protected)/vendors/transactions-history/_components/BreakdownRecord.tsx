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
import { SingleTransactionData } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tnxHistoryData: SingleTransactionData;
}
const BreakdownRecords: React.FC<Props> = ({isOpen, onClose, tnxHistoryData}) => {
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
                <span className="text-gray-600 text-md">{tnxHistoryData?.identifier}</span>
            </DrawerHeader>
            <DrawerBody>
                <Tabs>
                    <TabList>
                        <Tab>Purchase Pattern</Tab>
                        <Tab>Credit Pattern</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel px={0}>
                            <PurchasePattern data={tnxHistoryData?.creditScoreResult?.appliedRules}/>
                        </TabPanel>
                        <TabPanel px={0}>
                          <div className="mt-36">
                            <p className="text-center font-medium">No Data found!</p>
                          </div>
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