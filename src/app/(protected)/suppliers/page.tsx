"use client";

import NoticeCard from "./_components/NoticeCard"
import OverviewCard from "./_components/OverviewCard/OverviewCard"

import order from '@public/assets/images/totalorder.svg'
import completedOrder from '@public/assets/images/target.svg'
import totalProducts from '@public/assets/images/products.svg'
import totalPattern from '@public/assets/images/bgPattern.svg';
import orderPattern from '@public/assets/images/orderPattern.svg';
import completeOrder from '@public/assets/images/completePattern.svg';
import productPattern from '@public/assets/images/productpatterns.svg';
import CompleteAccountModal from "./_components/CompleteAccountModal"
import RevenueChart from "./_components/RevenueChart";
import StockChart from "./_components/StockChart";
import Orders from "./_components/orders";
import { useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { BusinessStatus } from "@/constants";

export const options = [
    { label: "Today", value: "Today" },
    { label: "This week", value: "This week" },
    { label: "Last week", value: "Last week" },
    { label: "Last month", value: "Last month" },
    { label: "Last year", value: "Last year" },
]

const Supplier = () => {
    const session = useSession();
    const sessionData = session.data as NextAuthUserSession;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const isVisible = sessionData?.user?.businessStatus !== BusinessStatus.VERIFIED;

    return (
        <div className="p-8">
            {isVisible && <NoticeCard
                setOpen={onOpen}
                status={sessionData?.user?.businessStatus}
                url="/suppliers/settings/license_upload"
            />}
            <div className="mt-5">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-2xl text-gray-600">Dashboard</h2>
                    <div className="">
                        {/* <DateInput
                        className="bg-white border rounded-md placeholder:bg-white"
                        // defaultValue={parseDate("2024-04-04")} 
                        // placeholderValue={new CalendarDate(1995, 11, 6)} 
                        
                        startContent={
                            <>
                            <CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            </>
                        }
                    /> */}
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-5">
                    <OverviewCard
                        title="Total Income"
                        value="₦00.00"
                        fromColor="from-[#53389E]"
                        toColor="to-[#7F56D9]"
                        image={totalPattern}
                    />
                    <OverviewCard
                        title="Total Orders"
                        value="0"
                        fromColor="from-[#DC6803]"
                        toColor="to-[#DC6803]"
                        icon={order}
                        image={orderPattern}
                    />
                    <OverviewCard
                        title="Completed Orders"
                        value="0"
                        fromColor="from-[#3E4784]"
                        toColor="to-[#3E4784]"
                        icon={completedOrder}
                        image={completeOrder}
                    />
                    <OverviewCard
                        title="Total Products"
                        value="0"
                        fromColor="from-[#E31B54]"
                        toColor="to-[#E31B54]"
                        icon={totalProducts}
                        image={productPattern}
                    />
                </div>
                <div className="flex gap-5 mt-4">
                    <div className="flex-1 bg-white p-5 rounded-md">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-600 font-semibold text-lg">Revenue Analytics</h3>
                            <select className="border p-2 rounded-lg text-gray-500 outline-none">
                                {
                                    options.map((option) => (
                                        <option key={option.label} value={option.value} className="text-gray-500">{option.label}</option>
                                    ))
                                }
                            </select>
                        </div>
                        {/* <EmptyCard /> */}
                        <RevenueChart />
                    </div>
                    <div className="flex-1 bg-white p-5 rounded-md">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-600 font-semibold text-lg">Stock Status</h3>
                            <select className="border p-2 rounded-lg text-gray-500 outline-none">
                                {
                                    options.map((option) => (
                                        <option key={option.label} value={option.value} className="text-gray-500">{option.label}</option>
                                    ))
                                }
                            </select>
                        </div>
                        {/* <EmptyCard /> */}
                        <StockChart />
                    </div>
                </div>
                <div className="mt-5">
                    <Orders />
                </div>
            </div>
            <CompleteAccountModal
                isOpen={isOpen}
                onClose={onClose}
            />
        </div>
    )
}

export default Supplier