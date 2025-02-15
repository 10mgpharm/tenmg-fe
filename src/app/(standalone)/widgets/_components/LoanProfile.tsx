import { Avatar } from "@chakra-ui/react";
import React from "react";

interface Props { name: string; email: string; }

const LoanProfile = ({ name, email }: Props) => {
  return (
    <div className="flex gap-3 items-center">
      <Avatar bg="primary.500" name={name} size={'sm'} />
      <div>
        <h4 className="text-gray-700 text-sm">{name}</h4>
        <p className="text-gray-500 text-xs">{email}</p>
      </div>
    </div>
  );
};

export default LoanProfile;
