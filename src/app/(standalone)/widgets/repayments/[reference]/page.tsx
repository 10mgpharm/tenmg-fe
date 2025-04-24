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
      <>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">
            Invalid application link provided
          </h1>
        </div>
      </>
    );
  }

  try {
    const response: ResponseDto<RepaymentWidgetConfig> =
      await getRepaymentDetails(token, reference);

    if (!response || response.status === "error") {
      return (
        <>
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">
              {response?.message || "An error occurred"}
            </h1>
          </div>
        </>
      );
    }

    const data: RepaymentWidgetConfig = response.data;

    console.log("data", data);

    if (!data || !data.vendor || !data.customer || !data.application) {
      return (
        <>
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Invalid repayment data</h1>
          </div>
        </>
      );
    }

    const business: BusinessDto = data.vendor;
    const customer: CustomerDto = data.customer;
    const application: ApplicationDto = data.application;

    return (
      <RepaymentWidget
        business={business}
        customer={customer}
        application={application}
        data={data}
        reference={reference}
        token={token}
      />
    );
  } catch (error) {
    console.error("Error loading repayment details:", error);
    return (
      <>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">
            Failed to load repayment details
          </h1>
        </div>
      </>
    );
  }
}
