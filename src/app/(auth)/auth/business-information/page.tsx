import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Metadata } from "next";
import { NextAuthUserSession } from "@/types";
import BusinessInformationForm from "../../components/BusinessInformationForm";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Business Information | 10MG",
  description: "10MG Business Information",
};

export default async function Page() {
  const session: NextAuthUserSession | null = await getServerSession(
    authOptions
  );

  if (!session) redirect("/");

  return <BusinessInformationForm sessionData={session} />;
}
