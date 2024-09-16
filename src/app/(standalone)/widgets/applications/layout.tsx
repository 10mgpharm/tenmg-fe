import type { Metadata } from "next";
import config from "@/lib/config";
import LoanFooter from "../components/LoanFooter";
import LoanLayout from "../components/LoanLayout";

const appName = config.appName;

export const metadata: Metadata = {
  title: `Suppliers | ${appName}`,
  description: "10MG Supplier Dashboard",
};

export default async function SupplierLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="bg-blue-50 min-h-screen flex justify-center items-center gap-4 flex-col">
        <LoanLayout>{children}</LoanLayout>
        <LoanFooter />
      </main>
    </>
  );
}
