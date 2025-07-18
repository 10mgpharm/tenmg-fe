"use client";

import { Flex, Spinner } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import EmptyCard from "../_components/EmptyCard";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";

const Insight = () => {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterQuery, setFilterQuery] = useState("today");

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    try {
      let query = `/supplier/insights?dateFilter=${filterQuery}`;
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setData(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, filterQuery]);

  useEffect(() => {
    if (!token) return;
    fetchOverview();
  }, [token, fetchOverview]);

  // Dynamic data normalization based on filter type
  const normalizeChartData = useCallback(
    (dataObject: any, filterType: string) => {
      if (!dataObject) return [];

      const labelMappings: { [key: string]: { [key: string]: string } } = {
        today: {
          midnightToSixAm: "12:00am",
          sixAmToTwelvePm: "6:00am",
          twelvePmToSixPm: "12:00pm",
          sixPmToMidnight: "6:00pm",
        },
        one_week: {
          monday: "Mon",
          tuesday: "Tue",
          wednesday: "Wed",
          thursday: "Thu",
          friday: "Fri",
          saturday: "Sat",
          sunday: "Sun",
        },
        one_month: {
          weekOne: "Week 1",
          weekTwo: "Week 2",
          weekThree: "Week 3",
          weekFour: "Week 4",
        },
        six_months: {
          currentMonth: "Current",
          lastMonth: "Last Month",
          twoMonthsAgo: "2 Months Ago",
          threeMonthsAgo: "3 Months Ago",
          fourMonthsAgo: "4 Months Ago",
          fiveMonthsAgo: "5 Months Ago",
        },
      };

      const mapping = labelMappings[filterType] || {};

      return Object.entries(dataObject).map(([key, value]) => ({
        name: mapping[key] || key,
        uv: Number(value) || 0,
      }));
    },
    []
  );

  // Get chart data for totalProductsSold
  const productsSoldChartData = normalizeChartData(
    data?.totalProductsSold,
    filterQuery
  );

  // Get chart data for totalRevenue
  const totalRevenueChartData = normalizeChartData(
    data?.totalRevenue,
    filterQuery
  );

  const formatYAxisTick = (tickItem: any) => {
    if (tickItem >= 1000) {
      return `${tickItem.toLocaleString()}`;
    }
    return tickItem;
  };

  // Custom tooltip for revenue charts
  const CustomRevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-medium text-gray-800">{`${label}`}</p>
          <p className="text-primary-600">
            {`Revenue: ₦${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for product sold charts
  const CustomProductTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-medium text-gray-800">{`${label}`}</p>
          <p className="text-primary-600">
            {`Products Sold: ${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 min-h-[calc(100vh-108px)]">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
        Insight
      </h2>
      <div className="flex items-center justify-between mt-4">
        <div className="">
          <select
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="p-2 shadow-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white border border-gray-300"
            disabled={loading}
          >
            <option value="today">1 day</option>
            <option value="one_week">1 Week</option>
            <option value="one_month">1 Month</option>
            <option value="six_months">6 Month</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span
            onClick={() => fetchOverview()}
            className={`text-primary-500 underline cursor-pointer text-sm font-medium ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-primary-600"
            }`}
          >
            {loading ? "Loading..." : "Refresh Record"}
          </span>
        </div>
      </div>
      {loading ? (
        <Flex justify="center" align="center" height="400px" className="mt-6">
          <div className="text-center">
            <Spinner size="xl" color="primary.500" />
            <p className="mt-4 text-gray-600">Loading insights...</p>
          </div>
        </Flex>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row gap-5 mt-6">
            <div className="flex-1 bg-white p-5 rounded-md">
              <h3 className="text-gray-600 font-semibold text-lg mb-5">
                Total Product Sold
              </h3>
              {productsSoldChartData.length > 0 ? (
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <AreaChart
                      width={500}
                      height={300}
                      data={productsSoldChartData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -30,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeOpacity={0.5}
                        strokeDasharray="12 10"
                        color="#F2F4F7"
                        vertical={false}
                      />
                      <XAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={"14px"}
                        dataKey="name"
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={"14px"}
                        tickFormatter={formatYAxisTick}
                      />
                      <Tooltip content={<CustomProductTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="uv"
                        stroke="#FDB022"
                        strokeWidth={"2px"}
                        fill="#FFF7ED"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyCard />
              )}
            </div>
            <div className="flex-1 bg-white p-5 rounded-md">
              <h3 className="text-gray-600 font-semibold text-lg mb-5">
                Total Revenue
              </h3>
              {totalRevenueChartData.length > 0 ? (
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <AreaChart
                      width={500}
                      height={300}
                      data={totalRevenueChartData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -30,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeOpacity={0.5}
                        strokeDasharray="12 10"
                        color="#F2F4F7"
                        vertical={false}
                      />
                      <XAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={"14px"}
                        dataKey="name"
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={"14px"}
                        tickFormatter={formatYAxisTick}
                      />
                      <Tooltip content={<CustomRevenueTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="uv"
                        stroke="#FDB022"
                        strokeWidth={"2px"}
                        fill="#FFF7ED"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyCard />
              )}
            </div>
          </div>
          <div className="mt-6 flex-1">
            <div className="bg-white p-5 rounded-md">
              <h3 className="text-gray-600 font-semibold text-lg mb-5">
                Best Selling Products
              </h3>
              {data?.bestSellingProducts?.length > 0 ? (
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      width={500}
                      height={300}
                      data={data?.bestSellingProducts}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -10,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeOpacity={0.5}
                        strokeDasharray="12 10"
                        color="#F2F4F7"
                        vertical={false}
                      />
                      <XAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={"14px"}
                        dataKey="name"
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={"14px"}
                        tickFormatter={formatYAxisTick}
                      />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="totalSold"
                        stroke="#FDB022"
                        strokeWidth={"2px"}
                        fill="#FFF7ED"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyCard />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insight;
