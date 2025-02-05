"use client";

import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import requestClient from '@/lib/requestClient';
import { NextAuthUserSession, OrderData } from '@/types';
import { convertDate } from '@/utils/formatDate';
import { Avatar } from '@chakra-ui/react';
import { formatAmountString } from '@/utils';

const OrderDetails = ({params}: {params : any}) => {

  const navigate = useRouter();
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;

  const token = sessionData?.user?.token;
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData>();

  const fetchOrderDetail = useCallback(async () => {
    setLoading(true);
    try {
      let query = `/admin/orders/get-order-details/${params?.id}`
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setOrder(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if(!token) return;
    fetchOrderDetail();
  },[fetchOrderDetail, token]);

  return (
    <div className=" p-8">
      <div className="flex items-center mb-5">
        <ArrowLeft className='w-6 h-6' onClick={() => navigate.back()} />
        <span className="ml-3 text-xl font-bold">Order {order?.id}</span>
      </div>
      <div className='flex justify-between gap-10'>
        <div className="w-full space-y-5">
          <div className="w-full border rounded-lg shadow-sm p-4">
            <div className="flex justify-between">
              <div className="">
                <h2 className='text-base font-semibold'>{order?.id}</h2>
                <p className="text-xs text-gray-400 py12">{convertDate(order?.createdAt)}</p>
              </div>  
              <div className="flex items-center">
                <div className='border px-2 py-1 rounded-md text-xs'>{order?.status}</div>
              </div>  
            </div>
            <div className="h-[1px] w-full border-0 bg-[#ebe8e8] my-3" />
            <div className="flex items-center">
              <Avatar src={order?.customer?.name} size={"sm"}/>
              <p className='text-sm ml-3 text-black'>{order?.customer?.name}</p>
            </div>
          </div>
          <div className="w-full border rounded-lg shadow-sm p-4">
            <h2 className='text-base font-semibold'>Order Items: {order?.items?.length}</h2>
            <div className="h-[1px] w-full border-0 bg-[#ebe8e8] my-2" />
            {
              order?.items?.length === 0 && 
              <div className="flex justify-center py-5">
                <p className='text-sm text-center text-gray-500 font-medium'>No Order Item Found!</p>
              </div>
            }
            <table className='min-w-full divide-y table-auto px-3'>
              <tbody>
                {order?.items?.map((item: any) => (
                  <tr key={item.id}>
                    <td className=''>
                      <div className="">
                        <div className='flex items-center gap-2'>
                          <Image 
                          src={item?.product?.thumbnailFile} 
                          width={"60"} 
                          height={"60"} 
                          alt="img" 
                          className="h-[30px] w-[30px] object-cover rounded-full" 
                          />
                          <p className='text-sm font-medium py-3'>{item?.product?.name}</p>
                        </div>
                        <p className='text-xs font-medium'>
                          <span className='bg-green-100 px-0.5 rounded-sm max-w-max mr-1'>Commission:</span>
                          <span className='font-semibold'>₦{formatAmountString(item?.tenmgCommission)}</span>
                        </p>
                      </div>
                    </td>
                    <td className='text-sm font-medium'>₦{item?.discountPrice/item?.quantity}</td>
                    <td className='text-sm font-medium'>x{item?.quantity}</td>
                    <td className='text-sm font-medium text-right'>₦{item.discountPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full border rounded-lg shadow-sm p-4">
            <h2 className='text-base font-semibold'>Payments</h2>
            <div className="h-[1px] w-full border-0 bg-[#ebe8e8] my-2" />
            <div className="py-1">
              <p  className='text-sm font-semibold'>Paid via debit card</p>
              <p className="text-xs text-gray-400 pt-1">16 Dec 2024, 5:40 pm</p>
            </div>
            <div className="h-[1px] w-full border-0 bg-[#ebe8e8] my-2" />
            <div className="flex items-center justify-between py-1">
              <p className="text-sm text-gray-400">Subtotal</p>
              <p className="text-sm text-gray-400">₦{formatAmountString(order?.orderTotal)}</p>
            </div>
            <div className="flex items-center justify-between py-1">
              <p className="text-sm text-gray-400">Commission</p>
              <p className="text-sm text-gray-400">₦{formatAmountString(order?.totalTenmgComission)}</p>
            </div>
            <div className="flex items-center justify-between py-1">
              <p className="font-semibold text-sm">Total</p>
              <p className="font-semibold text-sm">₦{formatAmountString(order?.grandTotal)}</p>
            </div>
          </div>
        </div>
        <div className="w-full border h-fit rounded-lg shadow-sm p-4">
          <h2 className='text-base font-semibold'>Customer</h2>
          <div className="h-[1px] w-full border-0 bg-[#ebe8e8] my-2" />
          <p  className='text-sm font-medium'>{order?.customer?.name}</p>
          <p className='text-xs text-gray-600'>{order?.customer?.email}</p>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails;