"use client";

import { FormControl, FormLabel, HStack, Select, Stack, Text } from "@chakra-ui/react"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react";

const EssentialForm = ({setSteps}: {setSteps: Dispatch<SetStateAction<'details' | 'essentials' | 'inventory'>>}) => {

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
                    <FormControl>
                        <FormLabel color={"gray.500"}>Value</FormLabel>
                        <Select>
                            <option value=""></option>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel color={"gray.500"}>Strength</FormLabel>
                        <Select>
                            <option value=""></option>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel color={"gray.500"}>Presentation</FormLabel>
                        <Select>
                            <option value=""></option>
                        </Select>
                    </FormControl>
                </HStack>
            </Stack>
            <Stack>
                <Text color={"gray.700"} fontWeight={"semibold"}>Packaging</Text>
                <HStack>
                    <FormControl>
                        <FormLabel color={"gray.500"}>Package Per Roll</FormLabel>
                        <Select>
                            <option value=""></option>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel color={"gray.500"}>Weight (Kg)</FormLabel>
                        <Select>
                            <option value=""></option>
                        </Select>
                    </FormControl>
                </HStack>
            </Stack>
        </form>
        <div className="flex gap-4 justify-end mt-10 mb-6">
            <button className="p-3 w-32 rounded-md border text-gray-600"  onClick={() => setSteps("details")}>Previous</button>
            <button className="w-[280px] p-3 rounded-md bg-primary-500 text-white" onClick={() => setSteps("inventory")}>
                Next: Inventory
            </button>
        </div>
    </div>
  )
}

export default EssentialForm