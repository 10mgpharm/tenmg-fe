import { NextAuthUserSession } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StoreFrontPharmacy from "./_components/StorefrontPharmacy";

const StoreFront = async () => {
  const data: NextAuthUserSession | null = await getServerSession(authOptions);
  return (
    <div>
      <StoreFrontPharmacy businessStatus={data?.user?.businessStatus} />
    </div>
  );
};

export default StoreFront;
