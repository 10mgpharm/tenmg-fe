import React from "react";
import LoanHeader from "./LoanHeader";

interface LoanLayoutProps {
  children: React.ReactNode;
  type?: string;
}

const LoanLayout = ({ children, type }: LoanLayoutProps) => {
  return (
    <div className="w-full max-w-[300px] lg:max-w-[500px] bg-gray-25 rounded-xl">
      <LoanHeader type={type} />
      <div className="w-full p-8">{children}</div>
    </div>
  );
};

export default LoanLayout;
