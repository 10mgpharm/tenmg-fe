"use client";

import 
CustomCreatableSelectComponent, 
{ CreatableSelectOption } from "@/app/(protected)/_components/CustomCreatableSelect";
import { MedicationData } from "@/types";
import { convertCreateOptionArray } from "@/utils/convertSelectArray";
import { 
    Center,
    FormControl, 
    FormLabel, 
    HStack,  
    Input,  
    Text, 
    Textarea, 
    useToast
} from "@chakra-ui/react"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/navigation"
import React, { Dispatch, SetStateAction, useState } from "react";
import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { IoCloudDoneOutline } from "react-icons/io5";
import { IFormInput } from "../new/page";

interface IChildComponentProps {
    title: string;
    register: UseFormRegister<IFormInput>;
    control: Control<IFormInput>;
    errors: FieldErrors<IFormInput>;
    setSteps: Dispatch<SetStateAction<'details' | 'essentials' | 'inventory'>>; 
    brands: MedicationData[]; 
    categories: MedicationData[];
    setValue: UseFormSetValue<IFormInput>;
}
  

const DetailForm: React.FC<IChildComponentProps> = ({
    title,
    setSteps, 
    brands,  
    categories, 
    errors, 
    control, 
    register, 
    setValue
}) => {

    const toast = useToast();
    const router = useRouter();
    const [iconFile, setIconFile] = useState<string>("");

    const onLoadImage = (event: any) => {
        if (!event.target.files) return;
        if (event.target.files[0].size >= 5 * 1024 * 1024)
          return toast({
            title: "Warning",
            status: "warning",
            description: "A file selected is larger than the maximum 5MB limit, Please select a file smaller than 5MB.",
            duration: 2000,
            position: "bottom"
        })
        const inputFile = event.target.files[0];
        setValue("thumbnailFile", inputFile);
        if (event?.target?.files?.length > 0) {
            setIconFile(URL.createObjectURL(inputFile));
        }
    };

    return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-md my-16">
        <div className="flex items-center justify-between">
            <HStack onClick={() => router.back()} cursor={"pointer"}>
                <ArrowLeftIcon className='w-5- h-5'/>
                <Text>Back</Text>
            </HStack>
            <div className="">
                <p className="font-semibold">Steps 1/3</p>
            </div>
        </div>
        <h3 className="font-semibold text-xl text-gray-700 my-5">{title}</h3>
        <form className="space-y-5">
            <FormControl isInvalid={!!errors.productName}>
                <FormLabel>Product Name</FormLabel>
                <Input 
                id="productName"
                placeholder="Enter product name" 
                type="text"
                isInvalid={!!errors.productName}
                _focus={{
                    border: !!errors.productName ? "red.300" : "border-gray-300",
                }}
                {...register("productName", {
                    required: true,
                })}
                />
            </FormControl>
            <FormControl isInvalid={!!errors.productDescription}>
                <FormLabel>Product Description</FormLabel>
                <Textarea 
                id="productDescription"
                placeholder="Enter a description"
                isInvalid={!!errors.productDescription}
                _focus={{
                    border: !!errors.productDescription ? "red.300" : "border-gray-300",
                }}
                {...register("productDescription", {
                    required: true,
                })}
                />
            </FormControl>
            <HStack>
                <FormControl isInvalid={!!errors.brandName}>
                    <FormLabel>Brand</FormLabel>
                    <Controller
                        control={control}
                        name={"brandName"}
                        rules={{ required: 'Brand is required' }}
                        render={({ field: { onChange, value } }) =>
                            <div className="flex flex-col">
                                <CustomCreatableSelectComponent
                                    value={value}
                                    name={"brandName"}
                                    placeholder={'Select...'}
                                    options={convertCreateOptionArray(brands)}
                                    onOptionSelected={(selectedOption: CreatableSelectOption) => {
                                        onChange(selectedOption?.value);
                                    }}
                                />
                                {errors.brandName?.message &&
                                    <Text as={"span"} className="text-red-500 text-sm">
                                        {errors?.brandName?.message}
                                    </Text>
                                }
                            </div>
                        }
                    />
                </FormControl>
                <FormControl isInvalid={!!errors.categoryName}>
                    <FormLabel>Category</FormLabel>
                    <Controller
                        control={control}
                        name={"categoryName"}
                        rules={{ required: 'Category is required' }}
                        render={({ field: { onChange, value } }) =>
                            <div className="flex flex-col">
                                <CustomCreatableSelectComponent
                                    value={value}
                                    name={"categoryName"}
                                    placeholder={'Select...'}
                                    options={convertCreateOptionArray(categories)}
                                    onOptionSelected={(selectedOption: CreatableSelectOption) => {
                                        onChange(selectedOption?.value);
                                    }}
                                />
                                {errors.categoryName?.message &&
                                    <Text as={"span"} className="text-red-500 text-sm">
                                        {errors?.categoryName?.message}
                                    </Text>
                                }
                            </div>
                        }
                    />
                </FormControl>
            </HStack>
            <div className="mb-8">
                <p className="font-medium text-gray-800 mb-3">Upload Product Image</p>
                <Center 
                    mt={3}
                    as="button" 
                    py={4}
                    border={"1px solid rgb(238, 238, 238)"} 
                    w={"full"} 
                    rounded={"md"} 
                    flexDir={"column"} 
                    pos={"relative"} 
                    overflow={"hidden"}
                    >
                    <input
                    type="file"
                    id="image_uploads"
                    name="image"
                    onChange={onLoadImage}
                    accept=".jpeg, .png, .jpg"
                    style={{
                        opacity: "0",
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                    }}
                    />
                    <div className='flex flex-col gap-2 cursor-pointer'
                    >
                        <div className="bg-gray-50 p-2 rounded-full mx-auto max-w-max mb-4">
                            <IoCloudDoneOutline className="w-6 h-6 text-gray-700"/>
                        </div>
                        <p className='text-sm font-normal text-center'>
                            <span className="font-semibold text-primary-500">Click to upload</span> 
                            {" "} or drag and drop
                        </p>
                        <p className="text-gray-500 text-center">JPEG, PNG or JPG 
                            <span className="text-sm ml-1">(Max size 5MB, 800x400px)</span>
                        </p>
                    </div>
                </Center>
                {
                    iconFile &&
                    <img src={iconFile} alt="" className="w-10 h-10 mt-3 rounded-sm" />
                }
            </div>
        </form>
        <div className="flex gap-4 justify-end mt-5 mb-6">
            <button className="p-3 w-32 rounded-md border text-gray-600">Back</button>
            <button className="w-[280px] p-3 rounded-md bg-primary-500 text-white" onClick={() => setSteps("essentials")}>
                Next: Product Essentials
            </button>
        </div>
    </div>
  )
}

export default DetailForm