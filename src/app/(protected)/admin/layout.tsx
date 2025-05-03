import type { Metadata } from "next";
import config from "@/lib/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NextAuthUserSession } from "@/types";
import TopNavBar from "../suppliers/_components/TopNavBar";
import Footer from "../suppliers/_components/Footer";
import SideBar from "./_components/SideBar";
import AdminLayoutClient from "./_components/AdminClientLayout";

const appName = config.appName;

export const metadata: Metadata = {
  title: `Admin | ${appName}`,
  description: "10MG Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: NextAuthUserSession = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  if (session.user?.entityType !== "ADMIN") redirect("/");

  return (
    <AdminLayoutClient>{children}</AdminLayoutClient>
  );
}
