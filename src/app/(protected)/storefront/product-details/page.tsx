import { Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import StoreProductReviewComponent from '../_components/StoreProductReviewComponent'
import StoreProductCardComponent from '../_components/StoreProductCardComponent'
import BreadCrumbBanner from '../components/BreadCrumbBanner'
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

  return (
    <section className=' '>
      <BreadCrumbBanner breadCrumbsData={breadCrumb} />
      <div className=' w-11/12 mx-auto my-10'>

        <div className='flex items-center justify-between gap-6 mx-auto w-11/12 flex-col lg:flex-row'>
          {/* <div
          style={{ backgroundImage: "url('/assets/images/productImgDetails.png')" }}
          // style={{ backgroundImage: "url('/assets/images/pillImage.png')" }}
          className='max-w-[568px] w-full lg:w-1/2 h-[611px] '
        /> */}
          {/* product iamge container */}
          <div className='w-full lg:w-1/2 rounded-sm'>
            <Image
              width={568}
              height={611}
              src={'/assets/images/productImgDetails.png'}
              alt=''
            />
          </div>

          {/* description container */}
          <div className='w-full lg:w-1/2 flex flex-col gap-6 px-8'>
            <h2 className='text-6xl font-semibold'>Harmony Biotic Digestive Tablets</h2>
            <p className='text-3xl font-semibold'>₦45,030</p>
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






