import type { Metadata } from "next";
import config from "@/lib/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NextAuthUserSession } from "@/types";
import Footer from "../_components/Footer";

const appName = config.appName;

export const metadata: Metadata = {
  title: `Storefront | ${appName}`,
  description: "10MG Storefront",
};

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: NextAuthUserSession = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  return (
    <div className="max-w-screen-2xl mx-auto">
      <main className="pt-[80px] lg:pt-[98px] bg-[#F9FAFB]">
        <div className="min-h-[calc(100vh-150px)]">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
