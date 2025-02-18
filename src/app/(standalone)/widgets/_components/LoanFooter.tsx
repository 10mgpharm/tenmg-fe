import Image from "next/image";
import React from "react";
import TenmgLogo from "@public/icons/logo.svg";
import config from "@/lib/config";

const LoanFooter = () => {
  return (
    <div className="bg-gray-900 flex items-center text-gray-25 px-5 py-2 gap-1 rounded-xl">
      <p className="text-xs font-medium">Powered by {config.appName}</p>
      <Image
        className="w-[20px]"
        src={TenmgLogo}
        alt="tenmg logo"
        width={37.5}
        height={21}
      />
    </div>
  );
};

export default LoanFooter;
