"use client";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import { HStack, Text, Flex } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import ShoppingListTable from "../_components/shoppingListTable";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import { ShoppingListData } from "@/types/shoppingList";
import { useDebouncedValue } from "@/utils/debounce";

export interface CountProps {
  status: string;
  total: number;
}
const ShoppingList = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [shoppingListData, setShoppingListData] = useState<ShoppingListData>();
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState<number>(1);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const debounceValue = useDebouncedValue(() => searchValue, 500);

  const fetchOrderCount = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = `/admin/shopping-list?search=${searchValue}&page=${pageCount}`;
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setShoppingListData(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [token, debounceValue, pageCount]);

  useEffect(() => {
    if (!token) return;
    fetchOrderCount();
  }, [fetchOrderCount, token, debounceValue]);

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Text fontWeight={"semibold"} fontSize={{base: "xl", md: "2xl"}}>
          Shopping list
        </Text>
        <div className="w-full md:w-auto">
          <SearchInput
            placeholder="Search by product name"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setPageCount(1);
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <ShoppingListTable
          data={shoppingListData}
          loading={isLoading}
          pageCount={pageCount}
          setPageCount={setPageCount}
        />
      </div>
    </div>
  );
};

export default ShoppingList;
