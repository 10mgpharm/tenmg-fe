"use client";

import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import { IoCloudDoneOutline } from "react-icons/io5"

const AccountSetup = () => {

    const handleChange = () => {}

  return (
    <div className="max-w-2xl bg-white p-5 rounded-md">
        <form className="space-y-5 mb-6">
            <FormControl>
                <FormLabel>License Number</FormLabel>
                <Input type='text' placeholder='Enter contact name'/>
            </FormControl>
            <FormControl>
                <FormLabel>Expiry Date</FormLabel>
                <Input type='date' placeholder='Enter contact name'/>
            </FormControl>
            <div className="mb-8">
                <p className="font-medium text-gray-800 mb-3">CAC Document</p>
                <div className='border relative p-4 rounded-md'>    
                    <input
                    type="file"
                    id="image_uploads"
                    name="image"
                    onChange={() => handleChange()}
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
                            <IoCloudDoneOutline className="w-6 h-6 text-gray-700"/>
                        </div>
                        <p className='text-sm font-normal text-center'>
                            <span className="font-semibold text-primary-500">Click to upload</span> 
                            {" "} or drag and drop
                        </p>
                        <p className="text-gray-500 text-center">PDF, PNG or JPG (max. 800x400px)</p>
                    </div>
                </div>
            </div>
            <button className="p-3 rounded-md bg-primary-600 text-white w-full">Submit</button>
        </form>
    </div>
  )
}

export default AccountSetup