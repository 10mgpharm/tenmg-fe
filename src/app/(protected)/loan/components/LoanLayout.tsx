import React from "react";
import LoanHeader from "./LoanHeader";

interface LoanLayoutProps {
  children: React.ReactNode;
}

const LoanLayout = ({ children }: LoanLayoutProps) => {
  return (
    <div className="w-full max-w-[300px] lg:max-w-[500px] bg-gray-25 rounded-xl">
      <LoanHeader />
      <div className="w-full p-8">{children}</div>
    </div>
  );
};

export default LoanLayout;
