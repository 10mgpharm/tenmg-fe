"use client";

import { 
    Button,
    FormControl, 
    FormLabel, 
    HStack, 
    Input, 
    Stack, 
    Switch, 
    Text, 
    useDisclosure
} from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import React, { Dispatch, SetStateAction, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import SuccessModal from "./SuccessModal";
import "react-datepicker/dist/react-datepicker.css";
import DateComponent from "./DateComponent";
import { 
    Control, 
    Controller, 
    FieldErrors, 
    FieldValues, 
    UseFormRegister, 
    UseFormSetValue 
} from "react-hook-form";
import { IFormInput } from "@/app/(protected)/admin/products/new/page";

interface IChildComponentProps {
    register: UseFormRegister<IFormInput>;
    control: Control<IFormInput>;
    errors: FieldErrors<FieldValues>;
    setSteps: Dispatch<SetStateAction<'details' | 'essentials' | 'inventory'>>;
    setValue: UseFormSetValue<IFormInput>; 
    isLoading: boolean;
}

const InventoryForm: React.FC<IChildComponentProps> = ({setSteps, register, errors, setValue, control, isLoading }) => {

    const router = useRouter();

    const [startDate, setStartDate] = useState<Date | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-md my-16">
        <div className="flex items-center justify-between">
            <HStack onClick={() => router.back()} cursor={"pointer"}>
                <ArrowLeftIcon className='w-5- h-5'/>
                <Text>Back</Text>
            </HStack>
            <div className="">
                <p className="font-semibold">Steps 3/3</p>
            </div>
        </div>
        <h3 className="font-semibold text-xl text-gray-700 my-5">Product Inventory</h3>
        <div className="space-y-5">
            <Stack gap={5}>
                <FormControl isInvalid={!!errors.quantity}>
                    <FormLabel color={"gray.600"}>Quantity</FormLabel>
                    <Input 
                        type="text" 
                        isInvalid={!!errors.quantity}
                        _focus={{
                            border: !!errors.quantity ? "red.300" : "border-gray-300",
                        }}
                        {...register("quantity", {
                            required: true,
                        })}
                    />
                </FormControl>
                <FormControl isInvalid={!!errors.lowStockLevel}>
                    <FormLabel color={"gray.600"}>Low Stock Level</FormLabel>
                    <Input  
                    id="lowStockLevel"
                    placeholder="" 
                    type="text"
                    isInvalid={!!errors.lowStockLevel}
                    _focus={{
                        border: !!errors.lowStockLevel ? "red.300" : "border-gray-300",
                    }}
                    {...register("lowStockLevel", {
                        required: true,
                    })}
                    />
                </FormControl>
                <FormControl  isInvalid={!!errors.outStockLevel}>
                    <FormLabel color={"gray.600"}>Out of Stock Level</FormLabel>
                    <Input 
                    id="outStockLevel"
                    placeholder="" 
                    type="text"
                    isInvalid={!!errors.outStockLevel}
                    _focus={{
                        border: !!errors.outStockLevel ? "red.300" : "border-gray-300",
                    }}
                    {...register("outStockLevel", {
                        required: true,
                    })}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel color={"gray.600"}>Expiration Date Proximity</FormLabel>
                    {/* <DateComponent startDate={startDate} setStartDate={setStartDate} /> */}
                    <Controller
                        name="expiredAt"
                        control={control}
                        rules={{ required: "Expiry date is required" }}
                        render={({ field }) => (
                        <DateComponent
                            startDate={field.value}
                            setStartDate={field.onChange}
                            // isMinDate
                            // minDate={getValues("startDate")}
                        />
                        )}
                    />
                </FormControl>
                <FormControl display='flex' alignItems='center'>
                    <Switch id='email-alerts' mr={3}/>
                    <FormLabel htmlFor='email-alerts' color={"gray.600"} mb='0'>
                        Save Inventory Settings
                    </FormLabel>
                </FormControl>
            </Stack>
        </div>
        <div className="flex gap-4 justify-end mt-10 mb-6">
            <button 
            className="p-3 w-32 rounded-md border text-gray-600"  
            onClick={() => setSteps("essentials")}>
                Previous
            </button>
            <Button 
            type="submit"
            isLoading={isLoading}
            loadingText={"Submitting..."}
            disabled={isLoading}
            className="w-[280px] p-3 rounded-md bg-primary-500 text-white" 
            >
                Add Product
            </Button>
        </div>
        <SuccessModal isOpen={isOpen} onClose={onClose}/>
    </div>
  )
}

export default InventoryForm;