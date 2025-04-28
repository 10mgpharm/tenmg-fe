import type { Metadata } from "next";
import LoanFooter from "../_components/LoanFooter";
import { Suspense } from "react";
import LoadingScreen from "../applications/_components/LoadingScreen";

export const metadata: Metadata = {
  title: "10MG Credit | Repayments",
};

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center h-screen w-screen">
          <LoadingScreen message="Initializing Repayment..." />
        </div>
      }
    >
      <div className="bg-gray-300 min-h-screen flex justify-center items-center gap-4 flex-col">
        {children}
      </div>
    </Suspense>
  );
}
