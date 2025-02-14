import React from "react";
import OperationLayout from "./OperationLayout";

const DepositFunds = () => {
  return (
    <OperationLayout
      isOpen={true}
      onClose={() => console.log("Close")}
      title="Deposit Funds"
      description="Enter an amount and a destination to save to"
    >
      <form></form>
    </OperationLayout>
  );
};

export default DepositFunds;
