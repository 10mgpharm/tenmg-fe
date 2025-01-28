'use client'

import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea
  // useDisclosure,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form';
import { IoCloudDoneOutline } from 'react-icons/io5';
import { FiUploadCloud } from 'react-icons/fi';


interface IShoppingListInput {
  productName: string;
  date: string;
  brandName: string;
  productDescription: string;
  businessAddress: string;
  contactPersonPosition: string;
}

export default function AddShoppingList() {
  const { isOpen, onOpen, onClose } = useDisclosure()


  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<IShoppingListInput>({
    mode: "onChange",
    defaultValues: {
      productName: "",
      date: "",
      brandName: "",
      productDescription: "",
      businessAddress: "",
      contactPersonPosition: "",
    },
  });


  return (
    <>
      <Button onClick={onOpen}>Add Item</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Item to Shopping List</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form className="space-y-3 mt-2"
            // onSubmit={handleSubmit(onSubmit)}
            >
              {/* <HStack gap={5}> */}
              <FormControl isInvalid={!!errors.productName?.message}>
                <FormLabel>Product Name</FormLabel>
                <Input
                  type="text"
                  placeholder={""}
                  {...register("productName", {
                    required: "Product Name is required",
                  })}
                />
              </FormControl>
              <FormControl isInvalid={!!errors.brandName?.message}>
                <FormLabel>Brand Name</FormLabel>
                <Input
                  type="text"
                  placeholder={""}
                  {...register("brandName", {
                    required: "Product Brand is required",
                  })}
                />
              </FormControl>
              {/* </HStack> */}

              {/* <HStack gap={5}> */}
              <FormControl isInvalid={!!errors.date?.message}>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  placeholder={""}
                  {...register("date", {
                    required: "Select Purchase Date",
                  })}
                />
              </FormControl>
              <FormControl isInvalid={!!errors.productDescription}>
                <FormLabel>Product Description</FormLabel>
                <Textarea
                  id="productDescription"
                  // defaultValue={data?.description}
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
              {/* </HStack> */}
              {/* <HStack gap={5}> */}
              <div>
                <FormLabel>Images(Optional)</FormLabel>
                <div className='flex flex-col gap-2 cursor-pointer border border-dashed border-slate-300 rounded-md p-4'              >
                  <div className="bg-gray-50 p-2 rounded-full mx-auto max-w-max mb-4">
                    {/* <IoCloudDoneOutline className="w-6 h-6 text-gray-700" /> */}
                    <FiUploadCloud className="w-6 h-6 text-gray-700" />
                  </div>
                  <p className='text-sm font-normal text-center'>
                    <span className="font-semibold text-primary-500">Select a PNG or JPEG to upload</span>
                    <br /> or drag and drop</p>
                  {/* <p className="text-gray-500 text-center">JPEG, PNG or JPG
                  <span className="text-sm ml-1">(Max size 5MB, 800x400px)</span>
                </p> */}
                </div>
              </div>
              {/* </HStack> */}
              {/* <div className="w-fit mx-auto mt-10">
                <Flex className="flex items-center gap-3">

                  <Button bg={"blue.700"} type="submit">
                    Save Changes
                  </Button>
                </Flex>
              </div> */}
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' size={'sm'} onClick={onClose} className='mr-0 ml-auto'>
              Save Item
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal >
    </>
  )
}
