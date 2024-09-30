import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import GeneralSettings from "./components/GeneralSettings"

const Page = () => {
  return (
    <div className="p-8">
        <h2 className='text-2xl font-semibold text-gray-700 mb-2'>Settings</h2>
        <Tabs>
            <TabList>
                <Tab>General Settings</Tab>
                <Tab>API Management</Tab>
                <Tab>Notification</Tab>
                <Tab>Member</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <GeneralSettings />
                </TabPanel>
                <TabPanel>
                <p>two!</p>
                </TabPanel>
                <TabPanel>
                <p>three!</p>
                </TabPanel>
                <TabPanel>
                <p>three!</p>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
  )
}

export default Page