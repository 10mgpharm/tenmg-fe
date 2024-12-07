import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import MedicationSetup from "./_components/MedicationSetup"
import AccessControl from "./_components/AccessControl"
import SystemConfiguration from "./_components/SystemConfiguration"

const SystemSetup = () => {
  return (
    <div className="p-8">
      <h2 className='text-2xl font-semibold text-gray-700 mb-2'>System Setup</h2>
      <Tabs>
        <TabList>
          <Tab>Medication Setup</Tab>
          <Tab>Access Control</Tab>
          <Tab>System Configuration</Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
              <MedicationSetup />
            </TabPanel>
            <TabPanel>
              <AccessControl />
            </TabPanel>
            <TabPanel>
              <SystemConfiguration />
            </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}

export default SystemSetup