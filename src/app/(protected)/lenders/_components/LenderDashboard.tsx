"use client";

import React, { use, useCallback, useEffect, useState } from "react";
// import NoticeCard from "../../suppliers/_components/NoticeCard";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CloseButton,
  Divider,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { LenderDashboardData, LoanRequest, NextAuthUserSession } from "@/types";
// import CompleteAccountModal from "../../vendors/_components/CompleteAccountModal";
// import OverviewCard from "../../suppliers/_components/OverviewCard/OverviewCard";
import { ApexOptions } from "apexcharts";
// import ChartComponent from "../../vendors/_components/ChartComponent";
import NoRequest from "@public/assets/images/no_request.png";
import OverviewCard from "@/app/(protected)/suppliers/_components/OverviewCard/OverviewCard";
import ChartComponent from "@/app/(protected)/vendors/_components/ChartComponent";
import CompleteAccountModal from "@/app/(protected)/vendors/_components/CompleteAccountModal";
import LenderActions from "./LenderActions";
import SideBar from "../../admin/_components/SideBar";
import DepositFunds from "./drawers/DepositFunds";
import WithdrawFunds from "./drawers/WithdrawFunds";
import GenerateStatement from "./drawers/GenerateStatement";
import requestClient from "@/lib/requestClient";
import { formatAmountString } from "@/utils";

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
  const [lenderData, setLenderData] = useState<LenderDashboardData | null>(
    null
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDeposit,
    onOpen: onOpenDeposit,
    onClose: onCloseDeposit,
  } = useDisclosure();
  const {
    isOpen: isOpenWithdraw,
    onOpen: onOpenWithdraw,
    onClose: onCloseWithdraw,
  } = useDisclosure();
  const {
    isOpen: isOpenGenerate,
    onOpen: onOpenGenerate,
    onClose: onCloseGenerate,
  } = useDisclosure();

  const sessionToken = sessionData?.user?.token;

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

  const fetchLenderData = useCallback(async () => {
    const response = await requestClient({ token: sessionToken }).get(
      "/lender/dashboard"
    );
    if (response.status === 200) {
      setLenderData(response.data.data);
    }
  }, [sessionToken]);

  useEffect(() => {
    if (sessionData) {
      fetchLenderData();
    }
  }, [sessionData]);

  console.log("lenderData", lenderData);

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

          <LenderActions
            onOpenDeposit={onOpenDeposit}
            onOpenWithdraw={onOpenWithdraw}
            onOpenGenerateStatement={onOpenGenerate}
          />

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
        <div className="w-full lg:w-2/5 flex flex-col gap-4 h-full">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-md font-medium text-gray-700">
                Loan Requests
              </h2>
              <Button
                variant="link"
                size="sm"
                colorScheme="primary"
                onClick={() => {
                  console.log("See All");
                }}
              >
                See All
              </Button>
            </div>

            <Stack spacing={4}>
              {lenderData?.loanRequest.length === 0 ? (
                <div className="flex flex-col items-center justify-center">
                  <Image src={NoRequest.src} alt="No Request" />
                  <Text fontSize="md" color="gray.500">
                    No loan request available
                  </Text>
                </div>
              ) : (
                lenderData?.loanRequest.map((request) => (
                  <LoanDetails key={request.id} data={request} />
                ))
              )}
            </Stack>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg">
            <Box p={4}>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={4}
                color="white"
              >
                <GridItem
                  colSpan={{ base: 1, md: 1 }}
                  rowSpan={{ base: 1, md: 2 }}
                  bg="teal.500"
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                >
                  <Text fontSize="sm">Loans Approved This Month</Text>
                  <Flex
                    alignItems="center"
                    justifyContent={{ base: "left", md: "center" }}
                    h={{ base: "100%", md: "100%" }}
                  >
                    <Text
                      fontSize={{ base: "4xl", md: "8xl" }}
                      lineHeight="short"
                      pb={6}
                    >
                      5
                    </Text>
                  </Flex>
                </GridItem>

                <GridItem bg="blue.500" p={6} borderRadius="lg" boxShadow="md">
                  <Text fontSize="sm" mb={2}>
                    Pending Requests
                  </Text>
                  <Text fontSize="3xl">25</Text>
                </GridItem>

                <GridItem bg="green.500" p={6} borderRadius="lg" boxShadow="md">
                  <Text fontSize="sm" mb={2}>
                    Interest Earned
                  </Text>
                  <Text fontSize="3xl">₦12,092,894</Text>
                </GridItem>
              </Grid>
            </Box>
          </div>
        </div>
      </div>
      <CompleteAccountModal isOpen={isOpen} onClose={onClose} />
      <DepositFunds
        isOpen={isOpenDeposit}
        onOpen={onOpenDeposit}
        onClose={onCloseDeposit}
      />
      <WithdrawFunds isOpen={isOpenWithdraw} onClose={onCloseWithdraw} />
      <GenerateStatement isOpen={isOpenGenerate} onClose={onCloseGenerate} />
    </>
  );
};

export default LenderDashboard;

const LoanDetails = ({ data }: { data: LoanRequest }) => {
  return (
    <Card boxShadow="none">
      <CardHeader display="flex" justifyContent="flex-end" p={0}>
        <CloseButton color="red.600" />
      </CardHeader>
      <CardBody p={0}>
        <Stack
          divider={<Divider />}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          fontSize="sm"
        >
          <Box p={4} pb={1} fontWeight={500} color="gray.600">
            <Flex gap={1} alignItems="center" mb={2}>
              <Text>Loan Amount:</Text>
              <Text fontWeight={700} color="gray.900">
                ₦{formatAmountString(data?.totalAmount)}
              </Text>
            </Flex>

            <Flex justifyContent="space-between" alignItems="center">
              <Text color="gray.900">{data?.customer.name}</Text>
              <Flex gap={1} alignItems="center">
                <Text color="gray.500">Credit Score:</Text>
                <Text>{data?.customer.score}%</Text>
              </Flex>
            </Flex>
          </Box>
          <Flex justifyContent="flex-end" pb={2}>
            <Button
              variant="ghost"
              size="sm"
              colorScheme="green"
              onClick={() => {
                console.log("Accept");
              }}
            >
              Accept
            </Button>
            <Button variant="ghost" size="sm" colorScheme="gray">
              View
            </Button>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
};

// TODO: Do an if statement to manage is number = or less than 25% or 50% or 75% or 100%. Assign different colors to the badge
