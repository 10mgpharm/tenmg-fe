import { Button } from '@chakra-ui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import React from 'react'

export default function PendingReviewCardComponent({ product }) {
  return (
    <div className='m-4 border border-gray-200 rounded-md p-4'>
      <div>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <div style={{ backgroundImage: "url('/assets/images/pillImage.png')" }} className='size-16 bg-cover bg-center bg-no-repeat' />
            <div>
              <h4 className='text-lg font-medium text-gray-700'>{product?.product}</h4>
              <p className='text-sm  text-gray-500 my-1'>{product?.description}</p>
              <div className="flex items-center">
                <StarIcon className="w-5 fill-warning-400 stroke-none" />
                <StarIcon className="w-5 fill-warning-400 stroke-none" />
                <StarIcon className="w-5 fill-warning-400 stroke-none" />
                <StarIcon className="w-5 fill-warning-400 stroke-none" />
                <StarIcon className="w-5 fill-warning-400 stroke-none" />
              </div>
            </div>
          </div>
          <Button className='' variant={"outline"} colorScheme={"blue"} size="sm">
            <Link href={"/storefront/review"}>              View            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
