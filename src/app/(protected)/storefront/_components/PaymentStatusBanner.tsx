"use client";

import { Button, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import { usePaymentStatusStore, usePaymentStatusNavigation } from "../(NoSideMenu)/storeFrontState/usePaymentStatusStore";
import { useCartStore } from "../(NoSideMenu)/storeFrontState/useCartStore";

export default function PaymentStatusBanner() {
  const router = useRouter();
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const userToken = sessionData?.user?.token;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { paymentStatus, isLoading, fetchPaymentStatus } =
    usePaymentStatusStore();

  const { clearCart, cartSize } = useCartStore();

  // Auto-fetch payment status on every navigation
  usePaymentStatusNavigation(userToken);

  // Clear cart when payment is completed (APPROVED) - only if cart is not empty
  useEffect(() => {
    if (userToken && paymentStatus === "APPROVED" && Number(cartSize) > 0) {
      clearCart(userToken);
    }
  }, [userToken, paymentStatus, clearCart, cartSize]);

  // Polling every 2 minutes until payment is completed
  useEffect(() => {
    const isCompleted = paymentStatus === "APPROVED";
    const shouldPoll = userToken && paymentStatus && !isCompleted;
    
    if (shouldPoll) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Set up new interval for polling every 2 minutes (120000ms)
      intervalRef.current = setInterval(() => {
        fetchPaymentStatus(userToken);
      }, 120000);
    } else {
      // Clear interval if no token, no status, or payment is completed
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup interval on unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [userToken, paymentStatus, fetchPaymentStatus]);

  // console.log("PaymentStatusBanner - Status:", paymentStatus, "Loading:", isLoading);

  if (isLoading) return null;
  if (!paymentStatus) return null;
  if (!["PENDING_MANDATE", "INITIATED", "PENDING PAYMENT"].includes(paymentStatus)) return null;

  return (
    <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
      <div className="flex items-center justify-between">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-orange-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-orange-700">
              <span className="font-medium">
                {paymentStatus === "INITIATED" ? "Payment Initiated:" :
                 paymentStatus === "PENDING_MANDATE" ? "Payment Pending:" :
                 paymentStatus === "PENDING PAYMENT" ? "Payment Processing:" :
                 "Payment Pending:"}
              </span>{" "}
              {paymentStatus === "INITIATED" ? "You have completed payment! Please check back with the administrator to confirm your order.." :
               paymentStatus === "PENDING_MANDATE" ? "Please complete your payment to finalize your transaction." :
               paymentStatus === "PENDING PAYMENT" ? "Your payment is being processed. Please wait." :
               "Please complete your order to finalize your transaction."}
            </p>
          </div>
        </div>
        <IconButton
          aria-label="Cancel payment"
          icon={<FiX />}
          size="sm"
          colorScheme="orange"
          variant="outline"
          onClick={() => router.push("/storefront/checkout/payment")}
        />
      </div>
    </div>
  );
}
