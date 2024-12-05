import { NextAuthUserSession } from "@/types";
import EmptyStateDashboard from "./components/EmptyStateDashboard";
import VendorDashboard from "./components/VendorDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const Vendor = async () => {
  const data: NextAuthUserSession | null = await getServerSession(authOptions);

  return (
    <div className="p-8">
      {data?.user?.businessStatus === "PENDING_APPROVAL" ? (
        <EmptyStateDashboard />
      ) : (
        <VendorDashboard />
      )}
    </div>
  );
};

export default Vendor;
