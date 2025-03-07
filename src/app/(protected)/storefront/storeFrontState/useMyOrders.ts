import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { create } from "zustand";

// type OrderItem = {
//   id: string;
//   productId: string;
//   status: "pending" | "cancelled" | "declined";
//   // Add other fields as needed
// };

type OrderState = {
  orders: [];
  pendingOrders: [];
  cancelledOrders: [];
  completedOrders: [];
  order: {};
  loading: boolean;
  error: null | undefined | string;
};

export const useOrdersStore = create<any>((set, get) => ({
  orders: [],
  pendingOrders: [],
  shippingOrders: [],
  processingOrders: [],
  cancelledOrders: [],
  completedOrders: [],
  loading: true,
  error: null,

  fetchOrders: async (token) => {
    try {
      set({ loading: true });
      const resp = await requestClient({ token }).get("/storefront/orders");
      const orders = resp?.data?.data || [];

      if (orders) {
        // Filter orders items based on status
        const pendingOrders = orders.filter(
          (item) => item.status.toLowerCase() === "pending"
        );
        const processingOrders = orders.filter(
          (item) => item.status.toLowerCase() === "processing"
        );
        const shippingOrders = orders.filter(
          (item) => item.status.toLowerCase() === "shipped"
        );
        const cancelledOrders = orders.filter(
          (item) => item.status.toLowerCase() === "cancelled"
        );
        const completedOrders = orders.filter(
          (item) => item.status.toLowerCase() === "completed"
        );

        set({
          orders,
          pendingOrders,
          cancelledOrders,
          completedOrders,
          processingOrders,
          shippingOrders,
          loading: false,
        });
      }
    } catch (e) {
      set({
        loading: false,
        error: e?.response?.data?.message ?? "Error fetching orders",
      });
      toast.error(e?.response?.data?.message ?? "Error fetching orders");
    }
  },

  getSingleOrder: async (token, id) => {
    set({ order: {}, loading: true });
    try {
      const resp = await requestClient({ token }).get(
        `/storefront/orders/${id}`
      );
      const order = resp?.data?.data || {};
      set({ order, loading: false });
    } catch (e) {
      toast.error(e?.response?.data?.message ?? "Error fetching order");
      set({
        loading: false,
        error: e?.response?.data?.message ?? "Error fetching orders",
      });
    }
  },
}));
