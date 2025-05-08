
"use client";
import React, { useEffect, useState } from "react";
import { StarIcon } from "lucide-react";
import Link from "next/link";
import { temp_order } from "../../orders/temporders";
import BreadCrumbBanner from "../../../../_components/BreadCrumbBanner";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import { useRouter } from "next/navigation";
import RatingComponent from "@/app/(protected)/storefront/_components/RatingComponent";

export default function ReviewPage() {
  const breadCrumb = [
    {
      text: "Reviews",
      link: "/reviews/reviewed",
    },
    {
      text: "Product",
      link: "#",
    },
  ];

  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const [id, setId] = useState(null);
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    const url = window.location.href.split('/');
    setId(url[url.length - 1])
  }, [])


  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const data = await requestClient({ token: userData?.user?.token }).get(`/storefront/products/${id.toLocaleLowerCase()}`);
        setProduct(data?.data?.data);
        setReviews(data?.data?.data?.reviews?.data);
      } catch (e) {
        console.log(e)
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProductData();


  }, [userData?.user?.token, id]);


  return (
    <div>
      {/* <BreadCrumbBanner breadCrumbsData={breadCrumb} /> */}
      <ReviewPageProductCard product={product} />
    </div>
  );
}

const ReviewPageProductCard = ({ product }) => {
  return (
    <>
      <div className="m-4 border border-gray-200 rounded-md p-4">
        <div>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Link href={`/storefront/product/${product?.id}`} className='w-full'>
                <div style={{ backgroundImage: `url( ${product?.product?.thumbnailFile && product?.product?.thumbnailFile?.length > 0 ? product?.product?.thumbnailFile : '/assets/images/pillImage.png'})` }} className='size-16 bg-cover bg-center bg-no-repeat' />
              </Link>
              <div>
                <Link href={`/storefront/product/${product?.id}`} className='w-full'>
                  <h4 className='text-lg font-medium text-gray-700'>{product?.name} {product?.variation?.strengthValue}{product?.measurement?.name}</h4>
                </Link>
                <p className='text-sm  text-gray-500 my-1'>{product?.description}</p>
                <div className="flex items-center">
                  <RatingComponent
                    rating={product?.rating ?? 0}
                    handleRating={() => { }}
                    readonly={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        product?.reviews?.data?.map((review, i) => (<div className='m-4 border border-gray-200 rounded-md p-4' key={i}>
          <div className='flex items-center justify-between'>
            <h4 className='text-lg font-medium text-gray-700'>{review?.name}</h4>
            {/* <h3>{`A must-have product`}</h3> */}
            <p>{review?.comment}</p>
          </div>
        </div>
        ))}
    </>
  );
};
