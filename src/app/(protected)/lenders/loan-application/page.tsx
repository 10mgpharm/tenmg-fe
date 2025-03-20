"use client";
import {
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition, useEffect, useCallback } from "react";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { LoanByUser } from "@/data/mockdata";
import OverviewCards from "../../_components/loanApplication/OverviewCards";
import SearchFilter from "../../_components/loanApplication/SearchFilter";
import LoanTable from "../../_components/loanApplication/LoanTable";
import { ColumnsLoanFN } from "./_components/table";
import { toast } from "react-toastify";
import {
  LenderDashboardData,
  LoanApplicationDataResponse,
  NextAuthUserSession,
} from "@/types";
import { handleServerErrorMessage } from "@/utils";
import Loader from "../../admin/_components/Loader";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";

export interface OverviewCardData {
  title: string;
  value: string | number;
  fromColor?: string;
  toColor?: string;
  image: any;
}

export default function LoanApplicationPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [lenderData, setLenderData] = useState<LenderDashboardData | null>(
    null
  );
  const [loanData, setLoanData] = useState<LoanApplicationDataResponse | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const sessionToken = sessionData?.user?.token;

  const fetchLenderData = useCallback(() => {
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
        toast.error("Error fetching dashboard data");
        console.error(error);
      }
    });
  }, [sessionToken]);

  const fetchLoanData = useCallback(() => {
    startTransition(async () => {
      try {
        const response = await requestClient({ token: sessionToken }).get(
          "/lender/loan-application"
        );
        if (response.status === 200) {
          setLoanData(response.data.data);
        } else {
          toast.error("Error fetching Loan Application data");
        }
      } catch (error: any) {
        toast.error(
          "Error fetching dashboard data: ",
          handleServerErrorMessage(error)
        );
        console.error(error);
      }
    });
  }, [sessionToken]);

  useEffect(() => {
    if (sessionData) {
      fetchLoanData();
      fetchLenderData();
    }
  }, [sessionData, fetchLoanData, fetchLenderData]);

  const overviewData: OverviewCardData[] = [
    {
      title: "Total Loan Applications",
      value: loanData?.data?.length || "0",
      fromColor: "from-[#53389E]",
      toColor: "to-[#7F56D9]",
      image: totalPattern,
    },
    {
      title: "Pending Applications",
      value: lenderData?.pendingRequests || "0",
      fromColor: "from-[#DC6803]",
      toColor: "to-[#DC6803]",
      image: orderPattern,
    },
    {
      title: "Approved Applications",
      value: lenderData?.loanApprovalThisMonth || "0",
      fromColor: "from-[#3E4784]",
      toColor: "to-[#3E4784]",
      image: productPattern,
    },
    {
      title: "Disbursed Amount",
      value: lenderData?.interestEarned || "0",
      fromColor: "from-[#E31B54]",
      toColor: "to-[#E31B54]",
      image: productPattern,
    },
  ];

  return (
    <>
      {isPending && <Loader />}
      {!isPending && (
        <div className="m-5">
          <h3 className="font-semibold text-xl my-4">Loan Application</h3>

          <OverviewCards overviewData={overviewData} />
          <SearchFilter
            value={globalFilter}
            onSearchChange={(e) => setGlobalFilter(e.target.value)}
            // You can pass an onFilterClick handler if needed
          />
          <div className="mt-5">
            <LoanTable
              data={Array.isArray(loanData?.data) ? loanData.data : []}
              columns={ColumnsLoanFN()}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              loading={loading}
            />
          </div>
        </div>
      )}
    </>
  );
}
