"use client";
import {
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Box,
  HStack,
  Flex,
  useDisclosure,
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
  LoanApplicationDataResponse,
  LoanStats,
  NextAuthUserSession,
} from "@/types";
import { handleServerErrorMessage } from "@/utils";
import Loader from "../../admin/_components/Loader";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import SearchInput from "../../vendors/_components/SearchInput";
import { IFilterInput } from "../../vendors/customers-management/page";
import FilterDrawer from "../../vendors/_components/FilterDrawer";
import { useDebouncedValue } from "@/utils/debounce";
import { formatDateRange } from "@/lib/dateFormatter";

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
  const [lenderData, setLenderData] = useState<LoanStats | null>(null);
  const [loanData, setLoanData] = useState<LoanApplicationDataResponse | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const [pageCount, setPageCount] = useState(1);
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const sessionToken = sessionData?.user?.token;
  const [status, setStatus] = useState<string>("");

  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  const fetchLenderData = useCallback(() => {
    startTransition(async () => {
      try {
        const response = await requestClient({ token: sessionToken }).get(
          "/lender/loan-applications/loan-stats"
        );
        if (response.status === 200) {
          setLenderData(response.data.data);
        }
      } catch (error: any) {
        console.error(error);
      }
    });
  }, [sessionToken]);

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchLoanData = useCallback(() => {
    startTransition(async () => {
      try {
        let query = `/lender/loan-applications?page=${pageCount}`;

        if (debouncedSearch) {
          query += `&search=${debouncedSearch}`;
        }
        if (status) {
          query += `&status=${status}`;
        }
        if (createdAtStart) {
          query += `&dateFrom=${createdAtStart}`;
        }
        if (createdAtEnd) {
          query += `&dateTo=${createdAtEnd}`;
        }

        const response = await requestClient({ token: sessionToken }).get(
          query
        );

        if (response.status === 200) {
          setLoanData(response.data.data);
        }
      } catch (error: any) {
        console.error(error);
      }
    });
  }, [
    sessionToken,
    createdAtStart,
    createdAtEnd,
    pageCount,
    debouncedSearch,
    status,
  ]); // Add pageCount to dependency array

  const handleApprove = async (id: string) => {
    try {
      await requestClient({ token: sessionToken }).post(
        "/lender/loan-applications",
        { applicationId: id, action: "approve" }
      );
      toast.success("Loan application approved successfully");
      fetchLenderData();
      fetchLoanData();
    } catch (error: any) {
      toast.error(handleServerErrorMessage(error));
      console.error(error);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await requestClient({ token: sessionToken }).post(
        "/lender/loan-applications",
        { applicationId: id, action: "decline" }
      );
      toast.success("Loan application declined successfully");
      fetchLenderData();
      fetchLoanData();
    } catch (error: any) {
      toast.error("Error declining loan application");
      console.error(error);
    }
  };

  useEffect(() => {
    if (sessionData) {
      fetchLoanData();
      fetchLenderData();
    }
  }, [sessionData, fetchLoanData, fetchLenderData]);

  const applyFilters = (filters: IFilterInput) => {
    setCreatedAtStart(filters.startDate);
    setCreatedAtEnd(filters.endDate);
    setStatus(filters.status);
  };

  const clearFilters = () => {
    setCreatedAtStart(null);
    setCreatedAtEnd(null);
    setStatus("");
    setGlobalFilter("");
  };

  const filterOptions = [
    { option: "APPROVED", value: "APPROVED" },
    { option: "INITIATED", value: "INITIATED" },
    { option: "CANCELED", value: "CANCELED" },
  ];

  const overviewData: OverviewCardData[] = [
    {
      title: "Total Loan Applications",
      value: lenderData?.totalApplications || "0",
      fromColor: "from-[#53389E]",
      toColor: "to-[#7F56D9]",
      image: totalPattern,
    },
    {
      title: "Pending Applications",
      value: lenderData?.pendingApplications || "0",
      fromColor: "from-[#DC6803]",
      toColor: "to-[#DC6803]",
      image: orderPattern,
    },
    {
      title: "Approved Applications",
      value: lenderData?.successfulApplications || "0",
      fromColor: "from-[#3E4784]",
      toColor: "to-[#3E4784]",
      image: productPattern,
    },
    {
      title: "Disbursed Amount",
      value: "0",
      fromColor: "from-[#E31B54]",
      toColor: "to-[#E31B54]",
      image: productPattern,
    },
  ];

  return (
    <>
      <div className="m-5">
        <h3 className="font-semibold text-xl my-4">Loan Application</h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <OverviewCards overviewData={overviewData} />
        </div>
        {/* <HStack justify={"space-between"}> */}
        <div className="flex justify-between items-center mt-5">
          <Flex mt={4} gap={2} width={"fit-content"}>
            <SearchInput
              placeholder="Search for a loan"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <Button
              h={"40px"}
              px={4}
              variant={"outline"}
              className="border text-gray-600 bg-white"
              onClick={onOpenFilter}
            >
              Filter
            </Button>
          </Flex>
        </div>
        {/* </HStack> */}
        <div className="mt-5">
          <LoanTable
            data={Array.isArray(loanData?.data) ? loanData.data : []}
            columns={ColumnsLoanFN(handleApprove, handleDecline, pageCount )}
            loading={loading || isPending}
            metaData={loanData?.meta}
            setPageCount={setPageCount}
          />
        </div>
      </div>

      <FilterDrawer
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        filterOptions={filterOptions}
      />
    </>
  );
}
