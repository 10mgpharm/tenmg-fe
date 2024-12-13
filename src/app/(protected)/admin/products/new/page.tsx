"use client";

import { useCallback, useEffect, useState } from "react";
import DetailForm from "@/app/(protected)/suppliers/products/_components/DetailForm";
import EssentialForm from "@/app/(protected)/suppliers/products/_components/EssentialForm";
import InventoryForm from "@/app/(protected)/suppliers/products/_components/InventoryForm";
import { useSession } from "next-auth/react";
import { MedicationResponseData, NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import { SubmitHandler, useForm } from "react-hook-form";
import { SelectProps } from "@/app/(protected)/vendors/loan-applications/_components/SendApplicationLink";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

export interface IFormInput {
    productName: string;
    productDescription: string;
    medicationTypeName: SelectProps;
    categoryName: SelectProps;
    brandName: SelectProps;
    measurementName: SelectProps;
    presentationName: SelectProps;
    packageName: SelectProps;
    strengthValue: SelectProps;
    actualPrice: string;
    discountPrice: string;
    minDeliveryDuration: string;
    maxDeliveryDuration: string;
    weight: SelectProps;
    quantity: string;
    expiredAt: any;
    thumbnailFile: string;
}

const AddProducts = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [steps, setSteps] = useState<'details' | 'essentials' | 'inventory'>(null);

    useEffect(() => {
        setSteps("details");
    },[])

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
    } = useForm<IFormInput>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setIsLoading(true);
        const expiryDate = data?.expiredAt.toISOString();
        const formdata = new FormData();
        formdata.append("productName", data.productName);
        formdata.append("productDescription", data.productDescription);
        formdata.append("medicationTypeName", data.medicationTypeName?.label)
        formdata.append("categoryName", data?.categoryName?.label);
        formdata.append("brandName", data?.brandName?.label);
        formdata.append("weight", data?.weight?.label);
        formdata.append("packageName", data?.brandName?.label);
        formdata.append("presentationName", data?.presentationName?.label);
        formdata.append("strengthValue", data?.strengthValue?.label);
        formdata.append("measurementName", data?.measurementName?.label);
        formdata.append("minDeliveryDuration", data?.minDeliveryDuration);
        formdata.append("maxDeliveryDuration", data?.maxDeliveryDuration);
        formdata.append("expiredAt", expiryDate);
        formdata.append("thumbnailFile", data?.thumbnailFile);
        formdata.append("actualPrice", data?.actualPrice);
        formdata.append("discountPrice", data?.discountPrice);
        formdata.append("quantity", data?.quantity);

        try {
            const response = await requestClient({token: token}).post(
                "/admin/settings/products",
                formdata
            )
            if(response.status === 200){
                setIsLoading(false);
                fetchProducts();
            }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error(handleServerErrorMessage(error));
        }
    }
    // console.log(getValues());
    console.log(errors);

    if (steps === null) {
        // Render a loading state or placeholder until the state is initialized
        return <div>Loading...</div>;
      }

    
  return (
    <div className="p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
            {(() => {
                    switch (steps) {
                        case 'details':
                            return <DetailForm 
                                    setSteps={setSteps} 
                                    brands={brandData?.data} 
                                    categories={categoryData?.data} 
                                    medications={medicationData?.data}
                                    control={control}
                                    register={register}
                                    errors={errors}
                                    setValue={setValue}
                                />
                        case 'essentials':
                            return <EssentialForm 
                                    setSteps={setSteps}
                                    register={register}
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
                                    handleSubmit={handleSubmit}
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