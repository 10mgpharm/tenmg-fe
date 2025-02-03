import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { create } from "zustand";

type CartItem = {
  id: string | number;
  image: any;
  name: string;
  stock: string;
  price: any;
  quantity: number;
  productId: string;
  qty: number;
};

type CartState = {
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: (token: string) => Promise<void>;
  updateLoading: boolean;
  addToCart: (item, token: string) => Promise<void>;
  cartSize: string | number | null;
  sycnCart: (data, token) => Promise<void>;
  clearCart: (token: string) => Promise<void>;
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  isLoading: false,
  error: null,
  updateLoading: false,
  cartSize: 0,

  fetchCart: async (token: string) => {
    try {
      set({ isLoading: true });

      const resp = await requestClient({ token }).get(
        "/storefront/get-user-cart"
      );

      const cartData = resp?.data?.data || [];
      console.log("API response:", cartData);

      set({
        cart: cartData,
        isLoading: false,
        cartSize: cartData?.items.length,
      });

      return cartData;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch cart items",
        isLoading: false,
      });
    }
  },

  addToCart: async (item, token: string) => {
    try {
      set({ updateLoading: true });

      const resp = await requestClient({ token }).post(
        "/storefront/add-remove-cart-items",
        item
      );

      if (resp) {
        console.log("Item added to cart successfully.");
        // Refresh the cart after adding the item
        await get().fetchCart(token);
      }

      set({ updateLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to add item to cart",
        updateLoading: false,
      });
    }
  },
  sycnCart: async (data, token) => {
    try {
      set({ updateLoading: true });
      const resp = await requestClient({ token }).post(
        "/storefront/sync-cart",
        data
      );

      console.log("resp", resp);
      // return
    } catch (e) {
      console.log(e);
      set({ updateLoading: false });
    }
  },
  clearCart: async (token: string) => {
    try {
      console.log("here ");
      const resp = await requestClient({ token }).post(
        "/storefront/clear-cart"
      );
      console.log("resp", resp);
      if (resp?.data?.status === "success") {
        toast.success("Cart cleared successfully");
        await get().fetchCart(token);
        set({ cartSize: 0 });
      }
    } catch (e) {
      toast.error("Could not clear cart, please try again");
    }
  },
}));
