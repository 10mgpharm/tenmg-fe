"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CloseButton,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image as ChakraImage,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { LenderDashboardData, LoanRequest, NextAuthUserSession } from "@/types";
import OverviewCard from "@/app/(protected)/suppliers/_components/OverviewCard/OverviewCard";
import ChartComponent from "@/app/(protected)/vendors/_components/ChartComponent";
import CompleteAccountModal from "@/app/(protected)/vendors/_components/CompleteAccountModal";
import LenderActions from "./LenderActions";
import DepositFunds from "./drawers/DepositFunds";
import WithdrawFunds from "./drawers/WithdrawFunds";
import GenerateStatement from "./drawers/GenerateStatement";
import requestClient from "@/lib/requestClient";
import { formatAmountString } from "@/utils";
import NoRequest from "@public/assets/images/no_request.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../admin/_components/Loader";
import { useRouter } from "next/navigation";
import totalPattern from "@public/assets/images/bgLines.svg";
import CongratsModal from "./drawers/CongratsModal";

// Constants for chart time periods
const BALANCE_TIME_PERIODS = [
  "12 months",
  "3 months",
  "30 days",
  "7 days",
  "24 hours",
] as const;

type BalanceTimePeriod = (typeof BALANCE_TIME_PERIODS)[number];

interface ILenderDashboardProps {
  sessionData: NextAuthUserSession | null;
}

// Chart configuration
const chartOptions = {
  chart: {
    stacked: true,
    toolbar: { show: false },
  },
  dataLabels: { enabled: false },
  yaxis: { show: false },
  xaxis: { categories: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] },
  colors: ["#1A70B8", "var(--tenmg-colors-warning-600)"],
  legend: { show: false },
  plotOptions: { bar: { borderRadius: 4 } },
};

const chartSeries = [
  {
    name: "Out of Loan",
    data: [78, 87, 98, 78, 80, 60, 78],
  },
  {
    name: "Available Balance",
    data: [86, 97, 102, 89, 90, 70, 87],
  },
];

