import type { Metadata } from "next";
import config from "@/lib/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NextAuthUserSession } from "@/types";
import TopNavBar from "../suppliers/components/TopNavBar";
import Footer from "../suppliers/components/Footer";
import SideBar from "./components/SideBar";

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
//   if (!session) redirect('/auth/signin');

//   if (session.user?.entityType !== 'ADMIN') redirect('/');

  return(
    <>
      <TopNavBar />
      <SideBar />
      <main className="lg:pl-72 lg:pt-[98px] bg-[#F9FAFB]">
        <div className="min-h-[calc(100vh-150px)]">
        {children}
        </div>
        <Footer />
      </main>
    </>
  );
}