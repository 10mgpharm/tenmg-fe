import { Badge, Button, Divider, Flex } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function OrderCardComponent({ product }) {

  // // console.log(window.location.href.includes('cancelled'))

  const router = useRouter()

  return (
    <div className='m-4 border border-gray-200 rounded-md p-4'>
      <div className='flex justify-between '>
        <div>
          <h4 className='text-lg font-medium text-gray-700'>Order #{product?.id}</h4>
          <p className='text-sm  text-gray-500 my-1'>{product?.createdAt.split("T")[0]}</p>
          {/* <p className={`text-xs  py-1 px-3 rounded-md  w-fit ${product?.status.toLowerCase() === 'completed' ? "text-green-100 bg-green-500" : product?.status.toLowerCase() === "pending" ? "text-amber-100 bg-amber-500" : "text-red-100 bg-red-500"} `}>{product?.status}</p> */}

          <Badge colorScheme={product?.status.toLowerCase() === 'completed' ? "green"
            : product?.status.toLowerCase() === "pending" ? "warning"
              : product?.status.toLowerCase() === "processing" ? "purple"
                : product?.status.toLowerCase() === "shipped" ? "blue"
                  : "red"} fontSize="10px" px="2" py="1" borderRadius="xl" variant={'solid'}>
            <span style={{ textTransform: 'capitalize' }}>{window.location.href.includes('cancelled') ? product?.refundStatus : product?.status}</span>
            {/* <span style={{ textTransform: 'capitalize' }}>{product?.status}</span> */}
            {/* <span style={{ textTransform: 'capitalize' }}>{product?.status.toLowerCase() === "cancelled" || product?.status.toLowerCase() === "canceled" ? product?.refundStatus : product?.status}</span> */}
          </Badge>
        </div>
        <p className='text-lg font-medium text-gray-900'>₦{product?.orderTotal}</p>
      </div>
      <Divider className='my-3' />
      <div>
        <div className='grid grid-cols-6 gap-x-8 items-center'>
          <div className='col-span-5'>
            <Flex
              overflowX="auto"
              gap={6}
              className="mx-auto w-full"
              py={2}
              sx={{
                '::-webkit-scrollbar': {
                  display: 'none'
                },
                '-ms-overflow-style': 'none',
                'scrollbar-width': 'none'
              }}
            >
              {
                product?.items?.map((item, index) => (
                  <Image
                    key={index}
                    src={item?.product?.thumbnailFile}
                    alt={item?.product?.name}
                    width={75}
                    height={75}
                    className='rounded-md drop-shadow-md size-16'
                  />
                ))
              }
            </Flex>
          </div>
          <Button variant="outline" size="sm" colorScheme={"blue"} className='col-span-1' onClick={() => router.push(`/storefront/orders/order-details/${product?.id}`)}>View Order</Button>
        </div>
      </div>
    </div>
  )
}
