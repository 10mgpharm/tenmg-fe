"use client";

import { useCallback, useEffect, useState } from "react";
import DetailForm from "@/app/(protected)/suppliers/products/_components/DetailForm";
import EssentialForm from "@/app/(protected)/suppliers/products/_components/EssentialForm";
import InventoryForm from "@/app/(protected)/suppliers/products/_components/InventoryForm";
import { useSession } from "next-auth/react";
import { MedicationResponseData, NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { useRouter } from "next/navigation";

export interface IFormInput {
    productName: string;
    productDescription: string;
    medicationTypeName: string;
    categoryName: string;
    brandName: string;
    measurementName: string;
    presentationName: string;
    packageName: string;
    strengthValue: string;
    actualPrice: string;
    discountPrice: string;
    lowStockLevel: string;
    outStockLevel: string;
    weight: string | null;
    quantity: string;
    expiredAt: any;
    thumbnailFile: string;
    status: string;
}

const AddProducts = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [steps, setSteps] = useState<'details' | 'essentials' | 'inventory'>(null);

    useEffect(() => {
        setSteps("details");
    },[])

    const router = useRouter();
    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;

    const [brandData, setBrandData] = useState<MedicationResponseData>();
    const [categoryData, setCategoryData] = useState<MedicationResponseData>();
    const [medicationData, setMedicationData] = useState<MedicationResponseData>();

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

    const fetchProducts = useCallback(async () => {
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
        fetchingBrandTypes();
        fetchingCategoriesTypes();
        fetchingMedicationTypes();
    }, [fetchingBrandTypes, fetchingCategoriesTypes, fetchingMedicationTypes, token]);

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

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setIsLoading(true);
        const expiryDate = data?.expiredAt.toISOString();
        const formdata = new FormData();
        formdata.append("productName", data.productName);
        formdata.append("productDescription", data.productDescription);
        formdata.append("medicationTypeName", data.medicationTypeName)
        formdata.append("categoryName", data?.categoryName);
        formdata.append("brandName", data?.brandName);
        formdata.append("weight", data.weight);
        formdata.append("packagePerRoll", data?.packageName);
        formdata.append("presentationName", data?.presentationName);
        formdata.append("strengthValue", data.strengthValue);
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
                fetchProducts();
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

    const handleStepValidation = async (fieldsToValidate: any) => {
        const isValid = await trigger(fieldsToValidate);
        return isValid;
    };  
    
    return (
    <div className="p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
            {(() => {
                    switch (steps) {
                        case 'details':
                            return <DetailForm 
                                    title="Add Product"
                                    handleStepValidation={
                                        async () => {
                                        const isValid = await handleStepValidation([
                                            "productName", "productDescription", "categoryName", "brandName", "thumbnailFile"
                                        ]);
                                        if (isValid) setSteps("essentials");
                                    }}
                                    setSteps={setSteps}
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
                                    handleStepValidation={
                                        async () => {
                                        const isValid = await handleStepValidation([
                                            "medicationTypeName", "measurementName", "presentationName", "strengthValue", "packageName", "weight", "actualPrice", "discountPrice"
                                        ]);
                                        if (isValid) setSteps("inventory");
                                    }}
                                    setSteps={setSteps}
                                    register={register}
                                    setValue={setValue}
                                    medications={medicationData?.data}
                                    control={control}
                                    errors={errors}
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

export default AddProducts