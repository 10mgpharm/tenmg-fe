import { Inter } from "next/font/google";
import React from "react";
import InterestConfigSegment from "../../_components/InterestConfigSegment";
import LoanConfigSegment from "../../_components/LoanConfigSegment";

const LoanConfig = () => {
  return (
    <div className="space-y-10">
      <InterestConfigSegment />

      <LoanConfigSegment />
    </div>
  );
};

export default LoanConfig;
