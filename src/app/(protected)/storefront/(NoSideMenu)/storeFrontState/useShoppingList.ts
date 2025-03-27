import requestClient from "@/lib/requestClient";
import { create } from "zustand";

type ShoppingListState = {
  shoppingList: any[];
  loading: boolean;
  error: string | null;
  fetchShoppingList: (token: string) => Promise<string>;
  addShoppingList: (item: any, token: string) => Promise<{}>;
  removeShoppingListItem: (
    id: string,
    token: string,
    setLaodingRem: Function
  ) => Promise<void>;
};

export const useShoppingList = create<ShoppingListState>((set, get) => ({
  shoppingList: [],
  loading: false,
  error: null,

  fetchShoppingList: async (token) => {
    try {
      set({ loading: true });

      const resp = await requestClient({ token }).get(
        "/storefront/shopping-list"
      );

      const shoppingListData = resp?.data?.data || [];
      console.log("API response:", shoppingListData);

      set({
        shoppingList: shoppingListData,
        loading: false,
      });

      return shoppingListData;
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || "Failed to fetch shopping list items",
        loading: false,
      });
    }
  },

  addShoppingList: async (item, token) => {
    try {
      // set({ loading: true });

      const resp = await requestClient({ token }).post(
        "/storefront/shopping-list/add-shopping-list",
        item
      );

      if (resp) {
        // Refresh the shopping list after adding the item
        await get().fetchShoppingList(token);
      }
      return resp?.status;

      // set({ loading: false });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || "Failed to add item to shopping list",
        // loading: false,
      });
    }
  },

  removeShoppingListItem: async (id, token, setLaodingRem) => {
    try {
      // set({ loading: true });
      setLaodingRem(true);

      const resp = await requestClient({ token }).delete(
        `/storefront/shopping-list/remove-item/${id}`
      );

      if (resp) {
        // Refresh the shopping list after adding the item
        await get().fetchShoppingList(token);
      }
      setLaodingRem(false);

      // set({ loading: false });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ||
          "Failed to remove item from shopping list",
        // loading: false,
      });
      setLaodingRem(false);
    }
  },
}));
