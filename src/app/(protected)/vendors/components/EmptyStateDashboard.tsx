"use client";

import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import {
  AvatarBadge,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Grid,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import NoticeCard from "../../suppliers/components/NoticeCard";
import OverviewCard from "./OverviewCard";
import SideCard from "./SideCard";
import { ArrowDown } from "lucide-react";
import EmptyCard from "../../suppliers/components/EmptyCard";
import CompleteAccountModal from "./CompleteAccountModal";
import { BusinessStatus } from "@/constants";

interface IVendorDashboard {
  totalCustomers: number;
  applications: number;
  creditVoucher: string;
  txnHistoryEval: number;
  apiCalls: number;
  balance: number;
}

const EmptyStateDashboard = () => {
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const vendorData: IVendorDashboard = {
    totalCustomers: 0,
    applications: 0,
    creditVoucher: "0",
    txnHistoryEval: 0,
    apiCalls: 0,
    balance: 0,
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <NoticeCard
        setOpen={onOpen}
        status={sessionData?.user?.businessStatus}
      />

      <Flex
        justifyContent="space-between"
        mt={4}
        w={"100%"}
        gap={5}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Stack py={6} w="70%">
          <Grid templateColumns="repeat(3, 1fr)" gap={5}>
            <OverviewCard
              title="Total Customers"
              value={vendorData.totalCustomers}
            />
            <OverviewCard
              title="Applications"
              value={vendorData.applications}
            />
            <OverviewCard
              title="Credit Voucher"
              value={vendorData.creditVoucher}
              type="currency"
            />
          </Grid>

          <Card borderRadius="lg" p={6} gap={6}>
            <CardHeader p={0} fontSize="md" fontWeight="medium" flex={1}>
              <Flex justifyContent="space-between" alignItems="center">
                <Box>
                  <Text>Your balance</Text>
                  <Text p={0} fontSize="4xl" fontWeight="semibold">
                    ₦0
                  </Text>
                </Box>
                <Box>
                  <Flex gap={2} alignItems="center">
                    <Badge bgColor="#FF9C66" p={1} rounded="lg"></Badge>{" "}
                    Outgoing Loan
                  </Flex>
                  <Flex gap={2} alignItems="center">
                    <Badge bgColor="#84CAFF" p={1} rounded="lg"></Badge>
                    Credit Repayment
                  </Flex>
                </Box>
              </Flex>
            </CardHeader>
            <CardBody p={0} fontSize="sm" fontWeight="semibold">
              <EmptyCard />
            </CardBody>
          </Card>
        </Stack>
        <Stack mt={4} w="30%" gap={4}>
          <SideCard
            title="Transaction History Evaluations"
            value={vendorData.txnHistoryEval.toString()}
            color="primary.50"
            footer={
              <Button rounded="lg" w="full" fontSize="sm" py={2} px={6}>
                View Transaction History Evaluations
              </Button>
            }
          />
          <SideCard
            title="API Calls"
            value={vendorData.apiCalls.toString()}
            color="orange.100"
            footer={
              <Flex alignItems="center" gap={1}>
                <Icon as={ArrowDown} color="error.500" />
                <Text color="error.500">2.5%</Text>
                <Text fontSize="sm">vs last 7 days</Text>
              </Flex>
            }
          />
          <Card borderRadius="lg" p={6} gap={6}>
            <CardHeader
              p={0}
              fontSize="md"
              fontWeight="medium"
              className="text-center"
            >
              Account Linking Report
            </CardHeader>
            <CardBody p={0} fontSize="sm" fontWeight="semibold">
              <EmptyCard />
            </CardBody>
            <CardFooter
              p={0}
              flexDirection="column"
              gap={3}
              justifyContent="flex-start"
            >
              <Flex gap={2} alignItems="center">
                <Badge bgColor="#EAAA08" p={1} rounded="lg"></Badge> Successful
                Calls
              </Flex>
              <Flex gap={2} alignItems="center">
                <Badge bgColor="#1A70B8" p={1} rounded="lg"></Badge>
                Errors
              </Flex>
            </CardFooter>
          </Card>
        </Stack>
      </Flex>
      <CompleteAccountModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default EmptyStateDashboard;
