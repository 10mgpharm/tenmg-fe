"use client";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import Carousel from "./_components/Carousel";
import ProductField from "./_components/ProductField";
import { useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";

const StoreFront = () => {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const productTitle = [
    "FREQUENTLY BOUGHT ITEMS",
    "CHRONIC CONDITIONS",
    "VACCINE & SPECIAL MEDICATIONS",
    "REPRODUCTIVE HEALTH & FERTILITY SOLUTIONS",
    "ASTHMA & ALLERGIES",
    "HOSPITALS AND CLINICS",
  ];

  // console.log(userData?.user?.token);
  //  const response = await requestClient().post("/storefront"

  //   const response = await requestClient({token: sessionData.user.token}).patch(
  //     "account/settings/profile",
  //     {
  //         ...value
  //     }
  // )
  const [storeFrontData, setStoreFrontData] = useState([]);
  useEffect(() => {
    const fetchStoreFront = async () => {
      try {
        const data = await requestClient({ token: userData?.user?.token }).get("/storefront");
        // console.log(data);
        setStoreFrontData(data?.data?.data);
      } catch (e) {
        console.log(e)
      }
    }
    fetchStoreFront();
  }, [userData?.user?.token])

  // console.log("storeFrontData", storeFrontData);

  return (
    <div className="">
      <div className="p-8 px-6 md:px-20 max-w-screen-2xl mx-auto">
        <Carousel />
      </div>
      {storeFrontData?.map((category, i) => (
        category?.products?.length > 0 && <ProductField key={i} category={category} />
      ))}
    </div>
  );
};

export default StoreFront;
