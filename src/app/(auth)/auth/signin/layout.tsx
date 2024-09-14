import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | 10MG",
};

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
