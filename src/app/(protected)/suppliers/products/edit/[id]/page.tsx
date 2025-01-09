"use client";

import requestClient from '@/lib/requestClient'
import { handleServerErrorMessage } from '@/utils'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { 
    MedicationResponseData, 
    NextAuthUserSession, 
    ProductDataProps,  
} from '@/types'
import DetailForm from '@/app/(protected)/suppliers/products/_components/DetailForm'
import EssentialForm from '@/app/(protected)/suppliers/products/_components/EssentialForm'
import InventoryForm from '@/app/(protected)/suppliers/products/_components/InventoryForm'
import { IFormInput } from '@/app/(protected)/admin/products/add-product/page';
import SuccessModal from '../../_components/SuccessModal';
import { useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const EditPage = ({params}: {params: {id: string}}) => {

    const router = useRouter();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [steps, setSteps] = useState<'details' | 'essentials' | 'inventory'>(null);

    useEffect(() => {
        setSteps("details");
    },[])

    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;

    const [products, setProducts] = useState<ProductDataProps>();
    const [brandData, setBrandData] = useState<MedicationResponseData>();
    const [categoryData, setCategoryData] = useState<MedicationResponseData>();
    const [medicationData, setMedicationData] = useState<MedicationResponseData>();

    const fetchSingleProduct = useCallback(async () => {
        setIsLoading(true);
        try {
        const response = await requestClient({ token: token }).get(
            `/supplier/products/${params.id}`
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
                `/supplier/medication-types`
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
                `/supplier/brands`
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
                `/supplier/categories`
            );
        if(response.status === 200){
            setCategoryData(response.data.data);
        }
        } catch (error) {
            console.error(error)
        }
    },[token]);

    const fetchingProducts = useCallback(async() => {
        try {
            const response = await requestClient({ token: token }).get(
                `/supplier/products`
            );
        } catch (error) {
            console.error(error)
        }
    },[token]);

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
        trigger,
        getValues,
    } = useForm<IFormInput>({
        mode: "onChange",
    });

    useEffect(() => {
        setValue("productName", products?.name);
        setValue("brandName", products?.brand?.name);
        setValue("categoryName", products?.category?.name);
        setValue("productDescription", products?.description);
        setValue("thumbnailFile", products?.thumbnailFile);
        setValue("medicationTypeName", products?.medicationType?.name);
        setValue("presentationName", products?.presentation?.name);
        setValue("measurementName", products?.measurement?.name);
        setValue("packageName", products?.package?.name);
        setValue("strengthValue", products?.medicationType?.variations?.[0].strengthValue);
        setValue("packageName", products?.medicationType?.variations?.[0].packagePerRoll)
        setValue("weight", products?.medicationType?.variations?.[0]?.weight.toString());
        setValue("actualPrice", products?.actualPrice);
        setValue("discountPrice", products?.discountPrice);
        setValue("quantity", products?.quantity);
        setValue("lowStockLevel", products?.lowStockLevel?.toString());
        setValue("outStockLevel", products?.outStockLevel?.toString());
        setValue("expiredAt", products?.expiredAt);
    }, [products]);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setIsLoading(true);
        const formdata = new FormData();
        formdata.append("productName", data.productName);
        formdata.append("productDescription", data.productDescription);
        formdata.append("medicationTypeName", data.medicationTypeName)
        formdata.append("categoryName", data?.categoryName);
        formdata.append("brandName", data?.brandName);
        formdata.append("weight", data?.weight);
        formdata.append("packageName", data?.packageName);
        formdata.append("presentationName", data?.presentationName);
        formdata.append("strengthValue", data?.strengthValue);
        formdata.append("measurementName", data?.measurementName);
        formdata.append("lowStockLevel", data?.lowStockLevel);
        formdata.append("outStockLevel", data?.outStockLevel);
        formdata.append("expiredAt", data?.expiredAt);
        formdata.append("thumbnailFile", data?.thumbnailFile);
        formdata.append("actualPrice", data?.actualPrice);
        formdata.append("discountPrice", data?.discountPrice);
        formdata.append("quantity", data?.quantity);
        formdata.append("status", "ACTIVE");

        try {
            const response = await requestClient({token: token}).patch(
                `/supplier/products/${products.id}`,
                formdata
            )
            if(response.status === 200){
                setIsLoading(false);
                toast.success(response.data?.message);
                fetchingProducts();
                router.push('/suppliers/products')
            }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error(handleServerErrorMessage(error));
        }
    }

    if (steps === null) {
        return <div>Loading...</div>;
    }

    const handleStepValidation = async (fieldsToValidate: any) => {
        const isValid = await trigger(fieldsToValidate);
        return isValid;
    };  
    return (
    <div>
        <form 
        onSubmit={handleSubmit(onSubmit)}
        >
            {(() => {
                    switch (steps) {
                        case 'details':
                            return <DetailForm 
                                    title="Edit Product"
                                    isEditing={true}
                                    handleStepValidation={
                                        async () => {
                                        const isValid = await handleStepValidation([
                                            "productName", 
                                            "productDescription", 
                                            "categoryName", 
                                            "brandName", 
                                            "thumbnailFile"
                                        ]);
                                        if (isValid) setSteps("essentials");
                                    }}
                                    brands={brandData?.data} 
                                    categories={categoryData?.data} 
                                    control={control}
                                    register={register}
                                    errors={errors}
                                    setValue={setValue}
                                    getValue={getValues}
                                />
                        case 'essentials':
                            return <EssentialForm
                                    isEditing={true} 
                                    type="supplier"
                                    handleStepValidation={
                                        async () => {
                                        const isValid = await handleStepValidation([
                                            "medicationTypeName", 
                                            "measurementName", 
                                            "presentationName", 
                                            "strengthValue", 
                                            "packageName", 
                                            "weight", 
                                            "actualPrice", 
                                            "discountPrice"
                                        ]);
                                        if (isValid) setSteps("inventory");
                                    }}
                                    setSteps={setSteps}
                                    register={register}
                                    control={control}
                                    medications={medicationData?.data}
                                    errors={errors}
                                    setValue={setValue}
                                />
                        case 'inventory':
                            return <InventoryForm 
                                    isEditing={true}
                                    data={products}
                                    setSteps={setSteps}
                                    register={register}
                                    control={control}
                                    errors={errors}
                                    isLoading={isLoading}
                                />
                        default:
                            break;
                    }
                }
            )()
            }
        </form>
        <SuccessModal
            isOpen={isOpen} 
            onClose={onClose}
            routeUrl="/suppliers/products"
            isEditing={true}
            routeUrl2="/suppliers/product/new"
        />
    </div>
  )
}

export default EditPage