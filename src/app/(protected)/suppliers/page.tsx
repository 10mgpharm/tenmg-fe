import { NextAuthUserSession } from "@/types";
import EmptySupplierDashboard from "./_components/EmptyStateDasboard";
import Supplier from "./SupplierDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BusinessStatus } from "@/constants";

const SupplierPage = async () => {
  const data: NextAuthUserSession | null = await getServerSession(authOptions);
  return (
    <div className="p-8">
      {[
        BusinessStatus.PENDING_VERIFICATION,
        BusinessStatus.PENDING_APPROVAL,
        BusinessStatus.REJECTED,
        BusinessStatus.LICENSE_EXPIRED,
        BusinessStatus.SUSPENDED,
        BusinessStatus.BANNED,
      ].includes(data?.user?.businessStatus) ?
        (
        <EmptySupplierDashboard />
      ) : (
        <Supplier />
      )}
    </div>
  );
};

export default SupplierPage;
