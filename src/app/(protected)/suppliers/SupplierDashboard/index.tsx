"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import { useSession } from "next-auth/react";
import { useDisclosure } from "@chakra-ui/react";
import { NextAuthUserSession } from "@/types";
import { BusinessStatus } from "@/constants";
import NoticeCard from "../_components/NoticeCard";
import order from "@public/assets/images/totalorder.svg";
import completedOrder from "@public/assets/images/target.svg";
import totalProducts from "@public/assets/images/products.svg";
import CompleteAccountModal from "../_components/CompleteAccountModal";
import OverviewCardWithoutBG from "../_components/OverViewWithoutBG";
import ChartComponent from "../../vendors/_components/ChartComponent";
import RevenuePerProduct from "../_components/RevenuePerProduct";
import requestClient from "@/lib/requestClient";

export const options = [{ label: "This year", value: "This year" }];

const Supplier = () => {
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isVisible =
    sessionData?.user?.businessStatus !== BusinessStatus.VERIFIED;

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

  const fetchingOverview = useCallback(async () => {
    try {
      setLoading(true);
      const res = await requestClient({ token: token }).get(
        `/supplier/dashboard?dateFilter=one_year`
      );
      setData(res.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchingOverview();
  }, [token, fetchingOverview]);

  const formatValue = (value: any) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `₦${(value / 1000).toFixed(1)}K`;
    } else {
      return ` ₦${value.toFixed(1)}`;
    }
  };

  const graphOptions: ApexOptions = {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      selection: {
        enabled: false,
      },
      events: {
        mouseMove: function (event) {
          event?.preventDefault();
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      show: true,
      labels: {
        formatter: formatValue, // Format y-axis labels
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    stroke: {
      curve: "straight",
      width: 1,
    },
    legend: {
      show: false,
    },
  };

  const pieSeries = [
    Number(data?.analytics?.stockStatus?.inStock),
    Number(data?.analytics?.stockStatus?.lowStock),
    Number(data?.analytics?.stockStatus?.outOfStock),
  ];
  const total = pieSeries.reduce((a, b) => a + b, 0);

  const pieOptions: ApexOptions = {
    chart: {
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    colors: ["#7086FD", "#6FD195", "#FFAE4C"],
    labels: ["In Stock", "Low Stock", "Out of stock"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    plotOptions: {
      pie: {
        donut: {
          size: "55%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => `${total}`,
              color: "#333",
              fontSize: "20px",
              fontFamily: "Arial, sans-serif",
            },
          },
        },
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: [
        data?.analytics?.revenue?.january,
        data?.analytics?.revenue?.february,
        data?.analytics?.revenue?.march,
        data?.analytics?.revenue?.april,
        data?.analytics?.revenue?.may,
        data?.analytics?.revenue?.june,
        data?.analytics?.revenue?.july,
        data?.analytics?.revenue?.august,
        data?.analytics?.revenue?.september,
        data?.analytics?.revenue?.october,
        data?.analytics?.revenue?.november,
        data?.analytics?.revenue?.december,
      ],
    },
  ];

  return (
    <div>
      {isVisible && (
        <NoticeCard
          setOpen={onOpen}
          status={sessionData?.user?.businessStatus}
          url="/suppliers/settings/license_upload"
        />
      )}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-2xl text-gray-600">Dashboard</h2>
          {/* <div className="border rounded-md p-1 flex items-center gap-1.5 px-2 shadow-sm">
                        <p className="text-sm text-gray-600">Today</p>
                        <CalendarIcon className="w-4 h-4 text-gray-500 text-default-400 pointer-events-none flex-shrink-0" />
                    </div> */}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <OverviewCardWithoutBG
            title="Total Income"
            value={`₦${data?.analytics?.totalIncome || "0.00"}`}
            icon={order}
          />
          <OverviewCardWithoutBG
            title="Total Orders"
            value={`${data?.analytics?.totalOrders?.count || 0}`}
            icon={order}
          />
          <OverviewCardWithoutBG
            title="Completed Orders"
            value={`${data?.analytics?.completedOrders?.count || 0}`}
            icon={completedOrder}
          />
          <OverviewCardWithoutBG
            title="Total Products"
            value={`${data?.analytics?.totalProducts?.count || 0}`}
            icon={totalProducts}
          />
        </div>
        <div className="sm:flex gap-5 mt-4">
          <div className="flex-1 bg-white p-5 rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 font-semibold text-lg">
                Revenue Analytics
              </h3>
              {/* <select className="border p-2 rounded-lg text-gray-500 outline-none">
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
                            </select> */}
            </div>
            {/* <EmptyCard /> */}
            <React.Fragment>
              <div className="">
                {loading ? (
                  <div className="flex items-center justify-center h-80 text-gray-500">
                    Loading chart...
                  </div>
                ) : (
                  <ChartComponent
                    options={graphOptions}
                    series={series}
                    type="area"
                    width="100%"
                    height={320}
                  />
                )}
              </div>
            </React.Fragment>
          </div>
          <div className="flex-1 bg-white p-5 rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 font-semibold text-lg">
                Stock Status
              </h3>
              {/* <select className="border p-2 rounded-lg text-gray-500 outline-none">
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
                            </select> */}
            </div>
            {/* <EmptyCard /> */}
            <React.Fragment>
              <div className="">
                {loading ? (
                  <div className="flex items-center justify-center h-80 text-gray-500">
                    Loading chart...
                  </div>
                ) : (
                  <ChartComponent
                    options={pieOptions}
                    series={pieSeries}
                    type="donut"
                    width={"100%"}
                    height={320}
                  />
                )}
              </div>
            </React.Fragment>
          </div>
        </div>
        <div className="mt-5">
          <RevenuePerProduct
            data={data?.analytics?.revenuePerProduct}
            loading={loading}
          />
        </div>
      </div>
      <CompleteAccountModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default Supplier;
