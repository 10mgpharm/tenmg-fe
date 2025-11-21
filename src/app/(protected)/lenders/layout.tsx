import type { Metadata } from "next";
import TopNavBar from "../suppliers/_components/TopNavBar";
import SideBar from "./_components/SideBar";
import Footer from "../suppliers/_components/Footer";
import config from "@/lib/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NextAuthUserSession } from "@/types";
import MobileNavBar from "./_components/MobileNavBar";

const appName = config.appName;

export const metadata: Metadata = {
  title: `Lender | ${appName}`,
  description: "10MG Lender Dashboard",
};

export default async function VendorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: NextAuthUserSession = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  if (session.user?.entityType !== "LENDER") redirect("/");


  return (
    <>
     
      <SideBar businessStatus={session?.user?.businessStatus} />
      <main className="lg:pl-72   bg-[#F9FAFB]">
           <TopNavBar route="/lenders/notifications" />
        <div className="min-h-[calc(100vh-150px)] lg:pt-28 pt-4">
        
          {children}
        </div>
        <Footer />
      </main>
      <MobileNavBar />
    </>
  );
}
