import { NextAuthUserSession } from "@/types";
import EmptyStateDashboard from "../vendors/_components/EmptyStateDashboard";
import VendorDashboard from "../vendors/_components/VendorDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BusinessStatus } from "@/constants";
// import LenderDashboard from "./_components/LenderDashboard";
import EmptyDashboard from "./_components/EmptyDashboard";
import LenderDashboard from "./_components/settings/LenderDashboard";

const Vendor = async () => {
  const data: NextAuthUserSession | null = await getServerSession(authOptions);
  return (
    <div className="p-4 md:p-8">
      {[
        BusinessStatus.PENDING_VERIFICATION,
        BusinessStatus.PENDING_APPROVAL,
        BusinessStatus.REJECTED,
        BusinessStatus.LICENSE_EXPIRED,
        BusinessStatus.SUSPENDED,
        BusinessStatus.BANNED,
      ].includes(data?.user?.businessStatus) ? (
        <EmptyDashboard sessionData={data} />
      ) : (
        <LenderDashboard sessionData={data} />
      )}
    </div>
  );
};

export default Vendor;