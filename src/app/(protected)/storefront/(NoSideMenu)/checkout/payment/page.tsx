"use client";
import React, { useEffect, useState } from "react";
import BreadCrumbBanner from "../../../_components/BreadCrumbBanner";
import {
  Box,
  Button,
  Divider,
  FormLabel,
  Image,
  Input,
  Spinner,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { Radio, RadioGroup } from "@chakra-ui/react";
import { useCartStore } from "../../storeFrontState/useCartStore";
import { FaCheck } from "react-icons/fa6";
import { redirect, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { config } from "process";

export default function PaymentPage() {
  const [cartItems, setCartItems] = useState<any>({});
  const { cart, fetchCart, clearCart, cartSize, isLoading: cartLoading } = useCartStore();
  // const cartItems = cart;

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const userToken = sessionData?.user?.token;

  const router = useRouter();

  useEffect(() => {
    fetchCart(userToken);
  }, [fetchCart, userToken]);

  useEffect(() => {
    if (cart) {
      setCartItems(cart);
    }
  }, [cart]);

  useEffect(() => {
    if (cartSize == 0) {
      redirect("/storefront");
    }
  }, [cartSize])

  const breadCrumb = [
    {
      text: "Home",
      link: "/",
    },
    {
      text: "Checkout",
      link: "/storefront/checkout",
    },
    {
      text: `Payment`,
      link: "#",
    },
  ];

  const [shippingData, setShippingData] = useState<any>({});
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("1");

  useEffect(() => {
    if (!userToken) return;

    const fetchAddresses = async () => {
      setIsLoading(true);
      try {
        const response = await requestClient({ token: userToken }).get(
          "/storefront/shipping-addresses"
        );
        if (response.status === 200) {
          const data = response.data.data;
          setShippingData(data?.find((item) => item?.isDefault === true));
        } else {
          toast.error(`Error: ${response.data.message}`);
        }
      } catch (error) {
        const errorMessage = handleServerErrorMessage(error);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [userToken]);

  useEffect(() => {
    shippingData &&
      setShippingAddress(
        `${shippingData?.address}, ${shippingData?.city}, ${shippingData?.state}, ${shippingData?.country}`
      );
  }, [shippingData]);

  const [loadingPayment, setLoadingPayment] = useState(false);

  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    // Dynamically load Fincra's SDK
    const script = document.createElement("script");
    script.src = process.env.NEXT_PUBLIC_FINCRA_SDK_URL;
    // script.src = config?.;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // console.log("shippingAddress", shippingAddress)

  //   Card Number: 5319 3178 0136 6660
  // Expiry Date: 10/26
  // CVV: 000

  const verifyPayment = async (ref) => {
    try {
      setIsLoading(true);
      const response = await requestClient({ token: userToken }).get(
        `/storefront/payment/verify/${ref}`
      );
      toast.success("Order placed successfully");
      // wait 1 second and reload the page
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      // // console.log("response", response);
      setIsLoading(false);
    } catch (e) {
      toast.error("Oops... Something went wrong...!");
      // // console.log(e)
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (ref) => {
    try {
      setIsLoading(true);
      const response = await requestClient({ token: userToken }).get(
        `/storefront/payment/cancel/${ref}`
      );
      if (response?.status === 200) {
        toast.success("Order Cancelled Successfully...!");
      }
      setIsLoading(false);
      // console.log("response", response);
    } catch (e) {
      setIsLoading(false);
      toast.error("Something went wrong, could not cancel order!");
    } finally {
      setIsLoading(false);
    }
  };

  const payFincra = (
    e: React.FormEvent<HTMLFormElement>,
    ref: string,
    totalAmount: string | number
  ) => {
    e.preventDefault();

    if (!window.Fincra) {
      alert("Fincra SDK not loaded. Please try again.");
      return;
    }

    window.Fincra.initialize({
      key: process.env.NEXT_PUBLIC_FINCRA_PUBKEY,
      // key: config,
      amount: totalAmount,
      currency: "NGN",
      reference: ref,
      customer: {
        name: sessionData?.user?.name,
        email: sessionData?.user?.email,
      },
      feeBearer: "business",
      onClose: () => {
        cancelOrder(ref);
      },
      onSuccess: (data: any) => {
        verifyPayment(ref);
      },
    });
  };

  const submiOrder = async (e) => {
    const orderData = {
      orderId: cartItems?.id,
      paymentMethodId: 1,
      deliveryAddress: shippingAddress,
      deliveryType: "STANDARD",
    };

    if (!shippingData) {
      toast.error("Please set a default shipping address");
      return;
    }

    setLoadingPayment(true);
    try {
      const response = await requestClient({ token: userToken }).post(
        "/storefront/checkout",
        orderData
      );
      // console.log("submit order res", response?.data?.data?.reference)
      if (response.status === 200) {
        await payFincra(
          e,
          response?.data?.data?.reference,
          response?.data?.data?.totalAmount
        );
        // console.log("submit order res", response)
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
      setLoadingPayment(false);
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
      setLoadingPayment(false);
    }
  };

  return (

    <>{
      isLoading || cartLoading ? <div className="w-full h-[50vh] flex items-center justify-center">
        <Spinner />
      </div> :
        <>{
          cartSize === 0 ? (
            <div className="w-full h-[50vh] flex items-center justify-center">
              <p className="text-lg font-semibold text-gray-500">No items in cart</p>
            </div>
          ) :
            <>
              <BreadCrumbBanner breadCrumbsData={breadCrumb} />
              <Box
                p={4}
                mt={2}
                className="grid grid-cols-1 lg:grid-cols-6 w-full lg:w-10/12 mx-auto gap-8"
              >
                <div className="col-span-1 lg:col-span-4 ">
                  <div className="w-full border border-r-gray-100 rounded-t-2xl overflow-hidden">
                    {shippingData ? (
                      <>
                        <div className="flex items-center justify-between p-4 bg-primary-100">
                          <h3 className="font-semibold text-lg">Order Summary</h3>
                          <Button
                            onClick={() =>
                              router.push("/storefront/settings/shipping-address")
                            }
                            variant={"outline"}
                            colorScheme={"primary"}
                            size={"sm"}
                          >
                            Edit
                          </Button>
                        </div>
                        <div className="p-5 flex flex-col gap-2 mx-auto w-full">
                          <h2 className="text-xl font-bold">{shippingData.name}</h2>
                          <p className="text-base font-bold">
                            {shippingData.phoneNumber}
                          </p>
                          <p className="text-sm text-gray-500">{shippingAddress}</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4">
                        <p className="text-center py-4">
                          You have not set a default shipping address
                        </p>
                        <Button
                          onClick={() =>
                            router.push("/storefront/settings/shipping-address")
                          }
                          variant={"outline"}
                          colorScheme={"primary"}
                          size={"sm"}
                        >
                          Set Address
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="w-full border border-r-gray-100 rounded-t-2xl overflow-hidden mt-10">
                    <div className="p-4 bg-primary-100">
                      <h3 className="font-semibold text-lg">Payment Method</h3>
                    </div>
                    <div className="p-4">
                      <RadioGroup onChange={setValue} value={value} className="w-full">
                        <Stack direction="column">
                          <div className="flex items-center justify-between w-full hover:bg-primary-50 p-3">
                            <p className="font-semibold">Pay with Card</p>
                            <Radio value="1" className="" />
                          </div>
                          <div className="flex items-center p-3 justify-between w-full cursor-not-allowed hover:bg-primary-50">
                            <p className="font-semibold">Pay with 10Mg Credit</p>
                            <Radio value="2" className="" disabled />
                          </div>
                        </Stack>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 lg:col-span-2 border border-r-gray-100 rounded-2xl overflow-hidden">
                  <div className=" flex items-center justify-between p-4">
                    <h3 className="font-semibold text-lg">Order Summary</h3>
                    <Button
                      variant={"outline"}
                      colorScheme={"primary"}
                      size={"sm"}
                      onClick={() => router.push("/storefront/checkout")}
                    >
                      Edit
                    </Button>
                  </div>
                  <Divider />
                  <div className="p-4 ">
                    <div
                      className="h-48 overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-primary-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-primary-300
  dark:[&::-webkit-scrollbar-track]:bg-primary-700
  dark:[&::-webkit-scrollbar-thumb]:bg-primary-500"
                    >
                      {cartItems?.items?.map((item, i) => (
                        <div
                          key={i}
                          className=" flex items-center gap-4 hover:bg-primary-50 p-3"
                        >
                          <Image
                            src={item?.product?.thumbnailFile}
                            alt={item?.product?.name}
                            boxSize={"75px"}
                            objectFit={"cover"}
                            rounded={"md"}
                          />
                          <div>
                            <p className="font-semibold">
                              {item?.product?.name}{" "}
                              {item?.product?.variation?.strengthValue}
                              {item?.product?.measurement?.name}
                            </p>
                            <p>Qty: {item?.quantity}</p>
                            <div className="flex items-center gap-x-1">
                              {item?.discountPrice > 0 && (
                                <p className="text-gray-900 font-semibold my-2 text-sm">
                                  ₦{parseInt(item?.discountPrice)}
                                </p>
                              )}
                              <p
                                className={`font-semibold my-2 text-sm ${item?.discountPrice > 0
                                  ? "text-gray-400 line-through"
                                  : "text-gray-900"
                                  }`}
                              >
                                ₦{item?.actualPrice}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Divider my={5} />
                    <div className="">
                      <FormLabel>Coupon Code</FormLabel>
                      <div className="flex items-center gap-2">
                        <Input type="text" placeholder="" />
                        <Button colorScheme={"primary"} size={"sm"}>
                          <FaCheck className="text-white text-xl" />
                        </Button>
                      </div>
                    </div>
                    <Divider my={5} />

                    <div>
                      <div className="flex items-center gap-x-2">
                        <p>Cart Total:</p>
                        <p className="font-semibold">{cartItems?.orderTotal}</p>
                      </div>

                      <div>
                        <p>Shipping fee:</p>
                        <p></p>
                      </div>

                      <div>
                        <p>TenMg Commission:</p>
                        <p></p>
                      </div>
                    </div>
                    <Divider my={5} />

                    <div className="flex items-center gap-x-2">
                      <p>Total:</p>
                      <p className="font-semibold">{cartItems?.orderTotal}</p>
                    </div>

                    <Divider my={5} />
                    <Button colorScheme={"primary"} onClick={submiOrder}>
                      {loadingPayment ? <Loader2 /> : "Pay Now"}
                    </Button>
                  </div>
                </div>
              </Box>
            </>
        }</>
    }
    </>
  );
}
