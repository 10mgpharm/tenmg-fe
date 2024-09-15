"use client";

import NoticeCard from "./components/NoticeCard"
import OverviewCard from "./components/OverviewCard/OverviewCard"

import order from '@/assets/Images/total order.svg'
import completedOrder from '@/assets/Images/target.svg'
import totalProducts from '@/assets/Images/products.svg'
import totalPattern from '@/assets/Images/bgPattern.svg';
import orderPattern from '@/assets/Images/orderPattern.svg';
import completeOrder from '@/assets/Images/completePattern.svg';
import productPattern from '@/assets/Images/productpatterns.svg';
import CompleteAccountModal from "./components/CompleteAccountModal"
import RevenueChart from "./components/RevenueChart";
import StockChart from "./components/StockChart";
import Orders from "./components/orders";
import { useDisclosure } from "@chakra-ui/react";

export const options = [
    {label: "Today", value: "Today"},
    {label: "This week", value: "This week"},
    {label: "Last week", value: "Last week"},
    {label: "Last month", value: "Last month"},
    {label: "Last year", value: "Last year"},
]

const Supplier = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
    <div className="p-8">
        <NoticeCard setOpen={onOpen}/>
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