import { create } from "zustand";
import requestClient from "@/lib/requestClient";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface PaymentStatusState {
  paymentStatus: string | null;
  isLoading: boolean;
  fetchPaymentStatus: (token: string) => Promise<void>;
  refreshPaymentStatus: (token: string) => Promise<void>;
  clearPaymentStatus: () => void;
}

export const usePaymentStatusStore = create<PaymentStatusState>((set, get) => ({
  paymentStatus: null,
  isLoading: false,

  fetchPaymentStatus: async (token: string) => {
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await requestClient({ token }).get(
        "/storefront/payment/last-payment-status"
      );
      if (response?.status === 200) {
        const newStatus = response?.data?.data?.application?.status || null;

        set({
          paymentStatus: newStatus,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching payment status:", error);
      set({ isLoading: false });
    }
  },

  refreshPaymentStatus: async (token: string) => {
    const { fetchPaymentStatus } = get();
    await fetchPaymentStatus(token);
  },

  clearPaymentStatus: () => {
    set({ paymentStatus: null, isLoading: false });
  },
}));

export const usePaymentStatusNavigation = (token: string | undefined) => {
  const pathname = usePathname();
  const { fetchPaymentStatus } = usePaymentStatusStore();

  useEffect(() => {
    if (token) {
      fetchPaymentStatus(token);
    }
  }, [pathname, token, fetchPaymentStatus]);
};
