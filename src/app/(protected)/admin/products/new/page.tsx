"use client";

import { useCallback, useEffect, useState } from "react";
import DetailForm from "@/app/(protected)/suppliers/products/_components/DetailForm";
import EssentialForm from "@/app/(protected)/suppliers/products/_components/EssentialForm";
import InventoryForm from "@/app/(protected)/suppliers/products/_components/InventoryForm";
import { useSession } from "next-auth/react";
import { MedicationResponseData, NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import { SubmitHandler, useForm } from "react-hook-form";


export interface IFormInput {
    name: string;
    categoryName: string;
    brandName: string;
    description: string;
    medicationTypeName: string;
    actualPrice: string;
    discountPrice: string;
    minDeliveryDuration: string;
    maxDeliveryDuration: string;
    quantity: string;
    expiredAt: string;
    thumbnailFile: string;
}

const AddProducts = () => {

    const [steps, setSteps] = useState<'details' | 'essentials' | 'inventory'>('details');

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

    useEffect(() => {
        fetchingBrandTypes();
        fetchingCategoriesTypes();
        fetchingMedicationTypes();
    }, [fetchingBrandTypes, fetchingCategoriesTypes, fetchingMedicationTypes, token]);

    const {
        control,
        register,
        formState: { errors, isValid },
        handleSubmit,
        getValues,
        setValue,
    } = useForm<IFormInput>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IFormInput> = async (record) => {}

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
            return <EssentialForm setSteps={setSteps}/>
        case 'inventory':
            return <InventoryForm setSteps={setSteps}/>
        default:
            break;
    }
  return (
    <div className="p-8"></div>
  )
}

export default AddProducts