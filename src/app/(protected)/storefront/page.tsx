"use client";
import { signOut, useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import Carousel from "./_components/Carousel";
import ProductField from "./_components/ProductField";

const StoreFront = () => {
  const session = useSession();
  const data = session.data as NextAuthUserSession;

  const productTitle = [
    "FREQUENTLY BOUGHT ITEMS",
    "CHRONIC CONDITIONS",
    "VACCINE & SPECIAL MEDICATIONS",
    "REPRODUCTIVE HEALTH & FERTILITY SOLUTIONS",
    "ASTHMA & ALLERGIES",
    "HOSPITALS AND CLINICS",
  ];

  return (
    <div className="">
      <div className="p-8 px-6 md:px-20 max-w-screen-2xl mx-auto">
        <Carousel />
      </div>
      {productTitle.map((title, i) => (
        <ProductField key={i} title={title} />
      ))}
    </div>
  );
};

export default StoreFront;
