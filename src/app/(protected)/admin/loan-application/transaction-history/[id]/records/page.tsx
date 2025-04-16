"use client";

import { useMemo } from "react";
import { DataTable } from "@/app/(protected)/_components/AllTransactionsData";
import { ColumnsFN } from "@/app/(protected)/_components/trnascationtable";

const TransactionRecord = ({ params }: { params: { id: string } }) => {
  const columns = useMemo(() => ColumnsFN(), []);

  return (
    <DataTable
      endpoint="admin/txn_history/view"
      requestParams={{ transactionHistoryId: parseInt(params.id, 10) }}
      columns={columns}
    />
  );
};

export default TransactionRecord;
