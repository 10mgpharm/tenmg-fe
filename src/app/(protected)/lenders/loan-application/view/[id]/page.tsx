"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import LoanApplicationView from "@/app/(protected)/_components/loanApplication/LoanApplicationView";

export default function LoanViewPage({ params }: { params: { id: string } }) {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const sessionToken = sessionData?.user?.token;

  if (!sessionToken) {
    return null;
  }

  return (
    <LoanApplicationView
      id={params.id}
      sessionToken={sessionToken}
      userRole="lender"
      backUrl="/lenders/loan-application"
    />
  );
}
