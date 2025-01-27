import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { create } from "zustand";

type wishlistState = {
  wishlist: [];
  loading: boolean;
  error: null | undefined | string;
};

export const useWishlistStore = create<any>((set, get) => ({
  wishlist: [],

  fetchWishlist: async (token) => {
    try {
      set({ loading: true });
      const resp = await requestClient({ token }).get("/storefront/wishlist");
      // console.log("resp", resp?.data?.data);
      set({ wishlist: resp?.data?.data, loading: false });
    } catch (e) {
      set({ loading: false });
      // toast.error(e?.response?.data?.message ?? "error from wish list");
    }
  },

  addToWishlist: async (id, token, setAddedToWishlist) => {
    try {
      set({ loading: true });
      const resp = await requestClient({ token }).post(
        "/storefront/wishlist/add-wishlist",
        { productId: id }
      );
      console.log("resp", resp);
      await get().fetchWishlist();
      toast.success("Item added to wishlist");
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message ?? "Could not add to wishlist");
      setAddedToWishlist(false);
      set({ loading: false });
    }
  },

  removeWishlistItem: async (id, token, setAddedToWishlist) => {
    try {
      set({ loading: true });
      const resp = await requestClient({ token }).delete(
        `storefront/wishlist/remove-product/${id}`
        // { productId: id }
      );
      console.log("resp", resp);
      await get().fetchWishlist(token);
      toast.success("Item removed from wishlist");
    } catch (e) {
      setAddedToWishlist(true);
      set({ loading: false });
    }
  },
}));
