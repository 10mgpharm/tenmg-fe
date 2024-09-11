import type { Metadata } from "next";
import TopNavBar from "./components/TopNavBar";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";
import config from "@/lib/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

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
  if (!session) redirect('/auth/signin');

  return(
    <>
        <TopNavBar />
        <SideBar />
        <main className="lg:pl-72 lg:pt-[98px] bg-[#F9FAFB] min-h-screen">
          {children}
          <Footer />
        </main>
    </>
  );
}