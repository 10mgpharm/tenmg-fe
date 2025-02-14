import { Button } from "@chakra-ui/react";
import React from "react";

interface LenderActionsProps {
  onOpenDeposit?: () => void;
  onOpenWithdraw?: () => void;
  onOpenGenerateStatement?: () => void;
}

const LenderActions = ({
  onOpenDeposit,
  onOpenWithdraw,
  onOpenGenerateStatement,
}: LenderActionsProps) => {
  return (
    <div className="flex justify-between gap-3 my-6">
      <Button
        variant="outline"
        w={"full"}
        whiteSpace="normal"
        fontSize={{ base: "xs", md: "md" }}
        onClick={() => onOpenDeposit()}
      >
        Deposit Funds
      </Button>
      <Button
        variant="outline"
        w={"full"}
        whiteSpace="normal"
        fontSize={{ base: "xs", md: "md" }}
        onClick={() => onOpenWithdraw()}
      >
        Withdraw Funds
      </Button>
      <Button
        variant="outline"
        w={"full"}
        whiteSpace="normal"
        fontSize={{ base: "xs", md: "md" }}
        onClick={() => onOpenGenerateStatement()}
      >
        Generate Statement
      </Button>
    </div>
  );
};

export default LenderActions;
