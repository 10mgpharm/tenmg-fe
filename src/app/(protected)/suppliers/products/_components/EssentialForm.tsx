"use client";

import Select from 'react-select';
import { useSession } from "next-auth/react";
import requestClient from "@/lib/requestClient";
import { IFormInput } from "@/app/(protected)/admin/products/add-product/page";
import { Box, FormControl, FormLabel, HStack, Input, Stack, Text } from "@chakra-ui/react"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { convertCreateOptionArray, convertVariationArray } from "@/utils/convertSelectArray";
import { MedicationData, NextAuthUserSession, PresentationProps } from "@/types";
import CustomCreatableSelectComponent, { CreatableSelectOption } from "@/app/(protected)/_components/CustomCreatableSelect";

interface IChildComponentProps {
    register: UseFormRegister<IFormInput>;
    control: Control<IFormInput>;
    errors: FieldErrors<IFormInput>;
    handleStepValidation: () => void;
    setSteps: Dispatch<SetStateAction<'details' | 'essentials' | 'inventory'>>;
    medications: MedicationData[]; 
    setValue: UseFormSetValue<IFormInput>;
    isEditing: boolean;
    type: string;
}

const EssentialForm: React.FC<IChildComponentProps> = ({
    setSteps, 
    register, 
    control, 
    errors,
    medications,
    setValue,
    handleStepValidation,
    isEditing,
    type
}) => {

    const session = useSession();
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;

    const [showVariation, setShowVariation] = useState<boolean>(false);
    const [newVariation, setNewVariation] = useState<boolean>(false);
    const [selectedVariation, setSelectedVariation] = useState<any>();
    const [presentationData, setPresentationData] = useState<PresentationProps[]>([]);
    const [measurementData, setMeasurementData] = useState<PresentationProps[]>([]);
    const [varationTypes, setVariationTypes] = useState<PresentationProps[]>([]);

    const fetchingPresentationTypes = useCallback(async() => {
        try {
            if(type === "admin"){
                const response = await requestClient({ token: token }).get(
                    `/admin/settings/presentations`
                );
                if(response.status === 200){
                    setPresentationData(response.data.data.data);
                }
            } else {
                const response = await requestClient({ token: token }).get(
                    `/supplier/presentations`
                );
                if(response.status === 200){
                    setPresentationData(response.data.data.data);
                }
            }
        } catch (error) {
            console.error(error)
        }
    },[token]);

    const fetchingMeasurementTypes = useCallback(async() => {
        try {
            if(type === "admin"){
                const response = await requestClient({ token: token }).get(
                    `/admin/settings/measurements`
                );
                if(response.status === 200){
                    setMeasurementData(response.data.data);
                }
            } else {
                const response = await requestClient({ token: token }).get(
                    `/supplier/measurements`
                );
                if(response.status === 200){
                    setMeasurementData(response.data.data.data);
                }
            }
        } catch (error) {
            console.error(error)
        }
    },[token]);

    const fetchingVarationByTypeId = useCallback(async(id: number) => {
        try {
            let query: string;
            if(type === "admin"){
                query = `/admin/settings/medication-types/${id}/medication-variations`
            }else{
                query = `/supplier/settings/medication-types/${id}/medication-variations`
            }
            const response = await requestClient({ token: token }).get(query);
        if(response.status === 200){
            setVariationTypes([...response.data.data, {label: "Create New", value: "Create New"}]);
        }
        } catch (error) {
            console.error(error)
        }
    },[token]);

    useEffect(() => {
        if(!token) return;
        fetchingPresentationTypes();
        fetchingMeasurementTypes();
    }, [fetchingPresentationTypes, fetchingMeasurementTypes]);

    return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-md my-16">
        <div className="flex items-center justify-between">
            <HStack onClick={() => setSteps("details")} cursor={"pointer"}>
                <ArrowLeftIcon className='w-5- h-5'/>
                <Text>Go to Product Details</Text>
            </HStack>
            <div className="">
                <p className="font-semibold">Steps 2/3</p>
            </div>
        </div>
        <h3 className="font-semibold text-xl text-gray-700 my-5">Product Essentials</h3>
        <div className="space-y-5">
            <Stack>
                <FormControl isInvalid={!!errors.medicationTypeName}>
                    <FormLabel>Medication Type</FormLabel>
                    <Controller
                        control={control}
                        name={"medicationTypeName"}
                        rules={{ required: 'medicationType is required' }}
                        render={({ field: { onChange, value } }) =>
                            <div className="flex flex-col">
                                <CustomCreatableSelectComponent
                                    value={value}
                                    name={"medicationTypeName"}
                                    placeholder={'Select...'}
                                    options={medications && convertCreateOptionArray(medications)}
                                    onOptionSelected={(selectedOption: CreatableSelectOption) => {
                                        if(selectedOption?.value){
                                            onChange(selectedOption?.value);
                                            if(selectedOption?.newOption){
                                                setShowVariation(false);
                                            }else{
                                                fetchingVarationByTypeId(selectedOption.id);
                                                setShowVariation(true);
                                            }
                                        }
                                    }}
                                />
                                {errors.medicationTypeName?.message &&
                                    <Text as={"span"} className="text-red-500 text-sm">
                                        {errors?.medicationTypeName?.message}
                                    </Text>
                                }
                            </div>
                        }
                    />
                </FormControl>
                {
                    (showVariation) &&
                    <Stack>
                        <Text color={"gray.700"} mt={5} fontWeight={"semibold"}>Select Variation</Text>
                        <Select
                            isClearable={true}
                            isSearchable={true}
                            options={convertVariationArray(varationTypes)}
                            placeholder={"Select Variation"}
                            onChange={(selectedOption: any) => {
                                if(selectedOption?.label !== "Create New"){
                                    setSelectedVariation(selectedOption)
                                    setValue("measurementName", selectedOption?.detail?.measurement);
                                    setValue("presentationName", selectedOption?.detail?.presentation);
                                    setValue("strengthValue", selectedOption?.detail?.strength);
                                    setValue("packageName", selectedOption?.detail?.packagePerRoll);
                                    setValue("weight", selectedOption?.detail?.weight);
                                }else{
                                    setSelectedVariation([]);
                                    setNewVariation(true);
                                    setSelectedVariation(selectedOption)
                                    setValue("measurementName", "");
                                    setValue("presentationName", "");
                                    setValue("strengthValue", "");
                                    setValue("packageName", "");
                                    setValue("weight", null);
                                }
                            }}
                        />
                        {
                            selectedVariation?.detail && 
                            <Box>
                                <HStack mt={4}>
                                    <Stack flex={1}>
                                        <FormLabel color={"gray.600"}>Presentation</FormLabel>
                                        <Box className="border rounded-md p-2">
                                            <Text color={"gray.400"}>{selectedVariation?.detail?.presentation}</Text>
                                        </Box>
                                    </Stack>
                                    <Stack flex={1}>
                                        <FormLabel color={"gray.600"}>Strength Value</FormLabel>
                                        <Box className="border rounded-md p-2">
                                            <Text color={"gray.400"}>{selectedVariation?.detail?.strength}</Text>
                                        </Box>
                                    </Stack>
                                    <Stack flex={1}>
                                        <FormLabel color={"gray.600"}>Measurement</FormLabel>
                                        <Box className="border rounded-md p-2">
                                            <Text color={"gray.400"}>{selectedVariation?.detail?.measurement}</Text>
                                        </Box>
                                    </Stack>
                                </HStack>
                                <HStack mt={4}>
                                    <Stack flex={1}>
                                        <FormLabel color={"gray.600"}>Package per roll</FormLabel>
                                        <Box className="border rounded-md p-2">
                                            <Text color={"gray.400"}>{selectedVariation?.detail?.packagePerRoll || "None"}</Text>
                                        </Box>
                                    </Stack>
                                    <Stack flex={1}>
                                        <FormLabel color={"gray.600"}>Weight (kg)</FormLabel>
                                        <Box className="border rounded-md p-2">
                                            <Text color={"gray.400"}>{`${selectedVariation?.detail?.weight}`}</Text>
                                        </Box>
                                    </Stack>
                                </HStack>
                            </Box>
                        }
                    </Stack>
                }
                {
                (!showVariation || newVariation) && !selectedVariation?.detail ?
                <Stack>
                    <Text color={"gray.700"} mt={5} fontWeight={"semibold"}>Variation</Text>
                    <HStack>
                        <FormControl isInvalid={!!errors.presentationName}>
                            <FormLabel color={"gray.500"}>Presentation</FormLabel>
                            <Controller
                                control={control}
                                name={"presentationName"}
                                rules={{ required: 'Presentation name is required' }}
                                render={({ field: { onChange, value } }) =>
                                    <div className="flex flex-col">
                                        <CustomCreatableSelectComponent
                                            value={value}
                                            name={"presentationName"}
                                            placeholder={'Select...'}
                                            isDisabled={isEditing && !newVariation}
                                            options={presentationData && convertCreateOptionArray(presentationData)}
                                            onOptionSelected={(selectedOption: CreatableSelectOption) => {
                                                onChange(selectedOption?.value);
                                            }}
                                        />
                                        {errors.presentationName?.message &&
                                            <Text as={"span"} className="text-red-500 text-sm">
                                                {errors?.presentationName?.message}
                                            </Text>
                                        }
                                    </div>
                                }
                            />
                        </FormControl>
                        <FormControl isInvalid={!!errors.strengthValue}>
                            <FormLabel color={"gray.500"}>Strength Value</FormLabel>
                            <Input 
                                id="strengthValue"
                                disabled={isEditing && !newVariation}
                                placeholder="" 
                                {...register("strengthValue", {
                                    required: "Strength is required",
                                    // validate value can either be number only e.g 90 or number with sepearor between 90/80
                                    validate: (value) => {
                                        const regex = /^[0-9]+(\/[0-9]+)?$/;
                                        return regex.test(value) || "Strength is invalid";
                                    }
                                })}
                                isInvalid={!!errors.strengthValue}
                                _focus={{
                                    border: !!errors.strengthValue ? "red.300" : "border-gray-300",
                                }}
                            />
                        </FormControl>
                        <FormControl isInvalid={!!errors.measurementName}>
                            <FormLabel color={"gray.500"}>Measurement</FormLabel>
                            <Controller
                                control={control}
                                name={"measurementName"}
                                rules={{ required: 'measurementName is required' }}
                                render={({ field: { onChange, value } }) =>
                                    <div className="flex flex-col">
                                        <CustomCreatableSelectComponent
                                            value={value}
                                            name={"measurementName"}
                                            placeholder={'Select...'}
                                            isDisabled={isEditing && !newVariation}
                                            options={measurementData && convertCreateOptionArray(measurementData)}
                                            onOptionSelected={(selectedOption: CreatableSelectOption) => {
                                                onChange(selectedOption?.value);
                                            }}
                                        />
                                        {errors.measurementName?.message &&
                                            <Text as={"span"} className="text-red-500 text-sm">
                                                {errors?.measurementName?.message}
                                            </Text>
                                        }
                                    </div>
                                }
                            />
                        </FormControl>
                    </HStack>
                    <Stack mt={4}>
                        <Text color={"gray.700"} fontWeight={"semibold"}>Packaging</Text>
                        <HStack>
                            <FormControl isInvalid={!!errors.packageName}>
                                <FormLabel color={"gray.500"}>Package Per Roll</FormLabel>
                                <Input 
                                    id="packageName"
                                    placeholder="" 
                                    type="text"
                                    disabled={isEditing && !newVariation}
                                    isInvalid={!!errors.packageName}
                                    _focus={{
                                        border: !!errors.packageName ? "red.300" : "border-gray-300",
                                    }}
                                    {...register("packageName")}
                                />
                            </FormControl>
                            <FormControl isInvalid={!!errors.weight}>
                                <FormLabel color={"gray.500"}>Weight (Kg)</FormLabel>
                                <Input 
                                    id="weight"
                                    placeholder="" 
                                    type="text"
                                    disabled={isEditing && !newVariation}
                                    isInvalid={!!errors.weight}
                                    _focus={{
                                        border: !!errors.weight ? "red.300" : "border-gray-300",
                                    }}
                                    {...register("weight", {
                                        // required: true,
                                        validate: (value) => {
                                            const regex = /^\d+(\.\d+)?$/;
                                            return regex.test(value) || "Weight is invalid";
                                        }
                                    })}
                                />
                            </FormControl>
                        </HStack>
                    </Stack>
                </Stack>
                : null
                } 
                <Stack mt={4}>
                    <Text color={"gray.700"} fontWeight={"semibold"}>Pricing</Text>
                    <HStack>
                        <FormControl isInvalid={!!errors.actualPrice}>
                            <FormLabel color={"gray.500"}>Price(₦)</FormLabel>
                            <Input 
                            id="actualPrice"
                            placeholder="" 
                            type="number"
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
                            <FormLabel color={"gray.500"}>Discount Price(₦)</FormLabel>
                            <Input 
                            id="discountPrice"
                            placeholder="" 
                            type="number"
                            isInvalid={!!errors.discountPrice}
                            _focus={{
                                border: !!errors.discountPrice ? "red.300" : "border-gray-300",
                            }}
                            {...register("discountPrice")}
                            />
                        </FormControl>
                    </HStack>
                </Stack>
            </Stack>
        </div>
        <div className="flex gap-4 justify-end mt-10 mb-6">
            <button 
            type='button'
            className="p-3 w-32 rounded-md border text-gray-600"  
            onClick={() => setSteps("details")}>
                Previous
            </button>
            <button 
            type='button'
            className="w-[280px] p-3 rounded-md bg-primary-500 text-white" 
            onClick={handleStepValidation}>
                Next: Inventory
            </button>
        </div>
    </div>
  )
}

export default EssentialForm