"use client";

import { IFormInput } from "@/app/(protected)/admin/products/new/page";
import { FormControl, FormLabel, HStack, Input, Stack, Text } from "@chakra-ui/react"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/navigation"
import React, { Dispatch, SetStateAction } from "react";
import Select, { Options } from 'react-select';
import { Control, Controller, FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface SelectProps {
    label: string;
    value: string;
}
interface IChildComponentProps {
    register: UseFormRegister<IFormInput>;
    control: Control<IFormInput>;
    errors: FieldErrors<FieldValues>;
    setSteps: Dispatch<SetStateAction<'details' | 'essentials' | 'inventory'>>;
}

const variants = [
    {label: "Syrup", value: "Syrup"},
    {label: "Tablet", value: "Tablet"},
]
const strength = [
    {label: "ml", value: "ml"},
    {label: "mg", value: "mg"},
]
const presentation = [
    {label: "Bottle", value: "Bottle"},
    {label: "Sachet", value: "Sachet"},
]
const packaging = [
    {label: "200ML per bottle", value: "200ML per bottle"},
    {label: "1x10 tablets", value: "1x10 tablets"},
]
const weight = [
    {label: "10", value: "10"},
    {label: "20", value: "20"},
]

const EssentialForm: React.FC<IChildComponentProps> = ({setSteps, register, control, errors}) => {

    const router = useRouter();

    return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-md my-16">
        <div className="flex items-center justify-between">
            <HStack onClick={() => router.back()} cursor={"pointer"}>
                <ArrowLeftIcon className='w-5- h-5'/>
                <Text>Back</Text>
            </HStack>
            <div className="">
                <p className="font-semibold">Steps 2/3</p>
            </div>
        </div>
        <h3 className="font-semibold text-xl text-gray-700 my-5">Product Essentials</h3>
        <form className="space-y-5">
            <Stack>
                <Text color={"gray.700"} fontWeight={"semibold"}>Variation</Text>
                <HStack>
                    <FormControl isInvalid={!!errors.measurementName}>
                        <FormLabel color={"gray.500"}>Value</FormLabel>
                        <Controller
                            name="measurementName"
                            control={control}
                            render={({ field }) => {
                            return(
                                <Select 
                                classNamePrefix="select"
                                isClearable={true}
                                isSearchable={true}
                                {...field}
                                name="measurementName"
                                //@ts-ignore
                                options={variants} 
                            />
                            )}}
                        />
                    </FormControl>
                    <FormControl isInvalid={!!errors.strengthValue}>
                        <FormLabel color={"gray.500"}>Strength</FormLabel>
                        <Controller
                            name="strengthValue"
                            control={control}
                            render={({ field }) => {
                            return(
                                <Select 
                                classNamePrefix="select"
                                isClearable={true}
                                isSearchable={true}
                                {...field}
                                name="strengthValue"
                                //@ts-ignore
                                options={strength} 
                            />
                            )}}
                        />
                    </FormControl>
                    <FormControl isInvalid={!!errors.presentationName}>
                        <FormLabel color={"gray.500"}>Presentation</FormLabel>
                        <Controller
                            name="presentationName"
                            control={control}
                            render={({ field }) => {
                            return(
                                <Select 
                                classNamePrefix="select"
                                isClearable={true}
                                isSearchable={true}
                                {...field}
                                name="presentationName"
                                //@ts-ignore
                                options={presentation} 
                            />
                            )}}
                        />
                    </FormControl>
                </HStack>
            </Stack>
            <Stack>
                <Text color={"gray.700"} fontWeight={"semibold"}>Packaging</Text>
                <HStack>
                    <FormControl isInvalid={!!errors.packageName}>
                        <FormLabel color={"gray.500"}>Package Per Roll</FormLabel>
                        <Controller
                            name="packageName"
                            control={control}
                            render={({ field }) => {
                            return(
                                <Select 
                                classNamePrefix="select"
                                isClearable={true}
                                isSearchable={true}
                                {...field}
                                name="packageName"
                                //@ts-ignore
                                options={packaging} 
                            />
                            )}}
                        />
                    </FormControl>
                    <FormControl isInvalid={!!errors.weight}>
                        <FormLabel color={"gray.500"}>Weight (Kg)</FormLabel>
                        <Controller
                            name="weight"
                            control={control}
                            render={({ field }) => {
                            return(
                                <Select 
                                classNamePrefix="select"
                                isClearable={true}
                                isSearchable={true}
                                {...field}
                                name="weight"
                                //@ts-ignore
                                options={weight} 
                            />
                            )}}
                        />
                    </FormControl>
                </HStack>
            </Stack>
            <Stack>
                <Text color={"gray.700"} fontWeight={"semibold"}>Pricing</Text>
                <HStack>
                    <FormControl isInvalid={!!errors.actualPrice}>
                        <FormLabel color={"gray.500"}>Price</FormLabel>
                        <Input 
                        id="actualPrice"
                        placeholder="" 
                        type="text"
                        isInvalid={!!errors.actualPrice}
                        _focus={{
                            border: !!errors.actualPrice ? "red.300" : "border-gray-300",
                        }}
                        {...register("actualPrice", {
                            required: true,
                        })}
                        />
                    </FormControl>
                    <FormControl isInvalid={!!errors.discountPrice}>
                        <FormLabel color={"gray.500"}>Discount Price</FormLabel>
                        <Input 
                        id="discountPrice"
                        placeholder="" 
                        type="text"
                        isInvalid={!!errors.actualPrice}
                        _focus={{
                            border: !!errors.actualPrice ? "red.300" : "border-gray-300",
                        }}
                        {...register("discountPrice", {
                            required: true,
                        })}
                        />
                    </FormControl>
                </HStack>
            </Stack>
        </form>
        <div className="flex gap-4 justify-end mt-10 mb-6">
            <button 
            className="p-3 w-32 rounded-md border text-gray-600"  
            onClick={() => setSteps("details")}>
                Previous
            </button>
            <button 
            className="w-[280px] p-3 rounded-md bg-primary-500 text-white" 
            onClick={() => setSteps("inventory")}>
                Next: Inventory
            </button>
        </div>
    </div>
  )
}

export default EssentialForm