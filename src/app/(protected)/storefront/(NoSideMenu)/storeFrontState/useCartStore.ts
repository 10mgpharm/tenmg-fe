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
  cartId: number | null;
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: (token: string) => Promise<any>;
  updateLoading: boolean;
  addToCart: (item, token: string) => Promise<void>;
  cartSize: string | number | null;
  sycnCart: (data, token) => Promise<void>;
  clearCart: (token: string) => Promise<void>;
  clearCartAndRedirect: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  cartId: null,
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
      const currentCartId = cartData?.id || null;

      if (cartData && cartData.items) {
        set({
          cart: cartData,
          cartId: currentCartId,
          isLoading: false,
          cartSize: cartData?.items.length,
        });
      } else {
        set({
          cart: [],
          cartId: null,
          isLoading: false,
          cartSize: 0,
        });
      }

      return cartData;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch cart items",
        isLoading: false,
        cart: [],
        cartId: null,
        cartSize: 0,
      });
      return null;
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
        // console.log("Item added to cart successfully.");
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

      return resp.data;
    } catch (e) {
      set({ updateLoading: false });
    }
  },

  clearCart: async (token: string) => {
    try {
      const resp = await requestClient({ token }).post(
        "/storefront/clear-cart"
      );
      
      if (resp?.data?.status === "success") {
        // Immediately update the store state
        set({ 
          cart: [], 
          cartId: null, 
          cartSize: 0 
        });
        
        toast.success("Cart cleared successfully");
        
        // Fetch fresh cart data to ensure consistency
        await get().fetchCart(token);
      }
    } catch (e) {
      toast.error("Could not clear cart, please try again");
    }
  },

  clearCartAndRedirect: () => {
    try {
      set({ 
        cart: [], 
        cartId: null, 
        cartSize: 0 
      });
    } catch (e) {
      console.error("Error clearing cart:", e);
    }
  },
}));
