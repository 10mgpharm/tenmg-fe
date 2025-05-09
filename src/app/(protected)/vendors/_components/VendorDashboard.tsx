"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import NoticeCard from "../../suppliers/_components/NoticeCard";
import CompleteAccountModal from "./CompleteAccountModal";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import { BusinessStatus } from "@/constants/enum";
import { formatAmountString, handleServerErrorMessage } from "@/utils";
import { formatAmount } from "@/utils/formatAmount";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import Loader from "../../admin/_components/Loader";
import { useRouter } from "next/navigation";

export interface IVendorDashboard {
  totalCustomers: number;
  totalPendingApplications: number;
  totalApplications: number;
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

  const [dashboardData, setDashboardData] = useState<IVendorDashboard | null>(
    null
  );
  const [reportSeries, setReportSeries] = useState<number[]>([0, 0, 0]);
  const [loading, setLoading] = useState(false);
  const [chartSeries, setChartSeries] = useState([
    { name: "Completed Loan", data: [] as number[] },
    { name: "Outgoing Loan", data: [] as number[] },
  ]);
  const [chartCategories, setChartCategories] = useState<string[]>([]);

  const token = sessionData?.user?.token;

  const router = useRouter();

  const fetchDashboard = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await requestClient({ token }).get("/vendor/dashboard");
      const d = res.data.data;
      setDashboardData({
        totalCustomers: d.totalCustomers,
        totalApplications: d.totalApplications,
        totalPendingApplications: d.totalPendingApplications,
        creditVoucher: d.creditVoucher,
        txnHistoryEval: d.transactionEvaluation,
        apiCalls: d.apiCalls,
        balance: Number(d.payOutWallet),
      });
      setReportSeries([
        d.accountLinking.successfulCalls,
        d.accountLinking.errors,
        d.accountLinking.dropOffs || 0,
      ]);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchChartStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await requestClient({ token }).get(
        "/vendor/dashboard/graph-stats"
      );
      const stats = res.data.data;
      setChartCategories(stats.map((item: any) => item.month));
      setChartSeries([
        {
          name: "Credit Repayment",
          data: stats.map((item: any) => item.completed),
        },
        { name: "Outgoing Loan", data: stats.map((item: any) => item.ongoing) },
      ]);
    } catch (e) {
      const error = handleServerErrorMessage(e);
      toast.error(error);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboard();
    fetchChartStats();
  }, [fetchDashboard, fetchChartStats]);

  if (loading || !dashboardData)
    return (
      <div>
        <Loader />
      </div>
    );

  const data: IVendorDashboard = dashboardData;

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
    xaxis: { categories: chartCategories },
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

  const reportLabels = ["Successful Calls", "Errors", "Drop-off/Cancellations"];

  const reportTotal = reportSeries.reduce((a, b) => a + b, 0);

  const donutOptions: ApexOptions = {
    labels: reportLabels,
    legend: {
      position: "bottom",
      show: false,
    },
    colors: ["#6FD195", "#F56565", "#FFAE4C"],
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

  const isVisible =
    sessionData?.user?.businessStatus !== BusinessStatus.VERIFIED;

  return (
    <>
      {isVisible && (
        <NoticeCard
          setOpen={onOpen}
          status={sessionData?.user?.businessStatus}
          url="/vendors/settings/license_upload"
        />
      )}

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
            <Flex
              justifyContent="space-between"
              direction={{ base: "column", md: "row" }}
              gap={4}
            >
              <Stack flex={1}>
                <Text fontWeight="medium" fontSize="3xl">
                  Welcome back!
                </Text>
                <Text fontSize="sm" color="#667085">
                  Manage your 10mg API, track customer loans, and view credit
                  insights.
                </Text>
              </Stack>
              {/* Time Period Tabs */}
              {/* <Tabs
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
              </Tabs> */}
            </Flex>
            {/* Overview Cards */}
            <Grid className="grid grid-cols-1 md:grid-cols-3" gap={5}>
              <OverviewCard
                title="Total Customers"
                value={data.totalCustomers}
                color="blue.400"
              />
              <OverviewCard
                title="Loan Applications"
                value={data.totalApplications}
                isPending
                pendingValue={data.totalPendingApplications}
                color="green.400"
              />
              <OverviewCard
                title="Credit Voucher"
                value={formatAmountString(data.creditVoucher)}
                type="currency"
                color="purple.400"
              />
            </Grid>

            {/* Balance Card */}
            <Box borderRadius="lg" p={2} borderWidth="1px" bg={"white"}>
              <Flex justifyContent="space-between" alignItems="center" pb={5} flexWrap={"wrap"}>
                <Stack gap={3} flex={1} mt={2}>
                  <Text color="gray.500">Your Balance</Text>
                  <Text fontSize="3xl" fontWeight="semibold">
                    ₦{formatAmountString(data.balance)}
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
                    <Badge bgColor="#FF9C66" p={1} rounded="xs" />
                    <Text>Outgoing Loan</Text>
                  </Flex>
                  <Flex gap={2} alignItems="center" mt={2}>
                    <Badge bgColor="#84CAFF" p={1} rounded="xs" />
                    <Text>Completed Loan</Text>
                  </Flex>
                </Box>
              </Flex>

              <Box>
                {/* Column Bar Chart */}
                <ChartComponent
                  options={options}
                  series={chartSeries}
                  type="bar"
                  width={"100%"}
                  height={320}
                />
              </Box>
            </Box>
          </Stack>

          {/* Right Side */}
          <Stack
            w={{ base: "100%", md: "30%" }}
            gap={4}
            justifyContent={{ base: "normal", xl: "space-between" }}
          >
            {/* Transaction History Evaluations */}
            <SideCard
              title="Transaction History Evaluations"
              value={data.txnHistoryEval.toLocaleString()}
              color="primary.50"
              footer={
                <Button rounded="lg" w="full" fontSize="sm" py={2} px={6} onClick={() => {
                  router.push("/vendors/transactions-history");
                }}>
                  View All Evaluations
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
                  <Text color="red.500" fontSize="sm">
                    2.5%
                  </Text>
                  <Text fontSize="sm">vs last 7 days</Text>
                </Flex>
              }
            />
            {/* Account Linking Report */}
            <Stack
              borderRadius="lg"
              p={6}
              borderWidth="1px"
              bg={"white"}
              gap={5}
            >
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
                  <Badge bgColor="#6FD195" p={1} rounded="lg" />
                  <Text>Successful Calls</Text>
                </Flex>
                <Flex gap={2} alignItems="center" mt={2}>
                  <Badge bgColor="#F56565" p={1} rounded="lg" />
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
