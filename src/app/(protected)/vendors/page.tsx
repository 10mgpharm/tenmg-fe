import { NextAuthUserSession } from "@/types";
import EmptyStateDashboard from "./components/EmptyStateDashboard";
import VendorDashboard from "./components/VendorDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BusinessStatus } from "@/constants";

const Vendor = async () => {
  const data: NextAuthUserSession | null = await getServerSession(authOptions);
  return (
    <div className="p-8">
      {data?.user?.businessStatus === BusinessStatus.PENDING_VERIFICATION ? (
        <EmptyStateDashboard />
      ) : (
        <VendorDashboard />
      )}
    </div>
  );
};

export default Vendor;
