import { NextAuthUserSession } from "@/types";
import EmptyStateDashboard from "./_components/EmptyStateDashboard";
import VendorDashboard from "./_components/VendorDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BusinessStatus } from "@/constants";

const Vendor = async () => {
  const data: NextAuthUserSession | null = await getServerSession(authOptions);
  return (
    <div className="p-8">
      {[
        BusinessStatus.PENDING_VERIFICATION,
        BusinessStatus.PENDING_APPROVAL,
        BusinessStatus.REJECTED,
        BusinessStatus.SUSPENDED,
        BusinessStatus.BANNED,
      ].includes(data?.user?.businessStatus) ?
        (
        <EmptyStateDashboard />
      ) : (
        <VendorDashboard />
      )}
    </div>
  );
};

export default Vendor;
