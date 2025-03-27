"use client";
import React, { useEffect, useState } from "react";
import { temp_order } from "../../orders/temporders";
import PendingReviewCardComponent from "../../../../_components/(reviews-component)/PendingReviewCardComponent";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import { Spinner } from "@chakra-ui/react";
export default function ReviewedPage() {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const [reviews, setReviews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getReviews = async (token) => {
      setLoading(true);
      try {
        const resp = await requestClient({ token }).get("/storefront/reviews");
        console.log("resp", resp);
        setReviews(resp?.data?.data || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (userData?.user?.token) getReviews(userData?.user?.token);
  }, [userData?.user?.token]);

  return (
    <div className="w-full">
      {loading ? (
        <div>
          {" "}
          <Spinner />
        </div>
      ) : (
        <>
          {reviews?.data?.length > 0 ? (
            <>
              {reviews?.data?.map((item) => (
                <PendingReviewCardComponent key={item?.id} product={item} />
              ))}
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center w-full h-fit py-32">
                <Image
                  src={"/assets/images/Homework.png"}
                  alt=""
                  width={300}
                  height={300}
                />
                <p>{`You don't have any product to review.`}</p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
