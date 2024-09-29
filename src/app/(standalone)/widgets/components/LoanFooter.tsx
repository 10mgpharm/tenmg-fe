import Image from "next/image";
import React from "react";
import TenmgLogo from "@public/icons/logo.svg";

const LoanFooter = () => {
  return (
    <div className="bg-gray-900 flex items-center text-gray-25 px-3 py-2 gap-1 rounded-xl">
      <p className="text-sm font-medium">Powered by 10MG Health</p>
      <Image
        className="w-[37.5px]"
        src={TenmgLogo}
        alt="tenmg logo"
        width={37.5}
        height={21}
      />
    </div>
  );
};

export default LoanFooter;
