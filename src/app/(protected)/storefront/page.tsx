"use client";
import { signOut, useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import Carousel from "./_components/Carousel";

const StoreFront = () => {
  const session = useSession();
  const data = session.data as NextAuthUserSession;

  return (
    <div className="p-8 flex justify-center items-center">
      <div>
        <Carousel />
      </div>
    </div>
  );
};

export default StoreFront;
