"use client";

import React, { useState } from "react";
import TimeLineSelector from "../_components/TimeLineSelector";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { transactionData } from "@/data/mockdata";
import DataTable from "../_components/table";
import { ViewAll_Column } from "../_components/colunms/view_all_column";
import TransactionDetails from "../_components/transactionDetails";
import InitiatePayout from "../_components/initiate_payout";

const ProductWallet = () => {
  const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");
  const history = transactionData.filter((item) => item.type === "History");

  const [openDetails, setOpenDetails] = React.useState(false);
  const [openPayout, setOpenPayout] = React.useState(false);
  const [openCompleted, setOpenCompleted] = React.useState(false);

  return (
    <div className="px-6 py-8 md:p-8">
      <Link
        href={"/vendors/wallets"}
        className="flex items-center gap-2 tetx-[15px] hover:text-gray-800 pb-2 text-primary-600 w-fit"
      >
        <ArrowLeft size={20} />
        Back
      </Link>

      <div className="flex items-center justify-between max-sm:flex-wrap max-sm:items-start max-sm:gap-3">
        <div className="text-[18px] font-semibold">Loan Wallet</div>

        {/* time line selector */}
        <TimeLineSelector
          selectedTimeLine={selectedTimeLine}
          setSelectedTimeLine={setSelectedTimeLine}
        />
      </div>

      <div className="mt-6">
        <DataTable
          column={ViewAll_Column(
            "loan",
            setOpenDetails,
            setOpenPayout,
            setOpenCompleted
          )}
          data={history}
          isLoading={false}
          hasPagination={false}
        />
      </div>

      {/* Side sheets */}
      {openDetails && (
        <TransactionDetails
          isOpen={openDetails}
          onClose={() => setOpenDetails(false)}
        />
      )}

      {openPayout && (
        <InitiatePayout
          isOpen={openPayout}
          onClose={() => setOpenPayout(false)}
        />
      )}
    </div>
  );
};

export default ProductWallet;
