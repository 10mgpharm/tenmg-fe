import React from "react";
import { Metadata } from "next";
import Navbar from "../_components/navbar";
import Herosection from "../_components/herosection";
import Financepage from "../_components/financepage";
import Testimonialsection from "../_components/testimonialsection";
import Footer from "../_components/footer";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Page() {
  return (
    <>
      <Navbar />
      <Herosection />
      <Financepage />
      <Testimonialsection />
      <Footer />
    </>
  );
}
