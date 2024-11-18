"use client";

import React, { useState } from "react";
import {
  Flex,
  Stack,
  Grid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Text,
  Badge,
  Button,
  Icon,
} from "@chakra-ui/react";
import OverviewCard from "./OverviewCard";
import SideCard from "./SideCard";
import EmptyCard from "../../suppliers/components/EmptyCard";
import { ArrowDown } from "lucide-react";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import ChartComponent from "./ChartComponent";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

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

const VendorDashboard: React.FC = () => {
  const timePeriods = ["12 months", "30 days", "7 days", "24 hours"] as const;
  const [selectedPeriod, setSelectedPeriod] =
    useState<(typeof timePeriods)[number]>("12 months");

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
      data: [50, 60, 55, 70, 69, 80, 90, 101, 135, 155, 168, 182],
    },
    {
      name: "Outgoing Loan",
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 145, 164, 175],
    },
  ];

  const donutSeries = [60, 25, 15]; // Replace with actual data
  const donutLabels = ["Successful Calls", "Errors", "Drop-off/Cancellations"];

  const donutOptions: ApexOptions = {
    labels: donutLabels,
    legend: {
      position: "bottom",
      show: false
    },
    colors: ["#7086FD", "#6FD195", "#FFAE4C"],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "45%",
        },
      },
    },
  };

  return (
    <Box maxW="1200px" mx="auto" mt={5}>
      {/* <Flex>
        <Stack>
          <h2 className="font-semibold text-2xl text-gray-600">
            Welcome back, Adeola
          </h2>
          <p className="text-sm font-normal text-gray-500">
            Keep track of vendors and their security ratings.
          </p>
        </Stack>
        <Tabs
          isFitted
          variant="enclosed"
          onChange={(index) => setSelectedPeriod(timePeriods[index])}
        >
          <TabList mb="1em">
            {timePeriods.map((period) => (
              <Tab key={period} fontWeight="bold">
                {period}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Flex> */}

      {/* Main Content */}
      <Flex
        justifyContent="space-between"
        w="100%"
        gap={5}
        flexDirection={{ base: "column", md: "row" }}
      >
        {/* Left Side */}
        <Stack w={{ base: "100%", md: "70%" }} gap={6}>
          <Flex justifyContent={"space-between"}>
            <Stack flex={1}>
              <Text fontWeight="medium" fontSize={"3xl"}>
                Welcome back, Adeola
              </Text>
              <Text fontSize={"sm"} color={"#667085"}>
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
              <TabList mb="1em" rounded={"md"} bg={"white"} shadow={"sm"}>
                {timePeriods.map((period) => (
                  <Tab
                    key={period}
                    _selected={{ bg: "gray.100" }}
                    fontSize={"sm"}
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
            />
            <OverviewCard
              title="Applications"
              value={data.applications.toLocaleString()}
            />
            <OverviewCard
              title="Credit Voucher"
              value={data.creditVoucher}
              type="currency"
            />
          </Grid>

          {/* Balance Card */}
          <Box borderRadius="lg" p={6} borderWidth="1px" bg={"white"}>
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <Text>Your balance</Text>
                <Text fontSize="4xl" fontWeight="semibold">
                  {data.balance.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </Text>
              </Box>
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
            <Box mt={4}>
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
        <Stack w={{ base: "100%", md: "30%" }} gap={4}>
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
          <Box borderRadius="lg" p={6} borderWidth="1px" bg={"white"}>
            <Text fontSize="md" fontWeight="medium" textAlign="center" mb={4}>
              Account Linking Report
            </Text>
            {/* Donut Chart */}
            <ChartComponent
              options={donutOptions}
              series={donutSeries}
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
          </Box>
        </Stack>
      </Flex>
    </Box>
  );
};

export default VendorDashboard;
