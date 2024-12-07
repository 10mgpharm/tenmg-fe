import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import GeneralSettings from "./_components/GeneralSettings"
import APIManagement from "./_components/APIManagement"
import Notifications from "./_components/Notifications"
import Members from "./_components/Members"
import BusinessInformation from "./_components/BusinessInformation"

const Page = () => {
  return (
    <div className="p-8">
        <h2 className='text-2xl font-semibold text-gray-700 mb-2'>Settings</h2>
        <Tabs>
            <TabList>
                <Tab>General Settings</Tab>
                <Tab>Business Information</Tab>
                <Tab>API Management</Tab>
                <Tab>Notification</Tab>
                <Tab>Member</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <GeneralSettings />
                </TabPanel>
                <TabPanel>
                    <BusinessInformation />
                </TabPanel>
                <TabPanel>
                    <APIManagement />
                </TabPanel>
                <TabPanel>
                    <Notifications />
                </TabPanel>
                <TabPanel>
                    <Members />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
  )
}

export default Page