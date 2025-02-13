"use client";

import React, { useState } from "react";
import NoticeCard from "../../suppliers/_components/NoticeCard";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  Image,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { NextAuthUserSession } from "@/types";
import CompleteAccountModal from "../../vendors/_components/CompleteAccountModal";
import OverviewCard from "../../suppliers/_components/OverviewCard/OverviewCard";
import { ApexOptions } from "apexcharts";
import ChartComponent from "../../vendors/_components/ChartComponent";
import NoRequest from "@public/assets/images/no_request.png";

interface ILenderDashboardProps {
  sessionData: NextAuthUserSession | null;
}

interface ILenderDashboard {
  totalCustomers: number;
  applications: number;
  creditVoucher: string;
  txnHistoryEval: number;
  apiCalls: number;
  balance: number;
}

const LenderDashboard = ({ sessionData }: ILenderDashboardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const balanceTimePeriods = [
    "12 months",
    "3 months",
    "30 days",
    "7 days",
    "24 hours",
  ] as const;

  const options: ApexOptions = {
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false, // Remove values on the bars
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      categories: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    },
    colors: ["#1A70B8", "var(--tenmg-colors-warning-600)"],
    legend: {
      //   position: "top",
      //   inverseOrder: true,
      show: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
      },
    },
  };

  const series = [
    {
      name: "Out of Loan",
      data: [78, 87, 98, 78, 80, 60, 78],
    },
    {
      name: "Available Balance",
      data: [86, 97, 102, 89, 90, 70, 87],
    },
  ];

  const [selectedBalancePeriod, setSelectedBalancedPeriod] =
    useState<(typeof balanceTimePeriods)[number]>("7 days");

  return (
    <>
      {/* MAIN CONTENT */}
      <div className="w-full flex flex-col md:flex-row gap-5">
        <div className="w-full lg:w-3/5">
          {/* -- MOBILE HORIZONTAL SCROLL -- */}
          <div className="md:hidden overflow-x-auto">
            <div className="flex gap-4 w-max">
              <div className="w-72 shrink-0">
                <OverviewCard
                  title="Total Balance"
                  value="₦0"
                  icon=""
                  fromColor="from-[#1A70B8]"
                  toColor="to-[#1A70B8]"
                  image=""
                />
              </div>
              <div className="w-72 shrink-0">
                <OverviewCard
                  title="Investment Wallet"
                  value="₦0"
                  icon=""
                  fromColor="from-[#D42E2F]"
                  toColor="to-[#D42E2F]"
                  image=""
                />
              </div>
            </div>
          </div>

          {/* -- DESKTOP VIEW -- */}
          <div className="hidden md:grid grid-cols-2 gap-5">
            <OverviewCard
              title="Total Balance"
              value="₦0"
              fromColor="from-[#1A70B8]"
              toColor="to-[#1A70B8]"
              icon=""
              image=""
            />
            <OverviewCard
              title="Investment Wallet"
              value="₦0"
              icon=""
              fromColor="from-[#D42E2F]"
              toColor="to-[#D42E2F]"
              image=""
            />
          </div>

          <div className="flex justify-between gap-3 my-6">
            <Button variant="outline" w={"full"} whiteSpace="normal">
              Deposit Funds
            </Button>
            <Button variant="outline" w={"full"} whiteSpace="normal">
              Withdraw Funds
            </Button>
            <Button variant="outline" w={"full"} whiteSpace="normal">
              Generate Statement
            </Button>
          </div>

          {/* BALANCE ALLOCATION & INTEREST GROWTH CHARTS */}
          <div className="">
            {/* BALANCE ALLOCATION */}
            <Box borderRadius="lg" p={5} borderWidth="1px" bg={"white"} mb={6}>
              <Stack gap={3} flex={1} mt={2}>
                <Text fontSize="lg" fontWeight="medium">
                  Balance Allocation
                </Text>
                <Tabs
                  isFitted
                  variant="unstyled"
                  onChange={(index) =>
                    setSelectedBalancedPeriod(balanceTimePeriods[index])
                  }
                >
                  <TabList width="80%">
                    {balanceTimePeriods.map((period) => (
                      <Tab
                        key={period}
                        _selected={{
                          bg: "primary.50",
                          color: "primary.500",
                          rounded: "md",
                          fontWeight: "bold",
                        }}
                        fontSize="sm"
                        fontWeight="medium"
                        px={4}
                        py={2}
                        flex="auto"
                      >
                        {period}
                      </Tab>
                    ))}
                  </TabList>
                </Tabs>
              </Stack>

              <Box>
                {/* Column Bar Chart */}
                <ChartComponent
                  options={options}
                  series={series}
                  type="bar"
                  width={"100%"}
                  height={320}
                />

                <Flex justifyContent="center" alignItems="center" gap={4}>
                  <Flex gap={2} alignItems="center">
                    <Badge bgColor="warning.600" p={1} rounded="lg" />
                    <Text>Available Balance</Text>
                  </Flex>
                  <Flex gap={2} alignItems="center">
                    <Badge bgColor="#1A70B8" p={1} rounded="lg" />
                    <Text>Out on Loan</Text>
                  </Flex>
                </Flex>
              </Box>
            </Box>

            {/* INTEREST GROWTH */}
            <Box borderRadius="lg" p={5} borderWidth="1px" bg={"white"}>
              <Stack gap={3} flex={1} mt={2}>
                <Text fontSize="lg" fontWeight="medium">
                  Interest Growth Over Time
                </Text>
                <Tabs
                  isFitted
                  variant="unstyled"
                  onChange={(index) =>
                    setSelectedBalancedPeriod(balanceTimePeriods[index])
                  }
                >
                  <TabList width="80%">
                    {balanceTimePeriods.map((period) => (
                      <Tab
                        key={period}
                        _selected={{
                          bg: "primary.50",
                          color: "primary.500",
                          rounded: "md",
                          fontWeight: "bold",
                        }}
                        fontSize="sm"
                        fontWeight="medium"
                        px={4}
                        py={2}
                        flex="auto"
                      >
                        {period}
                      </Tab>
                    ))}
                  </TabList>
                </Tabs>
              </Stack>

              <Box>
                {/* Column Bar Chart */}
                <ChartComponent
                  options={options}
                  series={series}
                  type="bar"
                  width={"100%"}
                  height={320}
                />

                <Flex justifyContent="center" alignItems="center" gap={4}>
                  <Flex gap={2} alignItems="center">
                    <Badge bgColor="warning.600" p={1} rounded="lg" />
                    <Text>Available Balance</Text>
                  </Flex>
                  <Flex gap={2} alignItems="center">
                    <Badge bgColor="#1A70B8" p={1} rounded="lg" />
                    <Text>Out on Loan</Text>
                  </Flex>
                </Flex>
              </Box>
            </Box>
          </div>
        </div>

        {/* LOAN RREQUEST */}
        <div className="w-full lg:w-2/5 flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 h-full">
            <h2 className="text-md font-medium text-gray-700 mb-2">
              Loan Requests
            </h2>
            <div className="flex justify-center items-center h-full">
              <Image
                className=""
                src={NoRequest.src}
                alt="No Request"
                width={160}
                height={160}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
      <CompleteAccountModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default LenderDashboard;
