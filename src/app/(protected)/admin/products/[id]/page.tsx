"use client";

// import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
    Flex,
    HStack, 
    Image, 
    Spinner, 
    Text 
} from '@chakra-ui/react';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import Statistics from '../_components/Statistics';
import { useCallback, useEffect, useState } from 'react';
import requestClient from '@/lib/requestClient';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession, ProductDataProps } from '@/types';
import ExploreData from '../_components/ExploreData';
import { convertDate } from '@/utils/formatDate';
import productImage from '../../../../../../public/assets/images/product.svg'

const ProductDetail = ({params}: {params: {id: string}} ) => {
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
    }, [token]);

    useEffect(() => {
        if(!token) return;
        fetchProducts();
    },[fetchProducts, token]);

    if(loading){
        return(
            <Flex justify="center" align="center" height="200px">
                <Spinner size="xl" />
            </Flex>
        )
    }

    return (
    <div className='p-8'>
        <HStack onClick={() => router.back()} cursor={"pointer"}>
            <ArrowLeftIcon className='w-5 h-5'/>
            <Text>Back</Text>
        </HStack>
        <div className="mt-5">
            <div className="flex gap-5 mb-3">
                <div className="">
                    <Image 
                    src={products?.thumbnailFile}
                    fallbackSrc={productImage}
                    alt='' 
                    width={380} 
                    height={340} 
                    className='w-[380px] h-[340px] object-cover rounded-md'
                    />
                </div>
                <div className="flex-1 bg-white p-5 rounded-md pb-9">
                    <div className="flex items-center justify-between">
                        <h2 className='text-lg font-semibold mb-4'>{products?.name}</h2>
                        <h2 className='text-lg font-semibold mb-4 text-primary-500'>₦{Number(products?.actualPrice)?.toLocaleString()}.00</h2>
                    </div>
                    <p className=''>{products?.description}</p>
                    <ul className='list-disc mt-5 space-y-2 list-inside ml-4'>
                        <li className='text-sm'>Brand: <span className='font-semibold ml-1'>{products?.brand?.name}</span></li>
                        <li className='text-sm'>Value (strength):<span className='font-semibold ml-1'>{products?.measurement?.name}</span></li>
                        <li className='text-sm'>Category:<span className='font-semibold ml-1'>{products?.category?.name}</span></li>
                        <li className='text-sm'>Presentation:<span className='font-semibold ml-1'>{products?.presentation?.name}</span></li>
                        <li className='text-sm'>Medication Type:<span className='font-semibold ml-1'>{products?.medicationType?.name}</span></li>
                        <li className='text-sm'>Expiration Date:<span className='font-semibold ml-1'>{convertDate(products?.expiredAt)}</span></li>
                    </ul>
                </div>
            </div>
            <div className="mt-5">
                <Statistics />
                <ExploreData />
            </div>
        </div>
    </div>
  )
}

export default ProductDetail