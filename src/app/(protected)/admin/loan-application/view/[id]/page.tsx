"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import LoanApplicationView from "@/app/(protected)/_components/loanApplication/LoanApplicationView";

const Page = ({ params }: { params: { id: string } }) => {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  if (!token) {
    return null;
  }

  return (
    <LoanApplicationView
      id={params.id}
      sessionToken={token}
      userRole="admin"
      backUrl="/admin/loan-application"
    />
  );
};

export default Page;
