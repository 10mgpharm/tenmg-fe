import { Avatar } from "@chakra-ui/react";
import React from "react";

const LoanProfile = () => {
  return (
    <div className="flex gap-3 items-center">
      <Avatar bg="primary.500" name="Ahmed Olanrewaju" />
      <div>
        <h4 className="text-gray-700 text-xl">Ahmed Olanrewaju</h4>
        <p className="text-gray-500 text-sm">ahmed@bubblespharm.com</p>
      </div>
    </div>
  );
};

export default LoanProfile;
