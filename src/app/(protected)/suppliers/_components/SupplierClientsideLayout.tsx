'use client'
import Footer from './Footer';
import SideBar from './SideBar'
import TopNavBar from './TopNavBar'
import React, { useState } from 'react'
import { redirect } from 'next/navigation';

export default function SupplierClientsideLayout({ session, children }: { session: any, children: React.ReactNode }) {
  // const session: NextAuthUserSession = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <TopNavBar 
        route="/suppliers/notifications"
        onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
      />
      <SideBar 
      businessStatus={session?.user?.businessStatus} 
      isOpen={isSidebarOpen} 
      onClose={() => setIsSidebarOpen(false)} 
      />
      <main className="lg:pl-72 lg:pt-[98px] bg-[#F9FAFB]">
        <div className="min-h-[calc(100vh-150px)]">
          {children}
        </div>
        <Footer />
      </main>
    </>
  )
}
