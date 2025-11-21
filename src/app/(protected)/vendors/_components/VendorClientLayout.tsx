"use client";

import { useState } from "react";
import TopNavBar from "../../suppliers/_components/TopNavBar";
import Footer from "../../suppliers/_components/Footer";
import SideBar from "./SideBar";

export default function VendorClientLayout({
  children,
  businessStatus,
}: {
  children: React.ReactNode;
  businessStatus: string;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
     
      <SideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        businessStatus={businessStatus}
      />
      <main className="relative lg:pl-72   bg-[#F9FAFB]">
         <TopNavBar
        route="/vendors/notifications"
        onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
      />
        <div className="min-h-[calc(100vh-150px)] lg:pt-28">{children}</div>
        <Footer />
      </main>
    </>
  );
}
