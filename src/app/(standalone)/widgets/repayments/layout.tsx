import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "10MG Credit | Repayments",
};

export default function SignInLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>
}
