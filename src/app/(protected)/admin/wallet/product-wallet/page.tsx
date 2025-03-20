"use client";

import React, { useState } from "react";
import TimeLineSelector from "../_components/TimeLineSelector";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import WalletTable from "../_components/table";
import { transactionData } from "@/data/mockdata";
const completed = transactionData.filter((item) => item.type === "Completed");

const ProductWallet = () => {
  const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");

  return (
    <div className="px-6 py-8 md:p-8">
      <Link
        href={"/admin/wallet"}
        className="flex items-center gap-2 tetx-[15px] hover:text-gray-800 pb-2 text-primary-600 w-fit"
      >
        <ArrowLeft size={20} />
        Back
      </Link>

      <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-4">
        <div className="text-[18px] font-semibold">Product Wallet</div>

        {/* time line selector */}
        <TimeLineSelector
          selectedTimeLine={selectedTimeLine}
          setSelectedTimeLine={setSelectedTimeLine}
        />
      </div>

      <div className="mt-6">
        <WalletTable
          data={completed}
          type="completed"
          walletType="loan_wallet"
        />
      </div>
    </div>
  );
};

export default ProductWallet;
