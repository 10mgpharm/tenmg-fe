"use client";

import NoticeCard from "./_components/NoticeCard"
import order from '@public/assets/images/totalorder.svg'
import completedOrder from '@public/assets/images/target.svg'
import totalProducts from '@public/assets/images/products.svg'
// import totalPattern from '@public/assets/images/bgPattern.svg';
// import orderPattern from '@public/assets/images/orderPattern.svg';
// import completeOrder from '@public/assets/images/completePattern.svg';
// import productPattern from '@public/assets/images/productpatterns.svg';
import CompleteAccountModal from "./_components/CompleteAccountModal"
import { useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { BusinessStatus } from "@/constants";
import { CalendarIcon } from "lucide-react";
import OverviewCardWithoutBG from "./_components/OverViewWithoutBG";
import ChartComponent from "../vendors/_components/ChartComponent";
import { ApexOptions } from "apexcharts";
import RevenuePerProduct from "./_components/RevenuePerProduct";
import { useRef } from "react";

export const options = [
    { label: "This week", value: "This week" },
    { label: "This month", value: "This month" },
    { label: "Last year", value: "Last year" },
]

const Supplier = () => {

    const session = useSession();
    const chartRef = useRef<any>(null);
    const sessionData = session.data as NextAuthUserSession;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isVisible = sessionData?.user?.businessStatus !== BusinessStatus.VERIFIED;

    const pieSeries = [54, 12, 8];
    const total = pieSeries.reduce((a, b) => a + b, 0);

    const formatValue = (value: any) => {
        if (value >= 1000000) {
          return `₦${(value / 1000000).toFixed(1)}M`; // Format as millions
        } else if (value >= 1000) {
          return `₦${(value / 1000).toFixed(1)}K`; // Format as thousands
        } else {
          return ` ₦${value.toFixed(1)}`; // For smaller values, just round
        }
    };

    const graphOptions: ApexOptions = {
        chart: {
            type: "area",
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false
            },
            selection: {
                enabled: false,
            },
            events: {
                mouseMove: function (event) {
                    // Prevent moving the chart on scroll
                    event?.preventDefault();
                },
                // wheel: function (event) {
                // event.preventDefault(); // Prevent scroll zooming or panning
                // },
            },
        },
        dataLabels: {
          enabled: false, // Remove values on the bars
        },
        yaxis: {
            show: true,
            labels: {
              formatter: formatValue // Format y-axis labels
            }
        },
        xaxis: {
          categories: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ],
        },
        stroke: {
            curve: 'straight',
            width: 1
        },
        legend: {
          show: false,
        },
    };

    const pieOptions: ApexOptions = {
        chart: {
            type: "donut",
            toolbar: {
                show: false,
            },
        },
        colors: ["#7086FD", "#6FD195", "#FFAE4C"],
        labels: ['In Stock', "Low Stock", "Out of stock"],
        legend: {
            position: "bottom",
            horizontalAlign: 'center',
        },
        dataLabels: {
            enabled: false,
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: 'bottom',
                },
              },
            },
        ],
        plotOptions: {
            pie: {
              donut: {
                size: '55%',
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: 'Total',
                    formatter: () => `${total}`,
                    color: '#333',
                    fontSize: '20px',
                    fontFamily: 'Arial, sans-serif',
                  },
                },
              },
            },
        },
    };

    const series = [
        {
            name: "Revenue",
            data: [100000, 50000, 150000, 75000, 180000, 120000, 195000],
        },
    ];

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
                    <div className="border rounded-md p-1 flex items-center gap-1.5 px-2 shadow-sm">
                        <p className="text-sm text-gray-600">Today</p>
                        <CalendarIcon className="w-4 h-4 text-gray-500 text-default-400 pointer-events-none flex-shrink-0" />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-5">
                    <OverviewCardWithoutBG
                        title="Total Income"
                        value="₦100,100.00"
                    />
                    <OverviewCardWithoutBG
                        title="Total Orders"
                        value="20"
                        icon={order}
                    />
                    <OverviewCardWithoutBG
                        title="Completed Orders"
                        value="10"
                        icon={completedOrder}
                    />
                    <OverviewCardWithoutBG
                        title="Total Products"
                        value="150"
                        icon={totalProducts}
                    />
                </div>
                <div className="flex gap-5 mt-4">
                    <div className="flex-1 bg-white p-5 rounded-md">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-600 font-semibold text-lg">Revenue Analytics</h3>
                            <select className="border p-2 rounded-lg text-gray-500 outline-none">
                                {
                                    options.map((option) => (
                                        <option 
                                        key={option.label} 
                                        value={option.value} 
                                        className="text-gray-500">
                                            {option.label}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        {/* <EmptyCard /> */}
                        <div className="">
                            <ChartComponent
                                options={graphOptions}
                                series={series}
                                type="area"
                                width={"100%"}
                                height={320}
                            />
                        </div>
                    </div>
                    <div className="flex-1 bg-white p-5 rounded-md">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-600 font-semibold text-lg">Stock Status</h3>
                            <select className="border p-2 rounded-lg text-gray-500 outline-none">
                                {
                                    options.map((option) => (
                                        <option 
                                        key={option.label} 
                                        value={option.value} 
                                        className="text-gray-500">
                                            {option.label}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        {/* <EmptyCard /> */}
                        <ChartComponent
                            options={pieOptions}
                            series={pieSeries}
                            type="donut"
                            width={"100%"}
                            height={320}
                        />
                    </div>
                </div>
                <div className="mt-5">
                   <RevenuePerProduct />
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