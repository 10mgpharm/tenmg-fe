import config from "@/lib/config";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextAuthUserSession } from "@/types";
import SupplierClientsideLayout from "./_components/SupplierClientsideLayout";

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
  const session: NextAuthUserSession = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  return (
    <SupplierClientsideLayout session={session} >{children} </SupplierClientsideLayout>
  );
}