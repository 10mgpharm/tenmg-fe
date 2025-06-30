"use client";

import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import requestClient from '@/lib/requestClient';
import { NextAuthUserSession, OrderData } from '@/types';
import { convertDate } from '@/utils/formatDate';
import { Avatar, Flex, Spinner } from '@chakra-ui/react';
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
      let query = `/supplier/orders/get-order-details/${params?.id}`
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setOrder(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [params?.id, token]);

  useEffect(() => {
    if(!token) return;
    fetchOrderDetail();
  },[fetchOrderDetail, token]);

  if(loading){
    return(
      <Flex justify="center" align="center" height="200px">
        <Spinner size="xl" />
      </Flex>
    )
  }

  return (
    <div className="p-3 sm:p-5 md:p-8">
      <div className="flex items-center mb-4 md:mb-5">
        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 cursor-pointer" onClick={() => navigate.back()} />
        <span className="ml-2 md:ml-3 text-base md:text-xl font-bold truncate">
          Order {order?.identifier}
        </span>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-10">
        <div className="w-full space-y-4 md:space-y-5">
          <div className="w-full border rounded-lg shadow-sm p-3 md:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
              <div className="">
                <h2 className="text-sm md:text-base font-semibold">{order?.id}</h2>
                <p className="text-xs text-gray-400">
                  {convertDate(order?.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="border px-2 py-1 rounded-md text-xs">
                  {order?.status}
                </div>
                {/* <div className="border px-2 py-1 rounded-md text-xs">Processing</div> */}
              </div>
            </div>
            <div className="h-[1px] w-full border-0 bg-[#ebe8e8] my-2 md:my-3" />
            <div className="flex items-center">
              <Avatar src={order?.customer?.name} size={"sm"} />
              <p className="text-xs md:text-sm ml-2 md:ml-3 text-black">{order?.customer?.name}</p>
            </div>
          </div>
          <div className="w-full border rounded-lg shadow-sm p-3 md:p-4">
            <h2 className="text-sm md:text-base font-semibold">
              Order Items: {order?.items?.length}
            </h2>
            <div className="h-[1px] w-full border-0 bg-[#ebe8e8] my-2" />
            <div className="overflow-x-auto -mx-3 px-3">
              <table className="min-w-full divide-y table-auto">
                <tbody>
                  {order?.items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="pr-2 py-2">
                        <div className="">
                          <div className="flex items-center gap-2">
                            <Image
                              src={item?.product?.thumbnailFile}
                              width={"60"}
                              height={"60"}
                              alt="img"
                              className="h-[28px] w-[28px] md:h-[30px] md:w-[30px] object-cover rounded-full"
                            />
                            <p className="text-xs md:text-sm font-medium truncate max-w-[120px] sm:max-w-none">
                              {item?.product?.name}
                            </p>
                          </div>
                          <p className="text-xs font-medium mt-1 md:mt-0">
                            <span className="bg-green-100 px-0.5 rounded-sm max-w-max mr-1">
                              Commission:
                            </span>
                            <span className="font-semibold">
                              ₦{formatAmountString(item?.tenmgCommission)}
                            </span>
                          </p>
                        </div>
                      </td>
                      <td className="text-xs md:text-sm font-medium whitespace-nowrap px-2">
                        ₦{item?.discountPrice / item?.quantity}
                      </td>
                      <td className="text-xs md:text-sm font-medium whitespace-nowrap px-2">
                        x{item?.quantity}
                      </td>
                      <td className="text-xs md:text-sm font-medium text-right whitespace-nowrap pl-2">
                        ₦{item.discountPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full border rounded-lg shadow-sm p-3 md:p-4">
            <h2 className="text-sm md:text-base font-semibold">Payments</h2>
            <div className="h-[1px] w-full border-0 bg-[#ebe8e8] my-2" />
            <div className="py-1">
              <p className="text-xs md:text-sm font-semibold">Paid via debit card</p>
              <p className="text-xs text-gray-400 pt-1">16 Dec 2024, 5:40 pm</p>
            </div>
            <div className="h-[1px] w-full border-0 bg-[#ebe8e8] my-2" />
            <div className="flex items-center justify-between py-1">
              <p className="text-xs md:text-sm text-gray-400">Total Order</p>
              <p className="text-xs md:text-sm text-gray-400">
                ₦{formatAmountString(order?.orderTotal)}
              </p>
            </div>
            <div className="flex items-center justify-between py-1">
              <p className="text-xs md:text-sm text-gray-400">10mg Commission</p>
              <p className="text-xs md:text-sm text-gray-400">
                ₦{formatAmountString(order?.totalTenmgComission)}
              </p>
            </div>
            <div className="flex items-center justify-between py-1">
              <p className="text-xs md:text-sm text-gray-400">Shipping Fee</p>
              <p className="text-xs md:text-sm text-gray-400">
                ₦{formatAmountString(order?.logisticTotal)}
              </p>
            </div>
            <div className="flex items-center justify-between py-1">
              <p className="text-xs md:text-sm font-semibold">Total for Supplier</p>
              <p className="text-xs md:text-sm font-semibold">
                ₦
                {formatAmountString(
                  Number(order?.orderTotal) - order?.totalTenmgComission
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/3 border h-fit rounded-lg shadow-sm p-3 md:p-4">
          <h2 className="text-sm md:text-base font-semibold">Customer</h2>
          <div className="h-[1px] w-full border-0 bg-[#ebe8e8] my-2" />
          <p className="text-xs md:text-sm font-medium">{order?.customer?.name}</p>
          <p className="text-xs text-gray-600 mt-1">{order?.customer?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;