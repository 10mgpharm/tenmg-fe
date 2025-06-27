"use client";

import { Flex, Spinner, Text } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { transactionData } from "@/data/mockdata";
import WalletTable from "../../_components/WalletTable";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import { cn } from "@/lib/utils";
import OverviewCard from "@/app/(protected)/suppliers/_components/OverviewCard/OverviewCard";
import UserWallet from "../../_components/WalletTable";
import { VendorWalletColumn } from "../_component/column";
import VendorWalletTransactionDetails from "../_component/transactionDetails";

const VendorWallet = ({
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
  const [status, setStatus] = useState<string>("pending");
  const [adminCommisionFilter, setAdminCommissionFilter] = useState("");
  const [rowDetails, setRowDetails] = useState<any>(null);
  const [openDetails, setOpenDetails] = useState(false);

  const awaiting = transactionData.filter((item) => item.type === "Awaiting");
  const completed = transactionData.filter((item) => item.type === "Completed");
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
              <span className="bg-green-500/10 text-green-600 font-medium text-[14px] ml-5 px-6 py-2 rounded-full">
                Vendor
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] md:gap-4 mt-7 c">
              <OverviewCard
                fromColor="from-[#53389E] "
                toColor="to-[#7F56D9]  "
                value="₦5,600"
                title="Credit Voucher Amount"
              />
              <OverviewCard
                fromColor="from-[#3E4784]"
                toColor="to-[#3E4784]"
                value="₦2,300"
                title="Current Amount In Wallet"
              />
              <OverviewCard
                fromColor="from-[#DC6803]"
                toColor="to-[#DC6803]"
                value="₦5,600"
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
                column={VendorWalletColumn(openTransactionDetails)}
              />
            </div>
          </div>
        )}
      </div>

      {openDetails && (
        <VendorWalletTransactionDetails
          isOpen={openDetails}
          onClose={() => setOpenDetails(false)}
          data={rowDetails}
        />
      )}
    </div>
  );
};

export default VendorWallet;
