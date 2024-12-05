"use client";

import React, { useState } from "react";
import {
  Flex,
  Stack,
  Grid,
  Tabs,
  TabList,
  Tab,
  Box,
  Text,
  Badge,
  Button,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import OverviewCard from "./OverviewCard";
import SideCard from "./SideCard";
import { ArrowDown } from "lucide-react";
import { ApexOptions } from "apexcharts";
import ChartComponent from "./ChartComponent";
import NoticeCard from "../../suppliers/components/NoticeCard";
import CompleteAccountModal from "./CompleteAccountModal";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import { BusinessStatus } from "@/constants/enum";

export interface IVendorDashboard {
  totalCustomers: number;
  applications: number;
  creditVoucher: string;
  txnHistoryEval: number;
  apiCalls: number;
  balance: number;
}

export interface IVendorData {
  "12 months": IVendorDashboard;
  "30 days": IVendorDashboard;
  "7 days": IVendorDashboard;
  "24 hours": IVendorDashboard;
}

const vendorData: IVendorData = {
  "12 months": {
    totalCustomers: 12000,
    applications: 3000,
    creditVoucher: "180,000",
    txnHistoryEval: 8500,
    apiCalls: 60000,
    balance: 180000,
  },
  "30 days": {
    totalCustomers: 3500,
    applications: 900,
    creditVoucher: "54,000",
    txnHistoryEval: 2500,
    apiCalls: 18000,
    balance: 54000,
  },
  "7 days": {
    totalCustomers: 800,
    applications: 200,
    creditVoucher: "12,000",
    txnHistoryEval: 600,
    apiCalls: 4200,
    balance: 12000,
  },
  "24 hours": {
    totalCustomers: 120,
    applications: 30,
    creditVoucher: "1,800",
    txnHistoryEval: 85,
    apiCalls: 600,
    balance: 1800,
  },
};

const VendorDashboard = () => {
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const timePeriods = ["12 months", "30 days", "7 days", "24 hours"] as const;
  const balanceTimePeriods = [
    "12 months",
    "3 months",
    "30 days",
    "7 days",
    "24 hours",
  ] as const;

  const [selectedPeriod, setSelectedPeriod] =
    useState<(typeof timePeriods)[number]>("12 months");

  const [selectedBalancePeriod, setSelectedBalancedPeriod] =
    useState<(typeof balanceTimePeriods)[number]>("12 months");

  const data: IVendorDashboard = vendorData[selectedPeriod];

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
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "April",
        "May",
        "June",
        "July",
        "August",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    colors: ["#84CAFF", "#FF9C66"],
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

  // Define the series data with proper types
  const series = [
    {
      name: "Credit Repayment",
      data: [86, 97, 102, 89, 90, 70, 87, 89, 100, 89, 98, 101],
    },
    {
      name: "Outgoing Loan",
      data: [78, 87, 98, 78, 80, 60, 78, 91, 105, 78, 89, 96],
    },
  ];

  const reportSeries = [10, 46, 82]; // Replace with actual data
  const reportLabels = ["Successful Calls", "Errors", "Drop-off/Cancellations"];

  const reportTotal = reportSeries.reduce((a, b) => a + b, 0);

  const donutOptions: ApexOptions = {
    labels: reportLabels,
    legend: {
      position: "bottom",
      show: false,
    },
    colors: ["#7086FD", "#6FD195", "#FFAE4C"],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "45%",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "",
              formatter: () => reportTotal.toString(),
            },
          },
        },
      },
    },
  };

  return (
    <>
      <NoticeCard
        setOpen={onOpen}
        isVisible={!Object.values(BusinessStatus).includes(BusinessStatus.VERIFIED)}
        status={sessionData?.user?.businessStatus}
      />

      <Box mx="auto" mt={5}>
        {/* Main Content */}
        <Flex
          justifyContent="space-between"
          w="100%"
          gap={5}
          flexDirection={{ base: "column", md: "row" }}
        >
          {/* Left Side */}
          <Stack
            w={{ base: "100%", md: "70%" }}
            gap={6}
            justifyContent="space-between"
          >
            <Flex justifyContent="space-between" direction={{ base: "column", md: "row" }} gap={4}>
              <Stack flex={1}>
                <Text fontWeight="medium" fontSize="3xl">
                  Welcome back, Adeola
                </Text>
                <Text fontSize="sm" color="#667085">
                  Keep track of vendors and their security ratings.
                </Text>
              </Stack>
              {/* Time Period Tabs */}
              <Tabs
                isFitted
                variant="unstyled"
                onChange={(index) => setSelectedPeriod(timePeriods[index])}
                flex={1}
              >
                <TabList mb="1em" rounded="lg" bg="white" boxShadow="sm">
                  {timePeriods.map((period, i) => (
                    <Tab
                      key={period}
                      _selected={{ bg: "gray.100" }}
                      _hover={{
                        bg: "gray.100",
                      }}
                      borderStartRadius={i === 0 && "md"}
                      borderEndRadius={i === timePeriods.length - 1 && "md"}
                      borderWidth="1px"
                      fontSize="sm"
                    >
                      {period}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
            </Flex>
            {/* Overview Cards */}
            <Grid templateColumns="repeat(3, 1fr)" gap={5}>
              <OverviewCard
                title="Total Customers"
                value={data.totalCustomers.toLocaleString()}
                percentageFooter={2.5}
                increasePercentage={false}
              />
              <OverviewCard
                title="Applications"
                value={data.applications.toLocaleString()}
                percentageFooter={2.2}
                increasePercentage={true}
                isPending
                pendingValue={200}
              />
              <OverviewCard
                title="Credit Voucher"
                value={data.creditVoucher}
                type="currency"
                percentageFooter={2.5}
                increasePercentage={false}
              />
            </Grid>

            {/* Balance Card */}
            <Box borderRadius="lg" p={6} borderWidth="1px" bg={"white"}>
              <Flex justifyContent="space-between" alignItems="center" pb={5}>
                <Stack gap={3} flex={1} mt={2}>
                  <Text color="gray.500">Your Balance</Text>
                  <Text fontSize="4xl" fontWeight="semibold">
                    {data.balance.toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
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
                  <Flex gap={2} alignItems="center">
                    <Badge bgColor="#FF9C66" p={1} rounded="lg" />
                    <Text>Outgoing Loan</Text>
                  </Flex>
                  <Flex gap={2} alignItems="center" mt={2}>
                    <Badge bgColor="#84CAFF" p={1} rounded="lg" />
                    <Text>Credit Repayment</Text>
                  </Flex>
                </Box>
              </Flex>

              <Box>
                {/* Column Bar Chart */}
                <ChartComponent
                  options={options}
                  series={series}
                  type="bar"
                  width={"100%"}
                  height={320}
                />
              </Box>
            </Box>
          </Stack>

          {/* Right Side */}
          <Stack w={{ base: "100%", md: "30%" }} gap={4} justifyContent={{ base: "normal", xl: "space-between" }}>
            {/* Transaction History Evaluations */}
            <SideCard
              title="Transaction History Evaluations"
              value={data.txnHistoryEval.toLocaleString()}
              color="primary.50"
              footer={
                <Button rounded="lg" w="full" fontSize="sm" py={2} px={6}>
                  View Transaction History Evaluations
                </Button>
              }
            />
            {/* API Calls */}
            <SideCard
              title="API Calls"
              value={data.apiCalls.toLocaleString()}
              color="orange.100"
              footer={
                <Flex alignItems="center" gap={1}>
                  <Icon as={ArrowDown} color="red.500" />
                  <Text color="red.500">2.5%</Text>
                  <Text fontSize="sm">vs last 7 days</Text>
                </Flex>
              }
            />
            {/* Account Linking Report */}
            <Stack borderRadius="lg" p={6} borderWidth="1px" bg={"white"} gap={5}>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Account Linking Report
              </Text>
              {/* Donut Chart */}
              <ChartComponent
                options={donutOptions}
                series={reportSeries}
                type="donut"
                width="100%"
                height={200}
              />
              <Box mt={4}>
                <Flex gap={2} alignItems="center">
                  <Badge bgColor="#7086FD" p={1} rounded="lg" />
                  <Text>Successful Calls</Text>
                </Flex>
                <Flex gap={2} alignItems="center" mt={2}>
                  <Badge bgColor="#6FD195" p={1} rounded="lg" />
                  <Text>Errors</Text>
                </Flex>
                <Flex gap={2} alignItems="center" mt={2}>
                  <Badge bgColor="#FFAE4C" p={1} rounded="lg" />
                  <Text>Drop-off/Cancellations</Text>
                </Flex>
              </Box>
            </Stack>
          </Stack>
        </Flex>
      </Box>
      <CompleteAccountModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default VendorDashboard;
