"use client";

import LoanDetailView from "@/app/(protected)/_components/LoanDetailView";
import { ColumnsRepaymentFN } from "@/app/(protected)/_components/LoanRepayColumns";
import { extendTheme } from "@chakra-ui/react";

const Page = ({ params }: { params: { id: string } }) => {
  const theme = extendTheme({
    components: {
      Progress: {
        baseStyle: {
          track: {
            borderRadius: "10px",
          },
          filledTrack: {
            bg: "#F89422",
            track: {
              borderRadius: "0px",
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
            },
          },
        },
      },
    },
  });

  return (
    <LoanDetailView
      id={params.id}
      endpoint="admin/loan/detail"
      title="Loan Information"
      subtitle="At a glance summary of the loan."
      columnsFn={ColumnsRepaymentFN}
      theme={theme}
      emptyStateHeading="No repayment history Yet"
      emptyStateContent="You currently have no repayment history. All repayment history will appear here."
    />
  );
};

export default Page;
