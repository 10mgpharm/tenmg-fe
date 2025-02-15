import type { Metadata } from "next";
import { Suspense } from "react";
import LoadingScreen from "./widgets/applications/_components/LoadingScreen";

export const metadata: Metadata = {
    title: "10MG Credit | 10MG",
};

export default function StandaloneLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense
            fallback={
                <div className="grid place-items-center h-screen w-screen">
                    <LoadingScreen message="Initializing Application..." />
                </div>
            }>
            {children}
        </Suspense>
    )
}
