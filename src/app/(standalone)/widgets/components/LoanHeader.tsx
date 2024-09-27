import { Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

interface ILoanApplication {
  name: string;
  logo: string;
  type?: string;
}

const LoanHeader = ({ type = "business" }) => {
  const data: ILoanApplication = {
    name: "Tuyil Pharmaceutical Limtied",
    logo: "/assets/images/tuyii_icon.png",
  };

  return (
    <div className="bg-gray-25 flex items-center justify-between px-5 py-3 gap-1 rounded-tl-xl rounded-tr-xl border-b border-r-gray-200">
      <FaArrowLeft />
      <div className="flex items-center gap-2">
        {type === "business" ? (
          <>
            <Image
              className="w-[26.4px]"
              src={data.logo}
              alt="tenmg logo"
              width={26.4}
              height={24}
            />
            <p className="text-sm font-medium">{data.name}</p>{" "}
          </>
        ) : (
          <Text fontSize="lg" color="gray.500">
            {type}
          </Text>
        )}
      </div>

      <IoClose className="text-xl text-blue-500" />
    </div>
  );
};

export default LoanHeader;
