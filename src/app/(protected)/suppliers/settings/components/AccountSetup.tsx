"use client";

import { useState } from "react";
import { IoCloudDoneOutline } from "react-icons/io5"
import { Center, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react"

const AccountSetup = () => {

    const toast = useToast();
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
        if (event?.target?.files?.length > 0) {
            setIconFile(URL.createObjectURL(inputFile));
        }
    };

  return (
    <div className="max-w-2xl bg-white p-5 rounded-md">
        <form className="space-y-5 mb-6">
            <FormControl>
                <FormLabel>License Number</FormLabel>
                <Input type='text' placeholder='Enter licence number'/>
            </FormControl>
            <FormControl>
                <FormLabel>Expiry Date</FormLabel>
                <Input type='date' placeholder='Enter date'/>
            </FormControl>
            <div className="mb-8">
                <p className="font-medium text-gray-800 mb-3">CAC Document</p>
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
                    accept=".pdf, .png, .jpg"
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
                        <p className="text-gray-500 text-center">PDF, PNG or JPG 
                        <span className="text-sm ml-1">(Max size 5MB, 800x400px)</span>
                        </p>
                    </div>
                </Center>
            </div>
            <button className="p-3 rounded-md bg-primary-600 text-white w-full">Submit</button>
        </form>
    </div>
  )
}

export default AccountSetup