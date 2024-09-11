"use client";

import { 
    FormControl, 
    FormLabel, 
    HStack, 
    Icon, 
    Input, 
    Select, 
    Text, 
    Textarea 
} from "@chakra-ui/react"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react";
import { IoCloudDoneOutline } from "react-icons/io5";

const DetailForm = ({setSteps}: {setSteps: Dispatch<SetStateAction<'details' | 'essentials' | 'inventory'>>}) => {

    const router = useRouter();
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
        <h3 className="font-semibold text-xl text-gray-700 my-5">Add Product</h3>
        <form className="space-y-5">
            <FormControl>
                <FormLabel>Select Medication</FormLabel>
                <Select>
                    <option value=""></option>
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>Product Name</FormLabel>
                <Input placeholder=""/>
            </FormControl>
            <FormControl>
                <FormLabel>Product Description</FormLabel>
                <Textarea placeholder="Enter a description"/>
            </FormControl>
            <HStack>
                <FormControl>
                    <FormLabel>Brand</FormLabel>
                    <Select>
                        <option value=""></option>
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Select>
                        <option value=""></option>
                    </Select>
                </FormControl>
            </HStack>
            <div className="mb-8">
                <p className="font-medium text-gray-800 mb-3">Upload Product Image</p>
                <div className='border relative p-4 rounded-md'>    
                    <input
                    type="file"
                    id="image_uploads"
                    name="image"
                    multiple
                    onChange={() => {}}
                    accept=".jpg, .jpeg, .png, .webp, .avif, .mp4, .mov"
                    style={{
                        opacity: "0",
                        position: "absolute",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "36px",
                        cursor: "pointer",
                        background: "black",
                    }}
                    />
                    <div className='flex flex-col gap-2 cursor-pointer'
                    >
                        <div className="bg-gray-50 p-2 rounded-full mx-auto max-w-max mb-4">
                            <Icon as={IoCloudDoneOutline} w={6} h={6} mx={"auto"} color={"black"} />
                        </div>
                        <p className='text-sm font-normal text-center'>
                            <span className="font-semibold text-primary-500">Click to upload</span> 
                            {" "} or drag and drop
                        </p>
                        <p className="text-gray-500 text-center">PDF, PNG or JPG (max. 800x400px)</p>
                    </div>
                </div>
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