import { Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Text } from '@chakra-ui/react'
import PersonalInformation from './components/PersonalInformation'
import PasswordForm from './components/PasswordForm'
import Notifications from './components/Notifications'
import AccountSetup from './components/AccountSetup'

const Settings = () => {
  return (
    <div className="p-8">
        <h2 className="font-semibold text-2xl text-gray-600">Settings</h2>
        <div className="mt-4">
            <Tabs variant={"unstyled"}>
                <TabList>
                    <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                        <div className='flex items-center gap-3'>
                            <Text>Personal Information</Text>
                        </div>
                    </Tab>
                    <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                        <div className='flex items-center gap-3'>
                            <Text>Password</Text>
                        </div>
                    </Tab>
                    <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                        <div className='flex items-center gap-3'>
                            <Text>Notification Settings</Text>
                        </div>
                    </Tab>
                    <Tab _selected={{ color: 'white', bg: '#1A70B8', borderRadius: "10px" }}>
                        <div className='flex items-center gap-3'>
                            <Text>Account Setup</Text>
                        </div>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px={0}>
                        <PersonalInformation />
                    </TabPanel>
                    <TabPanel>
                        <PasswordForm />
                    </TabPanel>
                    <TabPanel>
                        <Notifications />
                    </TabPanel>
                    <TabPanel>
                        <AccountSetup />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </div>
  )
}

export default Settings