const LenderDashboard = ({ sessionData }: ILenderDashboardProps) => {
  // State management
  const [lenderData, setLenderData] = useState<LenderDashboardData | null>(
    null
  );
  const [isTotalBalanceHidden, setIsTotalBalanceHidden] = useState(false);
  const [isInvestmentBalanceHidden, setIsInvestmentBalanceHidden] =
    useState(false);
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<BalanceTimePeriod>("7 days");
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState<number>(0);
  const [wallet, setWallet] = useState([]);
  const [isWithdraw, setIsWithdraw] = useState(false);

  // Modal/drawer state management
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
  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();

  const sessionToken = sessionData?.user?.token;
  const router = useRouter();

  // Fetch dashboard data
  const fetchLenderData = useCallback(() => {
    if (!sessionToken) return;

    startTransition(async () => {
      try {
        const response = await requestClient({ token: sessionToken }).get(
          "/lender/dashboard"
        );
        if (response.status === 200) {
          setLenderData(response.data.data);
        } else {
          toast.error("Error fetching dashboard data");
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Error fetching dashboard data"
        );
        console.error(error);
      }
    });
  }, [sessionToken]);

  const fetchWallet = useCallback(() => {
    if (!sessionToken) return;

    startTransition(async () => {
      try {
        const response = await requestClient({ token: sessionToken }).get(
          "/lender/settings"
        );
        if (response.status === 200) {
          setWallet(response.data.data);
        } else {
          toast.error("Error fetching wallet");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Error fetching wallet");
        console.error(error);
      }
    });
  }, [sessionToken]);

  useEffect(() => {
    if (sessionData) {
      fetchLenderData();
      fetchWallet();
    }
  }, [sessionData, fetchLenderData, fetchWallet]);

  const handleView = useCallback(
    (id: string) => {
      router.push(`/lenders/loan-application/view/${id}`);
    },
    [router]
  );

  const handleAccept = useCallback(
    async (id: string) => {
      if (!sessionToken) return;

      try {
        const response = await requestClient({ token: sessionToken }).post(
          "/lender/loan-applications",
          { applicationId: id, action: "approve" }
        );

        if (response.status === 200) {
          toast.success("Loan application approved successfully");
          fetchLenderData();
        } else {
          toast.error("Error approving loan application");
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Error approving loan application"
        );
        console.error(error);
      }
    },
    [sessionToken, fetchLenderData]
  );

  const handleIgnore = useCallback(
    async (id: string) => {
      if (!sessionToken) return;

      try {
        const response = await requestClient({ token: sessionToken }).post(
          "/lender/loan-applications",
          { applicationId: id, action: "decline" }
        );

        if (response.status === 200) {
          fetchLenderData();
        } else {
          toast.error("Error declining loan application");
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Error declining loan application"
        );
        console.error(error);
      }
    },
    [sessionToken, fetchLenderData]
  );

  // Memoized calculations
  const { totalBalance, investmentWalletBalance, ledgerBalance } =
    useMemo(() => {
      const wallet = lenderData?.wallets || [];

      const totalBal = wallet.length
        ? wallet
            .reduce(
              (sum, item) => sum + parseFloat(item?.currentBalance || "0"),
              0
            )
            .toFixed(2)
        : "0.00";

      const investmentBal =
        wallet?.find((item) => item.type === "investment")?.currentBalance ||
        "0.00";

      const loanAmountBal =
        wallet?.find((item) => item.type === "ledger")?.currentBalance ||
        "0.00";

      return {
        totalBalance: totalBal,
        investmentWalletBalance: investmentBal,
        ledgerBalance: loanAmountBal,
      };
    }, [lenderData?.wallets]);

  const formattedTotalBalance = isTotalBalanceHidden
    ? "*****"
    : `₦${formatAmountString(totalBalance)}`;

  const formattedInvestmentBalance = isInvestmentBalanceHidden
    ? "*****"
    : `₦${formatAmountString(investmentWalletBalance)}`;

  const formattedLedgerBalance = isInvestmentBalanceHidden
    ? "*****"
    : `₦${formatAmountString(ledgerBalance)}`;

  const handleDepositSuccess = useCallback(() => {
    if (onCloseSuccess) onCloseSuccess();
    fetchLenderData();
  }, [fetchLenderData]);

  return (
    <>
      {isPending && !lenderData && <Loader />}

      {!isPending && lenderData && (
        <div className="w-full flex flex-col md:flex-row gap-5">
          <div className="w-full lg:w-3/5">
            {/* MOBILE HORIZONTAL SCROLL */}
            <div className="md:hidden overflow-x-auto">
              <div className="flex gap-4 w-max">
                <BalanceCard
                  title="Total Balance"
                  value={formattedTotalBalance}
                  isHidden={isTotalBalanceHidden}
                  onToggleVisibility={() =>
                    setIsTotalBalanceHidden(!isTotalBalanceHidden)
                  }
                  fromColor="from-[#1A70B8]"
                  toColor="to-[#1A70B8]"
                  containerClass="w-72 shrink-0"
                />

                <BalanceCard
                  title="Investment Wallet"
                  value={formattedInvestmentBalance}
                  isHidden={isInvestmentBalanceHidden}
                  onToggleVisibility={() =>
                    setIsInvestmentBalanceHidden(!isInvestmentBalanceHidden)
                  }
                  fromColor="from-[#D42E2F]"
                  toColor="to-[#D42E2F]"
                  containerClass="w-72 shrink-0"
                  isInvestment={true}
                  loanAmount="₦125,000"
                  onInvestmentClick={() => {
                    router.push("/lenders/my-earnings");
                  }}
                />
              </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:grid grid-cols-2 gap-5">
              <BalanceCard
                title="Total Balance"
                value={formattedTotalBalance}
                isHidden={isTotalBalanceHidden}
                onToggleVisibility={() =>
                  setIsTotalBalanceHidden(!isTotalBalanceHidden)
                }
                fromColor="from-[#1A70B8]"
                toColor="to-[#1A70B8]"
              />

              <BalanceCard
                title="Investment Wallet"
                value={formattedInvestmentBalance}
                isHidden={isInvestmentBalanceHidden}
                onToggleVisibility={() =>
                  setIsInvestmentBalanceHidden(!isInvestmentBalanceHidden)
                }
                fromColor="from-[#D42E2F]"
                toColor="to-[#D42E2F]"
                isInvestment={true}
                loanAmount={formattedLedgerBalance}
                onInvestmentClick={() => {
                  router.push("/lenders/my-earnings");
                }}
              />
            </div>

            <LenderActions
              onOpenDeposit={onOpenDeposit}
              onOpenWithdraw={onOpenWithdraw}
              onOpenGenerateStatement={onOpenGenerate}
            />

            {/* CHARTS */}
            <div className="space-y-6">
              <ChartSection
                title="Balance Allocation"
                selectedPeriod={selectedTimePeriod}
                onPeriodChange={setSelectedTimePeriod}
                options={chartOptions}
                series={chartSeries}
              />

              <ChartSection
                title="Interest Growth Over Time"
                selectedPeriod={selectedTimePeriod}
                onPeriodChange={setSelectedTimePeriod}
                options={chartOptions}
                series={chartSeries}
              />
            </div>
          </div>

          {/* LOAN REQUEST */}
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
                  onClick={() => router.push("/lenders/loan-application")}
                >
                  See All
                </Button>
              </div>

              <Stack spacing={4}>
                {!lenderData?.loanRequest?.length ? (
                  <EmptyRequestState />
                ) : (
                  lenderData?.loanRequest.map((request) => (
                    <LoanDetails
                      key={request.id}
                      data={request}
                      handleAccept={handleAccept}
                      handleIgnore={handleIgnore}
                      handleView={handleView}
                    />
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
                        {lenderData?.loanApprovalThisMonth ?? 0}
                      </Text>
                    </Flex>
                  </GridItem>

                  <StatCard
                    bg="blue.500"
                    title="Pending Requests"
                    value={lenderData?.pendingRequests ?? 0}
                  />

                  <StatCard
                    bg="green.500"
                    title="Interest Earned"
                    value={`₦${formatAmountString(
                      lenderData?.interestEarned ?? 0
                    )}`}
                  />
                </Grid>
              </Box>
            </div>
          </div>
        </div>
      )}

      {/* Modals and Drawers */}
      <CompleteAccountModal isOpen={isOpen} onClose={onClose} />
      <DepositFunds
        isOpen={isOpenDeposit}
        onOpen={onOpenDeposit}
        onClose={onCloseDeposit}
        onSuccess={onOpenSuccess}
        setAmount={setAmount}
      />
      <WithdrawFunds
        isOpen={isOpenWithdraw}
        onClose={onCloseWithdraw}
        wallet={wallet}
        setAmount={setAmount}
        onSuccess={onOpenSuccess}
        setIsWithdraw={setIsWithdraw}
      />
      <GenerateStatement isOpen={isOpenGenerate} onClose={onCloseGenerate} />

      <CongratsModal
        isOpen={isOpenSuccess}
        onClose={handleDepositSuccess}
        amount={amount}
        isWithdraw={isWithdraw}
      />
    </>
  );
};

interface BalanceCardProps {
  title: string;
  value: string;
  isHidden: boolean;
  onToggleVisibility: () => void;
  fromColor: string;
  toColor: string;
  containerClass?: string;
  isInvestment?: boolean;
  loanAmount?: string;
  onInvestmentClick?: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  value,
  isHidden,
  onToggleVisibility,
  fromColor,
  toColor,
  containerClass = "",
  isInvestment,
  loanAmount,
  onInvestmentClick,
}) => (
  <div className={containerClass}>
    <OverviewCard
      title={title}
      value={value}
      toggleable={true}
      isHidden={isHidden}
      onToggleVisibility={onToggleVisibility}
      fromColor={fromColor}
      toColor={toColor}
      image={totalPattern}
      isInvestment={isInvestment}
      loanAmount={loanAmount}
      onInvestmentClick={onInvestmentClick}
    />
  </div>
);

interface ChartSectionProps {
  title: string;
  selectedPeriod: BalanceTimePeriod;
  onPeriodChange: (period: BalanceTimePeriod) => void;
  options: any;
  series: any;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  title,
  selectedPeriod,
  onPeriodChange,
  options,
  series,
}) => {
  const handleTabChange = (index: number) => {
    onPeriodChange(BALANCE_TIME_PERIODS[index]);
  };

  return (
    <Box borderRadius="lg" p={5} borderWidth="1px" bg="white">
      <Stack gap={3} flex={1} mt={2}>
        <Text fontSize="lg" fontWeight="medium">
          {title}
        </Text>
        <Tabs
          isFitted
          variant="unstyled"
          onChange={handleTabChange}
          index={BALANCE_TIME_PERIODS.indexOf(selectedPeriod)}
        >
          <TabList width="80%">
            {BALANCE_TIME_PERIODS.map((period) => (
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
        <ChartComponent
          options={options}
          series={series}
          type="bar"
          width="100%"
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
  );
};

const EmptyRequestState = () => (
  <div className="flex flex-col items-center justify-center">
    <ChakraImage src={NoRequest.src} alt="No Request" />
    <Text fontSize="md" color="gray.500">
      No loan request available
    </Text>
  </div>
);

interface StatCardProps {
  bg: string;
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ bg, title, value }) => (
  <GridItem bg={bg} p={6} borderRadius="lg" boxShadow="md">
    <Text fontSize="sm" mb={2}>
      {title}
    </Text>
    <Text fontSize="3xl">{value}</Text>
  </GridItem>
);

// This can be moved to a separate file
interface LoanDetailsProps {
  data: LoanRequest;
  handleAccept: (id: string) => void;
  handleView: (id: string) => void;
  handleIgnore: (id: string) => void;
}

const LoanDetails: React.FC<LoanDetailsProps> = ({
  data,
  handleAccept,
  handleView,
  handleIgnore,
}) => {
  return (
    <Card boxShadow="none">
      <CardBody p={0}>
        <Stack
          divider={<Divider />}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          fontSize="sm"
        >
          <Box py={1} fontWeight={500} color="gray.600">
            <Box display="flex" justifyContent="flex-end" p={0}>
              <Tooltip label="Ignore" hasArrow>
                <CloseButton
                  color="red.600"
                  size="sm"
                  onClick={() => handleIgnore(data?.identifier)}
                />
              </Tooltip>
            </Box>

            <Box px={4}>
              <Flex gap={1} alignItems="center" mb={2}>
                <Text>Loan Amount:</Text>
                <Text fontWeight={700} color="gray.900">
                  ₦{formatAmountString(data?.requestedAmount)}
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
          </Box>
          <Flex justifyContent="flex-end" pb={2}>
            <Button
              variant="ghost"
              size="sm"
              colorScheme="green"
              onClick={() => handleAccept(data?.identifier)}
            >
              Accept
            </Button>
            <Button
              variant="ghost"
              size="sm"
              colorScheme="gray"
              onClick={() => handleView(data?.identifier)}
            >
              View
            </Button>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default LenderDashboard;
