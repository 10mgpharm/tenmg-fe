"use client";

import { Flex, Spinner, Text } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { transactionData } from "@/data/mockdata";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";

import OverviewCard from "@/app/(protected)/suppliers/_components/OverviewCard/OverviewCard";
import UserWallet from "../../_components/WalletTable";
import { LendersWalletColumn } from "../_component/column";
import LenderWalletTransactionDetails from "../_component/transactionDetails";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";

const LenderWallet = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");
  const [pagecount, setPageCount] = useState(1);
  const [rowDetails, setRowDetails] = useState<any>(null);
  const [openDetails, setOpenDetails] = useState(false);

  // random data
  const history = transactionData.filter((item) => item.type === "History");

  // random data
  const metaData = {
    links: "",
    prevPageUrl: "",
    nextPageUrl: "",
    currentPage: 1,
    firstPageUrl: "",
    lastPageUrl: "",
  };

  const openTransactionDetails = (data: any) => {
    setRowDetails(data);
    setOpenDetails(true);
  };

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const [userStat, setUserStat] = useState<{
    totalPendingOrder: string;
    walletBalance: string;
  }>();
  const [walletHistory, setWalletHistory] = useState("");

  const getUseStats = async () => {
    try {
      const response = await requestClient({ token }).get(
        `/admin/wallet/user/${params.id}`
      );

      setUserStat(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data.message);
    }
  };

  const getWalletHistory = async () => {
    setIsloading(true);
    try {
      const response = await requestClient({ token }).get(
        `/admin/wallet/user/lender/transactions`,
        {
          params: {
            businessId: params?.id,
          },
        }
      );
      setWalletHistory(response.data);
    } catch (error) {
      console.log(error);
    }
    setIsloading(false);
  };

  useEffect(() => {
    if (!token) return;
    getUseStats();
    getWalletHistory();
  }, [token]);

  return (
    <div>
      <div className="p-5">
        {isLoading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <div className="">
            <Flex
              cursor={"pointer"}
              onClick={() => router.back()}
              align={"center"}
              gap={2}
              className=""
            >
              <ArrowLeft className="w-5 h-auto text-gray-500" />
              <Text fontSize={"14px"} color={"gray.600"}>
                Back
              </Text>
            </Flex>
            <h3 className="font-bold pt-3 text-[20px] ">
              Onyejekwe Ugonna Wallet{" "}
              <span className="bg-purple-500/10 text-purple-700 font-medium text-[14px] ml-5 px-6 py-2 rounded-full">
                Lender
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[10px] md:gap-4 mt-7 c">
              <OverviewCard
                fromColor="from-[#3E4784]"
                toColor="to-[#3E4784]"
                value="₦2,300"
                title="Total Balance"
              />

              <OverviewCard
                fromColor="from-[#53389E]"
                toColor="to-[#7F56D9]"
                value="₦2,300"
                title="Investment Wallet"
              />

              <OverviewCard
                fromColor="from-[#E31B54]"
                toColor="to-[#E31B54]"
                value="₦2,300"
                title="Amount On Loan"
              />

              <OverviewCard
                fromColor="from-[#DC6803]"
                toColor="to-[#DC6803]"
                value="₦50,000"
                title="Transaction History"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-6 pb-4">
              <h3 className="font-semibold text-[18px]">Transactions</h3>

              <SearchInput
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <UserWallet
                data={history}
                hasPagination
                metaData={metaData}
                setPageCount={setPageCount}
                isLoading={isLoading}
                column={LendersWalletColumn(openTransactionDetails)}
              />
            </div>
          </div>
        )}
      </div>

      {openDetails && (
        <LenderWalletTransactionDetails
          isOpen={openDetails}
          onClose={() => setOpenDetails(false)}
          data={rowDetails}
        />
      )}
    </div>
  );
};

export default LenderWallet;
