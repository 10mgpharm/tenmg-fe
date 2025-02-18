import { Avatar, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

interface Props {
  name: string;
  logo: string;
  title?: string;
  navigateBackAction?: () => void;
}

const LoanHeader = ({ name, logo, title, navigateBackAction }: Props) => {
  // /assets/images/tuyii_icon.png

  return (
    <div className="bg-gray-25 flex items-center justify-between px-5 py-3 gap-1 rounded-tl-xl rounded-tr-xl border-b border-r-gray-200">
      {navigateBackAction ? <FaArrowLeft onClick={navigateBackAction} className="cursor-pointer"/> : <div></div>}
      <div className="flex items-center gap-2">
        {!title ? (
          <>
            <Avatar size='sm' src={logo} name={name} />
            <p className="text-lg font-medium">{name}</p>{" "}
          </>
        ) : (
          <Text fontSize="md" fontWeight={'bold'}>
            {title}
          </Text>
        )}
      </div>

      <IoClose
        className="text-xl text-blue-500 cursor-pointer"
        onClick={() => {
          const confirmed = confirm("Are you sure you want to close this window?")
          if (confirmed) {
            window.close()
          }
          return false
        }}
      />
    </div>
  );
};

export default LoanHeader;
