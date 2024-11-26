import React from "react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { NextAuthUserSession } from "@/types";
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: "Home",
};

export default async function Page() {
  const headersList = headers();
  const referer = headersList.get('referer');

  let action = 'signin';
  if (referer && referer.includes('/auth/signin')) {
    action = 'signin';
  } else if (referer && referer.includes('/auth/signup')) {
    action = 'signup';
  }

  const from = referer ? encodeURIComponent(referer) : `/auth/${action}`;

  const session: NextAuthUserSession | null = await getServerSession(
    authOptions
  );

  if (!session?.user?.email) redirect("/auth/signin");

  if (
    session?.user?.account?.provider === "credentials" &&
    !session?.user?.emailVerifiedAt
  )
    redirect(`/auth/verification?token=${session?.user?.token}&action=${action}&from=${from}`);

  if (!session?.user?.completeProfile)
    redirect(`/auth/business-information?token=${session?.user?.token}&action=${action}&from=${from}`);

  switch (session.user?.entityType) {
    case "SUPPLIER":
      redirect("/suppliers");
    case "VENDOR":
      redirect("/vendors");
    case "ADMIN":
      redirect("/admin");
    case "CUSTOMER_PHARMACY":
      redirect("/storefront");
    default:
      break;
  }

  return <></>;
}
