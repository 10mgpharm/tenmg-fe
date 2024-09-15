import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "10MG Credit | 10MG",
};

export default function StandaloneLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // validate external widget token here

    return (
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
    )
}
