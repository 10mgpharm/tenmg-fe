"use client";

import React from "react";
import NoticeCard from "../../suppliers/_components/NoticeCard";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { NextAuthUserSession } from "@/types";
import CompleteAccountModal from "../../vendors/_components/CompleteAccountModal";
import OverviewCard from "../../suppliers/_components/OverviewCard/OverviewCard";
import { Badge } from "lucide-react";

interface ILenderDashboardProps {
  isStatusApproved: boolean;
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

const LenderDashboard = ({
  isStatusApproved,
  sessionData,
}: ILenderDashboardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* {!isStatusApproved && (
        <NoticeCard
          setOpen={onOpen}
          status={sessionData?.user?.businessStatus}
          url="/lenders/settings/license_upload"
        />
      )} */}

      <Flex
        justifyContent="space-between"
        mt={4}
        w={"100%"}
        gap={5}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Stack pb={6} w={{sm: "100%", lg: "60%"}} >
          <Grid templateColumns={{lg: "repeat(2, 1fr)"}} gap={5}>
            <OverviewCard
              title="Total Balance"
              value="₦0"
              icon=""  
              fromColor="from-[#1A70B8]"
              toColor="to-[#1A70B8]"
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
          </Grid>

          {/* <Card borderRadius="lg" p={6} gap={6}>
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
          </Card> */}
        </Stack>
        <Stack mt={4} w="40%" gap={4}>
          <Card borderRadius="lg" p={6} gap={6}>
            <CardHeader
              p={0}
              fontSize="md"
              fontWeight="medium"
            >
              Loan Requests
            </CardHeader>
            <CardBody p={0} fontSize="sm" fontWeight="semibold">
              {/* <EmptyCard /> */}
            </CardBody>
          </Card>
        </Stack>
      </Flex>
      {/* <CompleteAccountModal isOpen={isOpen} onClose={onClose} /> */}
    </>
  );
};

export default LenderDashboard;
