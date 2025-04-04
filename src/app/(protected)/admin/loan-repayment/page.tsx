import { Text } from "@chakra-ui/react";
import React from "react";
import DataTable from "./_components/table";

const LoanRepayment = () => {
  return (
    <div className="p-8">
      <Text fontSize={"1.3rem"} fontWeight={700} color={"gray.900"}>
        Loan Repayments
      </Text>

      <div>
        <DataTable />
      </div>
    </div>
  );
};

export default LoanRepayment;
