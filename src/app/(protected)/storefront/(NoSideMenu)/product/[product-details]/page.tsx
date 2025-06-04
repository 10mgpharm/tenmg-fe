"use client";
import { Minus, Plus } from "lucide-react";
// import Image from 'next/image'
import React, { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import BreadCrumbBanner from "../../../_components/BreadCrumbBanner";
import StoreProductReviewComponent from "../../../_components/StoreProductReviewComponent";
import StoreProductCardComponent from "../../../_components/StoreProductCardComponent";
import { Divider, Flex, Image, Spinner, Tag, TagLabel } from "@chakra-ui/react";
import { useCartStore } from "../../storeFrontState/useCartStore";
import { usePaymentStatusStore } from "../../storeFrontState/usePaymentStatusStore";
import { toast } from "react-toastify";

export default function ProductDetailPage() {
  const breadCrumb = [
    {
      text: "Home",
      link: "/",
    },
    {
      text: "Products",
      link: "/storefront",
    },
    {
      text: "",
      link: "#",
    },
  ];

  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const path = usePathname();
  const splitPath = path.split("/");
  const product = splitPath[splitPath.length - 1];

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const { addToCart, updateLoading } = useCartStore();
  const { paymentStatus } = usePaymentStatusStore();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        // storefront/products/quidins
        const data = await requestClient({ token: userData?.user?.token }).get(
          `/storefront/products/${product.toLocaleLowerCase()}`
        );
        setProductData(data?.data?.data);
        setReviews(data?.data?.data?.reviews?.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [userData?.user?.token, product]);

  const [count, setCount] = useState(1);

  const decrement = () => {
    if (count > 1) {
      setCount((prev) => prev - 1);
    }
  };

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  const router = useRouter();
  const isPendingPayment = paymentStatus === "PENDING_MANDATE" || paymentStatus === "INITIATED";
  
  const buy = (id) => {
    const data = {
      productId: id,
      qty: count,
      action: "add",
    };
    try {
      addToCart(data, userData?.user?.token).then((res) => {
        router.push("/storefront/checkout");
      });
    } catch (e) {
      toast.error("something went wrong");
    }
  };

  return (
    <section className=" ">
      <BreadCrumbBanner breadCrumbsData={breadCrumb} />
      {loading ? (
        <Spinner />
      ) : (
        <div className=" w-11/12 mx-auto my-10">
          <div className="flex items-center justify-between gap-6 mx-auto w-11/12 flex-col lg:flex-row">
            {/* product iamge container */}
            <div className="w-full lg:w-1/2 rounded-lg overflow-hidden ">
              <div className="w-fit  relative mx-auto">
                {/* <Image
                  width={568}
                  height={611}
                  // src={'/assets/images/productImgDetails.png'}
                  src={productData?.thumbnailFile}
                  alt=''
                  className='w-full'
                /> */}
                {/* <div
                  className="w-[568px] h-[600px] bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${productData?.thumbnailFile})` }}
                /> */}
                <Image
                  src={productData?.thumbnailFile}
                  alt={productData?.name}
                  boxSize={{ base: "400px", md: "500px" }}
                  borderRadius="xl"
                />
                <div className="absolute top-4 right-4">
                  <Tag
                    size="sm"
                    ml="1"
                    borderRadius="full"
                    color={
                      parseInt(productData?.quantity) <= (productData?.outStockLevel ?? 0)
                        ? "error.500"
                        : parseInt(productData?.quantity) >= (productData?.outStockLevel ?? 0) && parseInt(productData?.quantity) <= productData?.lowStockLevel
                          ? "warning.500"
                          : "green.500"
                    }
                    bgColor={
                      parseInt(productData?.quantity) <= (productData?.outStockLevel ?? 0)
                        ? "error.100"
                        : parseInt(productData?.quantity) >= (productData?.outStockLevel ?? 0) && parseInt(productData?.quantity) <= productData?.lowStockLevel
                          ? "warning.100"
                          : "green.100"
                    }
                  >
                    <TagLabel>
                      {
                        parseInt(productData?.quantity) <= (productData?.outStockLevel ?? 0)
                          ? "Out of Stock"
                          : parseInt(productData?.quantity) >= (productData?.outStockLevel ?? 0) && parseInt(productData?.quantity) <= productData?.lowStockLevel
                            ? "Low In Stock"
                            : "In Stock"
                      }
                    </TagLabel>
                  </Tag>
                </div>
              </div>
            </div>

            {/* description container */}
            <div className="w-full lg:w-1/2 flex flex-col gap-3 px-8">
              <h2 className="text-2xl font-semibold capitalize">
                {productData?.name} {productData?.variation?.strengthValue}
                {productData?.measurement?.name}
              </h2>
              <div className="flex items-center gap-x-1">
                {productData?.discountPrice > 0 &&
                  productData?.discountPrice !== productData?.actualPrice && (
                    <p className="text-base font-semibold">
                      ₦{productData?.actualPrice - productData?.discountPrice}
                    </p>
                  )}
                <p
                  className={`text-base font-semibold ${productData?.discountPrice > 0 &&
                    productData?.discountPrice !== productData?.actualPrice &&
                    "text-gray-300 line-through"
                    }`}
                >
                  ₦{productData?.actualPrice}
                </p>
              </div>

              <p className="text-sm">
                {productData?.description.charAt(0).toUpperCase() +
                  productData?.description.slice(1)}
              </p>

              <Divider />

              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-x-3">
                  <h4 className=" text-sm">Brand:</h4>
                  <p className=" text-sm font-semibold capitalize">
                    {productData?.brand?.name}
                  </p>
                </div>

                <div className="flex items-center gap-x-3">
                  <h4 className=" text-sm">Medication Type:</h4>
                  <p className=" text-sm font-semibold capitalize">
                    {productData?.medicationType?.name}
                  </p>
                </div>

                <div className="flex items-center gap-x-3">
                  <h4 className=" text-sm">Presentation Type:</h4>
                  <p className=" text-sm font-semibold capitalize">
                    {productData?.presentation?.name}
                  </p>
                </div>

                <div className="flex items-center gap-x-3">
                  <h4 className=" text-sm">Category:</h4>
                  <p className=" text-sm font-semibold capitalize">
                    {productData?.category?.name}
                  </p>
                </div>

                <div className="flex items-center gap-x-3">
                  <h4 className=" text-sm">Expiry Date:</h4>
                  <p className=" text-sm font-semibold">
                    {productData?.expiredAt.split("T")[0]}
                  </p>
                </div>
              </div>

              <div className=" space-y-4">
                <div className="flex bg-primary-50 text-xs items-center gap-4 px-3 py-2 w-fit">
                  <Minus className="w-3 cursor-pointer" onClick={decrement} />
                  <span>{count}</span>
                  <Plus className="w-3 cursor-pointer" onClick={increment} />
                </div>

                <button
                  className="bg-primary-500 text-white w-fit p-3 rounded-md text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => buy(productData?.id)}
                  disabled={isPendingPayment || parseInt(productData?.quantity) <= (productData?.outStockLevel ?? 0)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="text-center space-y-1 my-14">
              <h3 className="text-3xl font-semibold text-gray-900">Reviews</h3>
              <p className="text-gray-500">
                Read reviews from our satisfied customers.
              </p>
            </div>
            <div className="space-y-8">
              {reviews?.length > 0 ? (
                <>
                  {reviews?.slice(0, 3)?.map((review: string, i: number) => (
                    <StoreProductReviewComponent key={i} data={review} />
                  ))}
                </>
              ) : (
                <div>
                  <p className="text-center text-gray-500">No reviews yet</p>
                </div>
              )}
            </div>

            <div className="w-fit mx-auto my-10">
              {reviews?.length > 3 && (
                <button className="border border-primary-500 text-primary-500 w-fit py-2 px-4 mx-auto rounded-md text-sm mt-3 font-semibold">
                  Read More
                </button>
              )}
            </div>
          </div>

          <div className="w-full mx-auto mt-10">
            <h3 className="text-3xl font-semibold text-gray-900 my-3">
              Related Products
            </h3>

            {/* <div className=' flex items-center justify-between gap-x-8 '> */}
            <Flex
              overflowX="auto"
              gap={6}
              className="px-6 md:px-20 max-w-screen-2xl mx-auto"
              py={2}
              mb={8}
              sx={{
                "::-webkit-scrollbar": {
                  display: "none",
                },
                "-ms-overflow-style": "none",
                "scrollbar-width": "none",
              }}
            >
              {productData?.relatedProducts.map((product, i: number) => (
                // <p key={i}>Item {i}</p>
                <StoreProductCardComponent key={i} product={product} />
              ))}
            </Flex>
          </div>
        </div>
      )}
    </section>
  );
}
