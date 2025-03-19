"use client";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Text,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import ShoppingListTable from "../_components/shoppingListTable";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import { ShoppingListData } from "@/types/shoppingList";

export interface CountProps {
  status: string;
  total: number;
}
const ShoppingList = () => {
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [shoppingListData, setShoppingListData] = useState<ShoppingListData>();
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState<number>(1);
  const [counts, setCount] = useState<CountProps[]>([
    {
      status: "Bought",
      total: 10,
    },
    {
      status: "Not Bought",
      total: 5,
    },
  ]);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const fetchOrderCount = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = `/admin/shopping-list`;
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setShoppingListData(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchOrderCount();
  }, [fetchOrderCount, token]);

  return (
    <div className="p-8">
      <HStack justify={"space-between"} mb={4}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          Shopping list
        </Text>
        <Flex gap={2}>
          <SearchInput
            placeholder="Search with customer's name"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </Flex>
      </HStack>

      <Tabs variant={"unstyled"}>
        <TabList className="flex gap-3">
          <Tab
            onClick={() => setStatus("")}
            _selected={{ color: "white", bg: "#1A70B8", borderRadius: "10px" }}
            className="bg-gray-100 rounded-[10px]"
          >
            <div className="flex items-center gap-3">
              <Text>All </Text>
              <p className="bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm">
                {9}
              </p>
            </div>
          </Tab>

          {counts?.map((count: CountProps, key) => (
            <Tab
              onClick={() => setStatus(count.status)}
              _selected={{
                color: "white",
                bg: "#1A70B8",
                borderRadius: "10px",
              }}
              key={key}
              className="bg-gray-100 rounded-[10px]"
            >
              <div className="flex items-center gap-3">
                <p className="text-base lowercase first-letter:uppercase">
                  {count?.status}
                </p>
                <p className="bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm">
                  {count.total}
                </p>
              </div>
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <ShoppingListTable
              data={shoppingListData}
              loading={isLoading}
              type="all"
              pageCount={pageCount}
              globalFilter={globalFilter}
              setPageCount={setPageCount}
            />
          </TabPanel>
          {/*     <TabPanel>
                    <OrderPage 
                    orders={orders} 
                    loading={loading} 
                    type="PENDING" 
                    fetchOrders={fetchOrders}
                    pageCount={pageCount}
                    globalFilter={globalFilter}
                    setPageCount={setPageCount}
                    fetchOrderCount={fetchOrderCount}
                    />
                </TabPanel>
                <TabPanel>
                    <OrderPage 
                    orders={orders} 
                    loading={loading} 
                    type="PROCESSING" 
                    fetchOrders={fetchOrders}
                    pageCount={pageCount}
                    globalFilter={globalFilter}
                    setPageCount={setPageCount}
                    fetchOrderCount={fetchOrderCount}
                    />
                </TabPanel>
                <TabPanel>
                    <OrderPage 
                    orders={orders} 
                    loading={loading} 
                    type="SHIPPED"
                    fetchOrders={fetchOrders}
                    pageCount={pageCount}
                    globalFilter={globalFilter}
                    setPageCount={setPageCount}
                    fetchOrderCount={fetchOrderCount}
                    />
                </TabPanel>
                <TabPanel>
                    <OrderPage 
                    orders={orders} 
                    loading={loading} 
                    type="CANCELED" 
                    fetchOrders={fetchOrders}
                    pageCount={pageCount}
                    globalFilter={globalFilter}
                    setPageCount={setPageCount}
                    fetchOrderCount={fetchOrderCount}
                    />
                </TabPanel>
                <TabPanel>
                    <OrderPage 
                    orders={orders} 
                    loading={loading} 
                    type="COMPLETED" 
                    fetchOrders={fetchOrders}
                    pageCount={pageCount}
                    globalFilter={globalFilter}
                    setPageCount={setPageCount}
                    fetchOrderCount={fetchOrderCount}
                    />
                </TabPanel>*/}
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default ShoppingList;
