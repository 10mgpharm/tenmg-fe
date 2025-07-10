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
          : response?.message === "Loan is already paid"
          ? "🎉 Congratulations! You have successfully paid your loan in full. You can now close this window."
          : response?.message || "Something went wrong. Please try again.";

      return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            {response?.message === "Loan is already paid" && (
              <div className="text-6xl mb-4">🎉</div>
            )}
            <h1 className="text-2xl font-bold mb-4 text-gray-800">{message}</h1>
            {response?.message === "Loan is already paid" && (
              <button
                onClick={() => window.close()}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Close Window
              </button>
            )}
          </div>
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
