import type { Metadata } from "next";
import LoanLayout from "../components/LoanLayout";
import LoanFooter from "../components/LoanFooter";

export const metadata: Metadata = {
  title: "10MG Credit | Offers",
};

export default function OffersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {" "}
      <main className="bg-blue-50 min-h-screen flex justify-center items-center gap-4 flex-col">
        <LoanLayout>{children}</LoanLayout>
        <LoanFooter />
      </main>
    </>
  );
}
