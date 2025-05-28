"use client";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Flex,
    HStack,
    Image,
    Spinner,
    Tag,
    TagLabel,
    Text
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import requestClient from '@/lib/requestClient';
import { classNames } from '@/utils';
import { convertDate } from '@/utils/formatDate';
// import Statistics from '../_components/Statistics';
import ExploreData from '../_components/ExploreData';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { NextAuthUserSession, ProductDataProps } from '@/types';
import productImage from '../../../../../../public/assets/images/product.svg'
import RatingComponent from '@/app/(protected)/storefront/_components/RatingComponent';

const ProductDetail = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [loading, setLoading] = useState<boolean>(false);

    const [products, setProducts] = useState<ProductDataProps>();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await requestClient({ token: token }).get(
                `/admin/settings/products/${params.id}`
            );
            if (response.status === 200) {
                setProducts(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [token, params.id]);

    useEffect(() => {
        if (!token) return;
        fetchProducts();
    }, [fetchProducts, token]);

    if (loading) {
        return (
            <Flex justify="center" align="center" height="200px">
                <Spinner size="xl" />
            </Flex>
        )
    }

    const productPrice = Number(products?.actualPrice) - Number(products?.discountPrice);

    return (
        <div className='p-8'>
            <Flex justify={"space-between"} align={"center"}>
                <HStack onClick={() => router.back()} cursor={"pointer"}>
                    <ArrowLeftIcon className='w-5 h-5' />
                    <Text>Back</Text>
                </HStack>
                <Link
                    className='bg-primary-500 p-2.5 w-28 font-medium text-center rounded-md text-white'
                    href={`/admin/products/edit/${params.id}`}>
                    Edit
                </Link>
            </Flex>
            <div className="mt-5">
                <div className="flex flex-col lg:flex-row  gap-5 mb-3">
                    <div className="p-5 bg-white rounded-md relative">
                        <Image
                            src={products?.thumbnailFile}
                            fallbackSrc={productImage}
                            alt=''
                            width={380}
                            height={340}
                            className='w-[380px] h-[340px] object-cover rounded-md mx-auto'
                        />

                        <div className='absolute top-6 right-6'>
                            <Tag
                                size="sm"
                                ml="1"
                                borderRadius="full"
                                color={
                                    parseInt(products?.quantity) <= (products?.outStockLevel ?? 0)
                                        ? "error.500"
                                        : parseInt(products?.quantity) >= (products?.outStockLevel ?? 0) && parseInt(products?.quantity) <= products?.lowStockLevel
                                            ? "warning.500"
                                            : "green.500"
                                }
                                bgColor={
                                    parseInt(products?.quantity) <= (products?.outStockLevel ?? 0)
                                        ? "error.100"
                                        : parseInt(products?.quantity) >= (products?.outStockLevel ?? 0) && parseInt(products?.quantity) <= products?.lowStockLevel
                                            ? "warning.100"
                                            : "green.100"
                                }
                            >
                                <TagLabel className="">
                                    {
                                        parseInt(products?.quantity) <= (products?.outStockLevel ?? 0)
                                            ? "Out of Stock"
                                            : parseInt(products?.quantity) >= (products?.outStockLevel ?? 0) && parseInt(products?.quantity) <= products?.lowStockLevel
                                                ? "Low In Stock"
                                                : "In Stock"
                                    }
                                </TagLabel>
                            </Tag>
                        </div>
                    </div>

                    <div className="flex-1 bg-white p-5 rounded-md pb-9">
                        <div className="flex items-center gap-2">
                            <div className='mb-2'>
                                <p className={classNames(
                                    (products?.status === "PENDING" || products?.status === "INACTIVE")
                                        ? "bg-[#FEF3F2] text-[#B42318]"
                                        : products?.status === "ACTIVE"
                                            ? "text-[#027A48] bg-[#ECFDF3]"
                                            : products?.status === "APPROVED"
                                                ? "bg-blue-50 text-blue-500"
                                                : products?.status === "FLAGGED"
                                                    ? "bg-orange-50 text-orange-500"
                                                    : "text-gray-500", " max-w-min px-2 rounded-xl py-0.5 capitalize text-xs font-medium flex items-center gap-1"
                                )}>
                                    <span className="text-[1.2rem] rounded-full">•</span>
                                    {" "}
                                    {products?.status === "APPROVED" ? "ACTIVE" : products?.status}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="">
                                <h2 className='text-lg font-semibold capitalize text-primary-900'>
                                    {`${products?.brand?.name} 
                                ${products?.name} 
                                ${products?.variation?.strengthValue}${products?.measurement.name ?? ""}
                                - ${products?.presentation?.name}`}
                                </h2>
                                <div className='my-2'>
                                    <RatingComponent
                                        rating={products?.rating?.avgRating ?? 0}
                                        // rating={0}
                                        handleRating={() => { }}
                                        readonly={true}
                                    />
                                </div>

                                <p className='max-w-sm text-gray-500 text-sm'>{products?.description}</p>
                            </div>
                            <div className="">
                                <h2 className='text-lg font-semibold text-primary-500'>₦{productPrice?.toLocaleString()}.00</h2>
                                <h2 className='text-sm font-medium text-gray-400 line-through'>₦{Number(products?.actualPrice)?.toLocaleString()}.00</h2>
                            </div>
                        </div>
                        <ul className='list-disc mt-5 space-y-2 list-inside ml-4'>
                            <li className='text-sm'>Brand: <span className='font-semibold ml-1'>{products?.brand?.name}</span></li>
                            <li className='text-sm'>Value (strength):<span className='font-semibold ml-1'>{products?.variation?.strengthValue}</span></li>
                            <li className='text-sm'>Measurement:<span className='font-semibold ml-1'>{products?.measurement?.name}</span></li>
                            <li className='text-sm'>Category:<span className='font-semibold ml-1'>{products?.category?.name}</span></li>
                            <li className='text-sm'>Presentation:<span className='font-semibold ml-1'>{products?.presentation?.name}</span></li>
                            <li className='text-sm'>Medication Type:<span className='font-semibold ml-1'>{products?.medicationType?.name}</span></li>
                            <li className='text-sm'>Expiration Date:<span className='font-semibold ml-1'>{convertDate(products?.expiredAt)}</span></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-5">
                    {/* <Statistics /> */}
                    <ExploreData />
                </div>
            </div>
        </div>
    )
}

export default ProductDetail