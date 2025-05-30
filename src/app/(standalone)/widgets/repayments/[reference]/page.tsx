import { Metadata } from "next";
import React from "react";

import {
  ApplicationDto,
  BusinessDto,
  CustomerDto,
  RepaymentWidgetConfig,
  ResponseDto,
} from "@/types";
import RepaymentWidget from "../_components/RepaymentWidget";
import { getRepaymentDetails } from "../actions";

export const metadata: Metadata = {
  title: "Repayment",
};

interface PageProps {
  params: {
    reference: string;
  };
  searchParams: {
    token: string | null | undefined;
  };
}

export default async function Page({
  params: { reference },
  searchParams: { token },
}: PageProps) {
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Invalid repayment link provided</h1>
      </div>
    );
  }

  try {
    const response: ResponseDto<RepaymentWidgetConfig> = await getRepaymentDetails(token, reference);

    if (!response || response.status === "error") {
      const message =
        response?.message === "Unauthenticated."
          ? "Invalid Link"
          : response?.message || "Something went wrong. Please try again.";

      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">{message}</h1>
        </div>
      );
    }

    const { vendor: business, customer, application } = response.data;

    return (
      <RepaymentWidget
        business={business}
        customer={customer}
        application={application}
        data={response.data}
        reference={reference}
        token={token}
      />
    );
  } catch (error) {
    console.error("Failed to load repayment details:", error);
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">
          Error retrieving repayment details. Please refresh or try again later.
        </h1>
      </div>
    );
  }
}
