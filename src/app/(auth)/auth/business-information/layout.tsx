import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Information | 10MG",
  description: "10MG Business Information",
};

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
