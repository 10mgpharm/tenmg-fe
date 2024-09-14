import type { Metadata } from "next";
import config from "@/lib/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LoanFooter from "./components/LoanFooter";
import LoanHeader from "./components/LoanHeader";
import LoanLayout from "./components/LoanLayout";

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
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  return (
    <>
      <main className="bg-blue-50 min-h-screen flex justify-center items-center gap-4 flex-col">
        <LoanLayout>{children}</LoanLayout>
        <LoanFooter />
      </main>
    </>
  );
}
