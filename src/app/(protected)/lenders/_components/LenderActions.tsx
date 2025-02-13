import { Button } from "@chakra-ui/react";
import React from "react";

const LenderActions = () => {
  return (
    <div className="flex justify-between gap-3 my-6">
      <Button variant="outline" w={"full"} whiteSpace="normal">
        Deposit Funds
      </Button>
      <Button variant="outline" w={"full"} whiteSpace="normal">
        Withdraw Funds
      </Button>
      <Button variant="outline" w={"full"} whiteSpace="normal">
        Generate Statement
      </Button>
    </div>
  );
};

export default LenderActions;
