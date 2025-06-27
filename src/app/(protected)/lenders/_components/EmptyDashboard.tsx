"use client";

import React, { useEffect } from "react";
import { Box, Image, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { NextAuthUserSession } from "@/types";
import OverviewCard from "../../suppliers/_components/OverviewCard/OverviewCard";
import NoRequest from "@public/assets/images/no_request.png";
import LenderActions from "./LenderActions";
import LenderFeatureLayout from "./LenderFeatureLayout";
import CompleteSetup from "./CompleteSetup";
import EmptyCard from "../../suppliers/_components/EmptyCard";
import SetupAccount from "./SetupAccount";
import NoticeCard from "../../suppliers/_components/NoticeCard";
import CompleteAccountModal from "./CompleteAccountModal";
import { useSession } from "next-auth/react";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";

interface ILenderDashboardProps {
  sessionData: NextAuthUserSession | null;
}

interface CompleteSetupProps {
  title: string;
  description: string;
  status: "completed" | "pending";
}

const completeSetupData: CompleteSetupProps[] = [
  {
    title: "Bank Information",
    description: "Add Account Details",
    status: "completed",
  },
  {
    title: "Make a Deposit",
    description: "Add Account Details",
    status: "pending",
  },
  {
    title: "Setup Loan Preference",
    description: "Add Account Details",
    status: "pending",
  },
  {
    title: "Profile Settings",
    description: "Add Account Details",
    status: "pending",
  },
];

const EmptyDashboard = ({ sessionData }: ILenderDashboardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const session = useSession();
  const userSession = session.data as NextAuthUserSession;
  const token = userSession?.user?.token;

  // To always refetch and update user session incase if business status has changed
  useEffect(() => {
    if (!token) return;
    const updateSession = async () => {
      const { data, status } = await requestClient({
        token,
      }).get("/account/profile");

      if (status === 200) {
        await session.update({
          ...session.data,
          user: {
            ...sessionData.user,
            completeProfile: data?.data?.completeProfile,
            businessStatus: data?.data?.businessStatus,
          },
        });
      }
    };

    updateSession();
  }, [token]);

  return (
    <>
      {/* MAIN CONTENT */}
      <div className="w-full flex flex-col md:flex-row gap-5">
        <div className="w-full lg:w-3/5">
          {/* -- MOBILE HORIZONTAL SCROLL -- */}

          <div className="hidden md:block">
            <NoticeCard
              setOpen={onOpen}
              status={sessionData?.user?.businessStatus}
              url="/lenders/settings/license-upload"
            />
          </div>

          <div className="md:hidden overflow-x-auto">
            <div className="flex gap-4 w-max">
              <div className="w-72 shrink-0">
                <OverviewCard
                  title="Total Balance"
                  value="₦0"
                  fromColor="from-[#1A70B8]"
                  toColor="to-[#1A70B8]"
                  image=""
                />
              </div>
              <div className="w-72 shrink-0">
                <OverviewCard
                  title="Investment Wallet"
                  value="₦0"
                  fromColor="from-[#D42E2F]"
                  toColor="to-[#D42E2F]"
                  image=""
                />
              </div>
            </div>
          </div>

          {/* -- DESKTOP VIEW -- */}
          <div className="hidden md:grid grid-cols-2 gap-5 mt-4">
            <OverviewCard
              title="Total Balance"
              value="₦0"
              fromColor="from-[#1A70B8]"
              toColor="to-[#1A70B8]"
              image=""
            />
            <OverviewCard
              title="Investment Wallet"
              value="₦0"
              fromColor="from-[#D42E2F]"
              toColor="to-[#D42E2F]"
              image=""
            />
          </div>

          <LenderActions />

          {/* COMPLETE SETUP */}
          <Box display={{ base: "none", md: "block" }} w="full" mb={6}>
            <LenderFeatureLayout title="Complete Setup">
              {completeSetupData.map((data, index) => (
                <CompleteSetup
                  key={index}
                  title={data.title}
                  description={data.description}
                  status={data.status}
                />
              ))}
            </LenderFeatureLayout>
          </Box>

          {/* Mobile Setup Account */}

          <SetupAccount />

          <div className="flex flex-col gap-6">
            {/* BALANCE ALLOCATION */}

            <LenderFeatureLayout title="Balance Allocation">
              <EmptyCard />
            </LenderFeatureLayout>

            {/* INTEREST GROWTH */}
            <Box borderRadius="lg" p={5} borderWidth="1px" bg={"white"}>
              <Stack gap={3} mt={2}>
                <Text fontSize="lg" fontWeight="medium">
                  Interest Growth Over Time
                </Text>
                <EmptyCard />
              </Stack>
            </Box>
          </div>
        </div>

        {/* LOAN RREQUEST */}
        <div className="w-full lg:w-2/5 flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 h-full">
            <h2 className="text-md font-medium text-gray-700 mb-2">
              Loan Requests
            </h2>
            <div className="flex flex-col justify-center items-center h-full">
              <Image
                className=""
                src={NoRequest.src}
                alt="No Request"
                width={160}
                height={160}
                loading="lazy"
              />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Request
              </h3>
              <p className="text-gray-500 mb-10 text-center">
                You don’t have any loan request yet. <br /> When you do, they’ll
                apper here.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CompleteAccountModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default EmptyDashboard;
