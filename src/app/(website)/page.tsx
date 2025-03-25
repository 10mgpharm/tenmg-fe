import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Herosection from "./_components/herosection";
import Financepage from "./_components/financepage";
import Testimonialsection from "./_components/testimonialsection";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";
import FAQSection from "./_components/faq";
import FAQ from "./_components/faq";

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
