import { signOut, useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import {
  AvatarBadge,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Grid,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@chakra-ui/react";
import NoticeCard from "../suppliers/components/NoticeCard";
import OverviewCard from "./components/OverviewCard";
import SideCard from "./components/SideCard";
import { ArrowDown } from "lucide-react";
import EmptyCard from "../suppliers/components/EmptyCard";
import CompleteAccountModal from "./components/CompleteAccountModal";
import EmptyStateDashboard from "./components/EmptyStateDashboard";
import VendorDashboard from "./components/VendorDashboard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const options = [
  { label: "12 months", value: "Today" },
  { label: "3 months", value: "This week" },
  { label: "30 days", value: "Last week" },
  { label: "7 days", value: "Last month" },
  { label: "24 hours", value: "Last year" },
];

// interface IVendorDashboard {
//   totalCustomers: number;
//   applications: number;
//   creditVoucher: string;
//   txnHistoryEval: number;
//   apiCalls: number;
//   balance: number;
// }

const Vendor = async () => {
  const data: NextAuthUserSession | null = await getServerSession(authOptions);

  return (
    <div className="p-8">
      {data?.user?.businessStatus === "PENDING_APPROVAL" ? (
        <VendorDashboard />
      ) : (
        <EmptyStateDashboard />
      )}
    </div>
  );
};

export default Vendor;
