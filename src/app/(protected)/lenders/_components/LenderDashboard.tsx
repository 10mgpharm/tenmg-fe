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
  Flex,
  Grid,
  GridItem,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { LenderDashboardData, NextAuthUserSession } from "@/types";
import OverviewCard from "@/app/(protected)/suppliers/_components/OverviewCard/OverviewCard";
import ChartComponent from "@/app/(protected)/vendors/_components/ChartComponent";
import CompleteAccountModal from "@/app/(protected)/vendors/_components/CompleteAccountModal";
import LenderActions from "./LenderActions";
import DepositFunds from "./drawers/DepositFunds";
import WithdrawFunds from "./drawers/WithdrawFunds";
import GenerateStatement from "./drawers/GenerateStatement";
import requestClient from "@/lib/requestClient";
import { formatAmountString, handleServerErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../admin/_components/Loader";
import { useRouter } from "next/navigation";
import totalPattern from "@public/assets/images/bgLines.svg";
import CongratsModal from "./drawers/CongratsModal";
import LoanRequestCard from "./dashboard/LoanRequestCard";

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
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

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
        }
      } catch (error: any) {
        toast.error(handleServerErrorMessage(error));
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

  const { totalBalance, investmentWalletBalance, ledgerBalance } =
    useMemo(() => {
      const wallet = lenderData?.wallets || [];

      const totalBal =
        wallet?.find((item) => item.type === "deposit")?.currentBalance ||
        "0.00";

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

  const openAcceptModal = (id: string) => {
    setSelectedLoanId(id);
    setAcceptModalOpen(true);
  };
  const closeAcceptModal = () => {
    setAcceptModalOpen(false);
    setSelectedLoanId(null);
  };
  const confirmAccept = async () => {
    if (selectedLoanId) {
      await handleAccept(selectedLoanId);
      closeAcceptModal();
    }
  };

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

            <div className="block md:hidden mb-5">
              <LoanRequestCard
                lenderData={lenderData}
                openAcceptModal={openAcceptModal}
                handleIgnore={handleIgnore}
                handleView={handleView}
              />
            </div>

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

          <div className="w-full lg:w-2/5 h-full">
            <div className="hidden md:block">
              <LoanRequestCard
                lenderData={lenderData}
                openAcceptModal={openAcceptModal}
                handleIgnore={handleIgnore}
                handleView={handleView}
              />
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
      {isOpenWithdraw && (
        <WithdrawFunds
          isOpen={isOpenWithdraw}
          onClose={onCloseWithdraw}
          wallet={wallet}
          setAmount={setAmount}
          onSuccess={onOpenSuccess}
          setIsWithdraw={setIsWithdraw}
        />
      )}

      <GenerateStatement isOpen={isOpenGenerate} onClose={onCloseGenerate} />

      <CongratsModal
        isOpen={isOpenSuccess}
        onClose={handleDepositSuccess}
        amount={amount}
        isWithdraw={isWithdraw}
      />

      <Modal isOpen={acceptModalOpen} onClose={closeAcceptModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Approve Loan Application</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to approve this loan application?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={confirmAccept}>
              Yes
            </Button>
            <Button variant="ghost" onClick={closeAcceptModal}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
          <TabList width="100%" className="overflow-x-scroll">
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

export default LenderDashboard;
