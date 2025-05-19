import type { Metadata } from "next";
import TopNavBar from "../suppliers/_components/TopNavBar";
import SideBar from "./_components/SideBar";
import Footer from "../suppliers/_components/Footer";
import config from "@/lib/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NextAuthUserSession } from "@/types";
import VendorClientLayout from "./_components/VendorClientLayout";

const appName = config.appName;

export const metadata: Metadata = {
  title: `Vendor | ${appName}`,
  description: "10MG Vendor Dashboard",
};

export default async function VendorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: NextAuthUserSession = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  if (session.user?.entityType !== "VENDOR") redirect("/");

  return (
    <>
      <VendorClientLayout businessStatus={session?.user?.businessStatus}>
        {children}
      </VendorClientLayout>
    </>
  );
}
