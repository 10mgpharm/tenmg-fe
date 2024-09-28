"use client";
import { signOut, useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { Text } from "@chakra-ui/react";
import { redirect } from "next/navigation";

const Vendor = () => {
  const session = useSession();
  const data = session.data as NextAuthUserSession;

  return (
    <div className="p-8 flex justify-center items-center h-screen">
      <div>
        <Text color="gray.700" fontSize="xl">
          Welcome {data?.user?.name}
        </Text>
        <button
          className="block px-3 py-1 text-sm leading-6 text-red-600 data-[focus]:bg-red-50"
          onClick={async () => {
            await signOut();
            redirect('/');
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Vendor;
