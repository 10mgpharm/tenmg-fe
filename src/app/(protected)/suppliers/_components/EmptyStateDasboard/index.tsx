"use client";

import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { useDisclosure } from "@chakra-ui/react";
import NoticeCard from "../NoticeCard";
import EmptyCard from "../EmptyCard";
import CompleteAccountModal from "../CompleteAccountModal";
import { CalendarIcon } from "lucide-react";
import order from "@public/assets/images/totalorder.svg";
import completedOrder from "@public/assets/images/target.svg";
import totalProducts from "@public/assets/images/products.svg";
import OverviewCard from "../OverviewCard/OverviewCard";
import requestClient from "@/lib/requestClient";
import { useEffect } from "react";

export const options = [
  { label: "This week", value: "This week" },
  { label: "This month", value: "This month" },
  { label: "Last year", value: "Last year" },
];

const EmptySupplierDashboard = () => {
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const { isOpen, onOpen, onClose } = useDisclosure();

  // To always refetch and update user session incase if business status has changed
  useEffect(() => {
    if (!token) return;
    const updateSession = async () => {
      const { data, status } = await requestClient({
        token,
      }).get("/account/profile");

      if (status === 200) {
        await session.update({
          ...session.data,
          user: {
            ...sessionData.user,
            completeProfile: data?.data?.completeProfile,
            businessStatus: data?.data?.businessStatus,
          },
        });
      }
    };

    updateSession();
  }, [token]);

  return (
    <div>
      <NoticeCard
        setOpen={onOpen}
        status={sessionData?.user?.businessStatus}
        url="/suppliers/settings/license_upload"
      />
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-2xl text-gray-600">Dashboard</h2>
          <div className="border rounded-md p-1 flex items-center gap-1.5 px-2 shadow-sm">
            <p className="text-sm text-gray-600">Today</p>
            <CalendarIcon className="w-4 h-4 text-gray-500 text-default-400 pointer-events-none flex-shrink-0" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-5">
          <OverviewCard
            title="Total Income"
            value="₦00.00"
            icon=""
            fromColor="from-[#53389E]"
            toColor="to-[#7F56D9]"
            image=""
          />
          <OverviewCard
            title="Total Orders"
            value="0"
            icon={order}
            fromColor="from-[#DC6803]"
            toColor="to-[#DC6803]"
            image=""
          />
          <OverviewCard
            title="Completed Orders"
            value="0"
            icon={completedOrder}
            fromColor="from-[#3E4784]"
            toColor="to-[#3E4784]"
            image=""
          />
          <OverviewCard
            title="Total Products"
            value="0"
            icon={totalProducts}
            fromColor="from-[#E31B54]"
            toColor="to-[#E31B54]"
            image=""
          />
        </div>
        <div className="flex gap-5 mt-4">
          <div className="flex-1 bg-white p-5 rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 font-semibold text-lg">
                Revenue Analytics
              </h3>
              <select className="border p-2 rounded-lg text-gray-500 outline-none">
                {options.map((option) => (
                  <option
                    key={option.label}
                    value={option.value}
                    className="text-gray-500"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <EmptyCard />
          </div>
          <div className="flex-1 bg-white p-5 rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 font-semibold text-lg">
                Stock Status
              </h3>
              <select className="border p-2 rounded-lg text-gray-500 outline-none">
                {options.map((option) => (
                  <option
                    key={option.label}
                    value={option.value}
                    className="text-gray-500"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <EmptyCard />
          </div>
        </div>
        <div className="mt-5">
          <div className="bg-white p-5 rounded-md">
            <h3 className="text-gray-600 font-semibold text-lg">
              Revenue Per Product
            </h3>
            <EmptyCard />
          </div>
        </div>
      </div>
      <CompleteAccountModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default EmptySupplierDashboard;
