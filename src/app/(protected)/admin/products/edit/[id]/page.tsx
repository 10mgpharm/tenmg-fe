"use client";

import requestClient from '@/lib/requestClient'
import { handleServerErrorMessage } from '@/utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { IFormInput } from '../../add-product/page'
import { 
    MedicationResponseData, 
    NextAuthUserSession, 
    ProductResponseData 
} from '@/types'
import DetailForm from '@/app/(protected)/suppliers/products/_components/DetailForm'
import EssentialForm from '@/app/(protected)/suppliers/products/_components/EssentialForm'
import InventoryForm from '@/app/(protected)/suppliers/products/_components/InventoryForm'

const EditPage = ({params}: {params: {id: string}}) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [steps, setSteps] = useState<'details' | 'essentials' | 'inventory'>(null);

    useEffect(() => {
        setSteps("details");
    },[])

    const router = useRouter();
    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;

    const [products, setProducts] = useState<ProductResponseData>();
    const [brandData, setBrandData] = useState<MedicationResponseData>();
    const [categoryData, setCategoryData] = useState<MedicationResponseData>();
    const [medicationData, setMedicationData] = useState<MedicationResponseData>();

    const fetchSingleProduct = useCallback(async () => {
        setIsLoading(true);
        try {
        const response = await requestClient({ token: token }).get(
            `/admin/settings/products/${params.id}`
        );
        if (response.status === 200) {
            setProducts(response.data.data);
        }
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    }, [token]);

    const fetchingMedicationTypes = useCallback(async() => {
        try {
            const response = await requestClient({ token: token }).get(
                `/admin/settings/medication-types`
            );
        if(response.status === 200){
            setMedicationData(response.data.data);
        }
        } catch (error) {
            console.error(error)
        }
    },[token]);

    const fetchingBrandTypes = useCallback(async() => {
        try {
            const response = await requestClient({ token: token }).get(
                `/admin/settings/brands`
            );
        if(response.status === 200){
            setBrandData(response.data.data);
        }
        } catch (error) {
            console.error(error)
        }
    },[token]);

    const fetchingCategoriesTypes = useCallback(async() => {
        try {
            const response = await requestClient({ token: token }).get(
                `/admin/settings/categories`
            );
        if(response.status === 200){
            setCategoryData(response.data.data);
        }
        } catch (error) {
            console.error(error)
        }
    },[token]);

    const fetchAllProducts = useCallback(async () => {
        try {
        const response = await requestClient({ token: token }).get(
            `/admin/settings/products`
        );
        } catch (error) {
            console.error(error);
        }
    }, [token]);

    useEffect(() => {
        if(!token) return;
        fetchSingleProduct()
        fetchingBrandTypes();
        fetchingCategoriesTypes();
        fetchingMedicationTypes();
    }, [fetchSingleProduct, fetchingBrandTypes, fetchingCategoriesTypes, fetchingMedicationTypes, token]);

    const {
        control,
        register,
        formState: { errors, isValid },
        handleSubmit,
        setValue,
        getValues,
    } = useForm<IFormInput>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setIsLoading(true);
        const expiryDate = data?.expiredAt.toISOString();
        const formdata = new FormData();
        formdata.append("productName", data.productName);
        formdata.append("productDescription", data.productDescription);
        formdata.append("medicationTypeName", data.medicationTypeName)
        formdata.append("categoryName", data?.categoryName);
        formdata.append("brandName", data?.brandName);
        formdata.append("weight", data?.weight);
        formdata.append("packageName", data?.brandName);
        formdata.append("presentationName", data?.presentationName);
        formdata.append("strengthValue", '1');
        formdata.append("measurementName", data?.measurementName);
        formdata.append("lowStockLevel", data?.lowStockLevel);
        formdata.append("outStockLevel", data?.outStockLevel);
        formdata.append("expiredAt", expiryDate);
        formdata.append("thumbnailFile", data?.thumbnailFile);
        formdata.append("actualPrice", data?.actualPrice);
        formdata.append("discountPrice", data?.discountPrice);
        formdata.append("quantity", data?.quantity);
        formdata.append("status", "ACTIVE");

        try {
            const response = await requestClient({token: token}).post(
                "/admin/settings/products",
                formdata
            )
            if(response.status === 200){
                setIsLoading(false);
                fetchAllProducts();
                router.push('/admin/products')

            }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error(handleServerErrorMessage(error));
        }
    }

    if (steps === null) {
        // Render a loading state or placeholder until the state is initialized
        return <div>Loading...</div>;
      }

    return (
    <div>
        <form 
        // onSubmit={handleSubmit(onSubmit)}
        >
            {(() => {
                    switch (steps) {
                        case 'details':
                            return <DetailForm 
                                title="Edit Product"
                                setSteps={setSteps}
                                brands={brandData?.data}
                                categories={categoryData?.data}
                                control={control}
                                register={register}
                                errors={errors}
                                setValue={setValue}
                                getValue={getValues}
                                handleStepValidation={function (): void {
                                    throw new Error('Function not implemented.');
                                }}
                            />
                        case 'essentials':
                            return <EssentialForm 
                                    setSteps={setSteps}
                                    register={register}
                                    medications={medicationData?.data}
                                    setValue={setValue}
                                    control={control}
                                    errors={errors}
                                    handleStepValidation={function (): void {
                                        throw new Error('Function not implemented.');
                                    }}
                                />
                        case 'inventory':
                            return <InventoryForm 
                                    setSteps={setSteps}
                                    register={register}
                                    control={control}
                                    errors={errors}
                                    setValue={setValue}
                                    isLoading={isLoading}
                                />
                        default:
                            break;
                    }
                }
            )()
            }
        </form>
    </div>
  )
}

export default EditPage