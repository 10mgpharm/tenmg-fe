'use client'
import { Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import { usePathname } from 'next/navigation'
import requestClient from '@/lib/requestClient'
import { useSession } from 'next-auth/react'
import { NextAuthUserSession } from '@/types'
import BreadCrumbBanner from '../../_components/BreadCrumbBanner'
import StoreProductReviewComponent from '../../_components/StoreProductReviewComponent'
import StoreProductCardComponent from '../../_components/StoreProductCardComponent'
// ?NOTE: this page is going to be a dynamic page where the id of the product will be used to fetch and populate the information on the page.
export default function ProductDetailPage() {

  const breadCrumb = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Products',
      link: '/storefront'
    },
    {
      text: 'Vaccines',
      link: '#'
    }
  ]

  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const path = usePathname();
  const splitPath = path.split('/');
  const product = splitPath[splitPath.length - 1];

  const [productData, setProductData] = useState(null);

  useEffect(() => {

    const fetchProductData = async () => {
      try {
        const data = await requestClient({ token: userData?.user?.token }).get(`/storefront/products/${product}`);
        // console.log(data);
        setProductData(data?.data?.data);
      } catch (e) {
        console.log(e)
      }
    }
    fetchProductData();


  }, [userData?.user?.token, product]);

  console.log("productData", productData);

  //   {
  //     "id": 4,
  //     "name": "paracetemol",
  //     "quantity": 1000,
  //     "actualPrice": "10000.00",
  //     "discountPrice": "5000.00",
  //     "minDeliveryDuration": null,
  //     "maxDeliveryDuration": null,
  //     "thumbnailUrl": "https://tenmg-sanbox-bucket.s3.eu-west-1.amazonaws.com/uploads/files/2024-12-Dec/J51KctD2xWqwuiCy.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARLXAFSIQP34FJGJM%2F20241214%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20241214T153404Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1800&X-Amz-Signature=3dceadeb298eb7ef335204e15335da67827251aded1d5f48c4793a917b688cf8",
  //     "expiredAt": null,
  //     "productDetails": {
  //         "essential": null,
  //         "startingStock": null,
  //         "currentStock": null
  //     },
  //     "status": "ACTIVE",
  //     "inventory": "OUT OF STOCK",
  //     "comment": null
  // }



  return (
    <section className=' '>
      <BreadCrumbBanner breadCrumbsData={breadCrumb} />
      <div className=' w-11/12 mx-auto my-10'>

        <div className='flex items-center justify-between gap-6 mx-auto w-11/12 flex-col lg:flex-row'>

          {/* product iamge container */}
          <div className='w-full lg:w-1/2 rounded-sm'>
            <Image
              width={568}
              height={611}
              // src={'/assets/images/productImgDetails.png'}
              src={productData?.thumbnailUrl ? productData?.thumbnailUrl : '/assets/images/productImgDetails.png'}
              alt=''
            />
          </div>

          {/* description container */}
          <div className='w-full lg:w-1/2 flex flex-col gap-6 px-8'>
            <h2 className='text-6xl font-semibold'>{productData?.name}</h2>
            <div className='flex items-center gap-x-2'>
              {productData?.discountPrice > 0 && productData?.discountPrice !== productData?.actualPrice && <p className='text-3xl font-semibold'>{productData?.discountPrice}</p>}
              <p className={`text-3xl font-semibold ${productData?.discountPrice > 0 && productData?.discountPrice !== productData?.actualPrice && "text-red-500 line-through"}`}>{productData?.actualPrice}</p>
            </div>

            <p className='text-sm'>Expertly formulated with a blend of probiotics, these tablets support a harmonious
              gut environment, promoting smooth digestion and overall digestive wellness for a
              happier, healthier you.</p>


            <div className='flex items-center gap-4'>
              <div className='flex bg-primary-50 text-xs items-center gap-4 px-3 py-2'>
                <Minus className='w-3' />
                <span>1</span>
                <Plus className='w-3' />
              </div>

              <button className='bg-primary-500 text-white w-fit p-3  rounded-md text-xs font-semibold'>Buy Now</button>
            </div>

            <div className='flex gap-4 bg-gray-25 px-8 py-5 rounded-md'>
              <div className='w-1/2 '>
                <h4 className='text-2xl text-primary-500 font-semibold'>Ingredients:</h4>
                <p className='text-[14px] my-1'>Probiotic Blend (Lactobacillus acidophilus)</p>
                <p className='text-[14px] my-1'>Prebiotic Fiber</p>
                <p className='text-[14px] my-1'>Digestive Enzymes (Amylase,Protease, Lipase)</p>
              </div>
              <div className='w-1/2 '>
                <h4 className='text-2xl text-primary-500 font-semibold'>Key Features:</h4>
                <p className='text-[14px] my-1'>Supports digestive health</p>
                <p className='text-[14px] my-1'>Balances gut flora</p>
                <p className='text-[14px] my-1'>Aids in nutrient absorption</p>
              </div>
            </div>
          </div>
        </div>

        <div className='w-full'>
          <div className='text-center space-y-1 my-14'>
            <h3 className='text-3xl font-semibold text-gray-900'>Reviews</h3>
            <p className='text-gray-500'>Read reviews from our satisfied customers.</p>
          </div>
          <div className='space-y-8'>
            {Array(4)
              .fill(null)
              .map((_, i: number) => (
                // <p key={i}>Item {i}</p>
                <StoreProductReviewComponent key={1} />
              ))}
          </div>

          <div className='w-fit mx-auto my-10'>
            <button className='border border-primary-500 text-primary-500 w-fit py-2 px-4 mx-auto rounded-md text-sm mt-3 font-semibold'>Read More</button>
          </div>
        </div>


        <div className='w-full mx-auto'>
          <h3 className='text-3xl font-semibold text-gray-900 my-3'>Related Products</h3>

          <div className=' flex items-center justify-between gap-x-8 '>
            {Array(4)
              .fill(null)
              .map((_, i: number) => (
                // <p key={i}>Item {i}</p>
                <StoreProductCardComponent key={1} />
              ))}
          </div>
        </div>

      </div>
    </section>
  )
}






