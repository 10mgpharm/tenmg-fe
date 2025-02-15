import type { Metadata } from "next";
import LoanLayout from "../_components/LoanLayout";
import LoanFooter from "../_components/LoanFooter";

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
        <LoanLayout name={""} logo={""}>{children}</LoanLayout>
        <LoanFooter />
      </main>
    </>
  );
}
