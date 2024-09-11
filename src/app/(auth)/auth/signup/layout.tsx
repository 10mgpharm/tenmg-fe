import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Supplier/Pharmacy | 10MG",
  description: "10MG Sign Up",
};

export default function SignUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
