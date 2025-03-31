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
      let query = `/admin/shopping-list?search=${searchValue}`;
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setShoppingListData(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [token, debounceValue]);

  useEffect(() => {
    if (!token) return;
    fetchOrderCount();
  }, [fetchOrderCount, token, debounceValue]);

  return (
    <div className="p-8">
      <HStack justify={"space-between"} mb={4}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          Shopping list
        </Text>
        <Flex gap={2}>
          <SearchInput
            placeholder="Search with customer's name"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Flex>
      </HStack>

      <ShoppingListTable
        data={shoppingListData}
        loading={isLoading}
        pageCount={pageCount}
        setPageCount={setPageCount}
      />
    </div>
  );
};

export default ShoppingList;
