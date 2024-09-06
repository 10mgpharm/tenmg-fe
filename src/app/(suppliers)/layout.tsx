import type { Metadata } from "next";
import TopNavBar from "./components/TopNavBar";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Suppliers | 10MG",
  description: "10MG Supplier dashboard",
};

export default function SupplierLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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