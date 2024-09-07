"use client";

import { 
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
import { Dispatch, SetStateAction } from "react";
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import SuccessModal from "./SuccessModal";

const InventoryForm = ({setSteps}: {setSteps: Dispatch<SetStateAction<'details' | 'essentials' | 'inventory'>>}) => {

    const router = useRouter();
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
        <form className="space-y-5">
            <Stack gap={5}>
                <FormControl>
                    <FormLabel color={"gray.600"}>Quantity</FormLabel>
                    <Input type="text" />
                </FormControl>
                <FormControl>
                    <FormLabel color={"gray.600"}>Low Stock Level</FormLabel>
                    <Input type="text" />
                </FormControl>
                <FormControl>
                    <FormLabel color={"gray.600"}>Out of Stock Level</FormLabel>
                    <Input type="text" />
                </FormControl>
                <FormControl>
                    <FormLabel color={"gray.600"}>Expiration Date Proximity</FormLabel>
                    <Input type="date" />
                </FormControl>
                <FormControl display='flex' alignItems='center'>
                    <Switch id='email-alerts' mr={3}/>
                    <FormLabel htmlFor='email-alerts' color={"gray.600"} mb='0'>
                        Save Inventory Settings
                    </FormLabel>
                </FormControl>
            </Stack>
        </form>
        <div className="flex gap-4 justify-end mt-10 mb-6">
            <button className="p-3 w-32 rounded-md border text-gray-600"  onClick={() => setSteps("essentials")}>Previous</button>
            <button className="w-[280px] p-3 rounded-md bg-primary-500 text-white" onClick={() => onOpen()}>
                Add Product
            </button>
        </div>
        <SuccessModal isOpen={isOpen} onClose={onClose}/>
    </div>
  )
}

export default InventoryForm;