import requestClient from "@/lib/requestClient";
import { create } from "zustand";

type CartItem = {
  id: string | number;
  image: any;
  name: string;
  stock: string;
  price: any;
  quantity: number;
  productId: string;
  items: [];
  // name: string;
  // price: number;
  qty: number;
};

type CartState = {
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: (token) => Promise<void>;
  updateLoading: boolean;
  addToCart: (item, token) => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  isLoading: false,
  error: null,
  updateLoading: false,

  fetchCart: async (token) => {
    try {
      set({ isLoading: true });

      const resp = await requestClient({ token }).get(
        "/storefront/get-user-cart"
      );

      console.log("resp", resp?.data?.data);
      set({ cart: resp?.data?.data, isLoading: false });
      return resp?.data?.data;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch cart items",
        isLoading: false,
      });
    }
  },

  addToCart: async (item, token) => {
    // console.log("store adding");
    try {
      set({ updateLoading: true });

      const resp = await requestClient({ token }).post(
        "/storefront/add-remove-cart-items",
        item
      );
      if (resp) {
        console.log("Item added to cart successfully.");
        // Call fetchCart after a successful addition
        await get().fetchCart(token);
      }

      // console.log("add resp", resp);
      set({ updateLoading: false });

      // return resp;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch cart items",
        updateLoading: false,
      });
    }
  },
}));
