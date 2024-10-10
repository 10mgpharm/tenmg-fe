"use client";

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
import { useSession } from "next-auth/react";
import { NextAuthUserSession, User } from "@/types";

import { useCallback, useEffect, useState } from "react";
import ApiKeys from "./components/ApiKeys";
import TeamMembers from "./components/TeamMembers";
import requestClient from "@/lib/requestClient";

const Settings = () => {
  const [user, setUser] = useState<User>({} as User);

  const session = useSession();
  const sessionData = session?.data?.user as User;
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  useEffect(() => {
    setUser(sessionData);
  }, [sessionData]);

  const [allMembersData, setAllMembersData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTeamMembers = useCallback(async () => {
    try {
      const response = await requestClient({ token: token }).get(
        "/vendor/business/settings/invite"
      );
      if (response.status === 200) {
        setAllMembersData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  return (
    <div className="p-4 md:p-8">
      <h2 className="font-semibold text-2xl text-gray-600">Settings</h2>
      <p className="text-sm font-normal text-gray-500">
        Manage all your personal information and account settings.
      </p>
      <Divider my={[2, 5]} border="1px solid gray.200" />
      <div className="mt-2 md:mt-4">
        <Tabs variant={"unstyled"}>
          <TabList overflow={"auto"}>
            <Tab
              _selected={{
                color: "primary.500",
                bg: "primary.50",
                borderRadius: "10px",
              }}
            >
              <div className="flex items-center gap-3">
                <Text fontSize={{ base: "xs", md: "sm" }}>
                  Personal Information
                </Text>
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
                <Text fontSize={{ base: "xs", md: "sm" }}>Password</Text>
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
                <Text fontSize={{ base: "xs", md: "sm" }}>Notification</Text>
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
                <Text fontSize={{ base: "xs", md: "sm" }}>License Upload</Text>
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
                <Text fontSize={{ base: "xs", md: "sm" }}>Team Members</Text>
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
                <Text fontSize={{ base: "xs", md: "sm" }}>
                  API Key and Web-hooks
                </Text>
              </div>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <PersonalInformation user={user} />
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
            <TabPanel>
              <TeamMembers
                allMembersData={allMembersData}
                fetchTeamMembers={fetchTeamMembers}
                token={token}
              />
            </TabPanel>
            <TabPanel>
              <ApiKeys />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
