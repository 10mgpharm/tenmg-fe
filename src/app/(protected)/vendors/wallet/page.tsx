"use client";

import React from "react";
import TimeLineSelector from "./_components/TimeLineSelector";
import LoanWallet from "./_components/loanWallet";

const Wallets = () => {
  const [selectedTimeLine, setSelectedTimeLine] = React.useState("12 months");

  return (
    <div className="p-5">
      <div className="flex items-center justify-between gap-4 max:sm:flex-col">
        <h3 className="font-semibold  text-[18px]  md:text-[20px]">
          Loan Wallet
        </h3>

        <TimeLineSelector
          selectedTimeLine={selectedTimeLine}
          setSelectedTimeLine={setSelectedTimeLine}
        />
      </div>

      <div>
        <LoanWallet />
      </div>
    </div>
  );
};

export default Wallets;
