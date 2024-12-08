import type { Metadata } from "next";
import LoanFooter from "../_components/LoanFooter";

export const metadata: Metadata = {
  title: "10MG Credit | Repayments",
};

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-300 min-h-screen flex justify-center items-center gap-4 flex-col">
      {children}
      <LoanFooter />
    </div>
  );
}
