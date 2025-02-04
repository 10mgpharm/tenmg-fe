"use client"

import React from "react";
import NoticeCard from "../../suppliers/_components/NoticeCard";
import { useDisclosure } from "@chakra-ui/react";
import { NextAuthUserSession } from "@/types";

interface ILenderDashboardProps {
  isStatusApproved: boolean;
  sessionData: NextAuthUserSession | null
}

interface ILenderDashboard {
  totalCustomers: number;
  applications: number;
  creditVoucher: string;
  txnHistoryEval: number;
  apiCalls: number;
  balance: number;
}

const LenderDashboard = ({ isStatusApproved, sessionData }: ILenderDashboardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {!isStatusApproved && (
        <NoticeCard
          setOpen={onOpen}
          status={sessionData?.user?.businessStatus}
          url="/lenders/settings/license_upload"
        />
      )}
    </>
  );
};

export default LenderDashboard;
