import Image from "next/image";
import React from "react";
import TenmgLogo from "@public/assets/images/tenmg_logo.png";
import { FaArrowLeft } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const LoanHeader = () => {
  return (
    <div className="bg-gray-25 flex items-center justify-between px-5 py-3 gap-1 rounded-tl-xl rounded-tr-xl border-b border-r-gray-200">
      <FaArrowLeft />
      <div className="flex items-center gap-2">
        <Image
          className="w-[37.5px]"
          src={TenmgLogo}
          alt="tenmg logo"
          width={37.5}
          height={21}
        />
        <p className="text-sm font-medium">Powered by 10MG Health</p>
      </div>

      <IoClose className="text-xl text-blue-500" />
    </div>
  );
};

export default LoanHeader;
