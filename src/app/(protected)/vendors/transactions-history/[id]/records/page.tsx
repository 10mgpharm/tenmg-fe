"use client";

import { useMemo } from "react";

import { ColumnsFN } from "../../_components/trnascationtable";
import { DataTable } from "@/app/(protected)/_components/AllTransactionsData";


const TransactionRecord = ({ params }: { params: { id: string } }) => {
  const columns = useMemo(() => ColumnsFN(), []);
  
  return (
    <DataTable
      endpoint="vendor/txn_history/view"
      requestParams={{ transactionHistoryId: parseInt(params.id, 10) }}
      columns={columns}
    />
  );
};

export default TransactionRecord;
