import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Text,
  Divider,
} from "@chakra-ui/react";
import PersonalInformation from "./components/PersonalInformation";
import PasswordForm from "./components/PasswordForm";
import Notifications from "./components/Notifications";
import AccountSetup from "./components/AccountSetup";

const Settings = () => {
  return (
    <div className="p-8">
      <h2 className="font-semibold text-2xl text-gray-600">Settings</h2>
      <p className="text-sm font-normal text-gray-500">
        Manage all your personal information and account settings.
      </p>
      <Divider my={5} border="1px solid gray.200" />
      <div className="mt-4">
        <Tabs variant={"unstyled"}>
          <TabList>
            <Tab
              _selected={{
                color: "primary.500",
                bg: "primary.50",
                borderRadius: "10px",
              }}
            >
              <div className="flex items-center gap-3">
                <Text>Personal Information</Text>
              </div>
            </Tab>
            <Tab
              _selected={{
                color: "primary.500",
                bg: "primary.50",
                borderRadius: "10px",
              }}
            >
              <div className="flex items-center gap-3">
                <Text>Password</Text>
              </div>
            </Tab>
            <Tab
              _selected={{
                color: "primary.500",
                bg: "primary.50",
                borderRadius: "10px",
              }}
            >
              <div className="flex items-center gap-3">
                <Text>Notification</Text>
              </div>
            </Tab>
            <Tab
              _selected={{
                color: "primary.500",
                bg: "primary.50",
                borderRadius: "10px",
              }}
            >
              <div className="flex items-center gap-3">
                <Text>License Upload</Text>
              </div>
            </Tab>
            <Tab
              _selected={{
                color: "primary.500",
                bg: "primary.50",
                borderRadius: "10px",
              }}
            >
              <div className="flex items-center gap-3">
                <Text>Team Members</Text>
              </div>
            </Tab>
            <Tab
              _selected={{
                color: "primary.500",
                bg: "primary.50",
                borderRadius: "10px",
              }}
            >
              <div className="flex items-center gap-3">
                <Text>API Key and Web-hooks</Text>
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
  );
};

export default Settings;
