import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ForgetPassword Email Verification | 10MG",
  description: "10MG Verification",
};

export default function SignUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
