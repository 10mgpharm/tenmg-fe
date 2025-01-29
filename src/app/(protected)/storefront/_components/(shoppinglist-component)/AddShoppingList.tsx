'use client'

import React, { useEffect, useState } from 'react'
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
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { IoCloudDoneOutline } from 'react-icons/io5';
import { FiUploadCloud } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';
import requestClient from '@/lib/requestClient';
import Select from 'react-select/dist/declarations/src/Select';
import CreatableSelect from 'react-select/creatable';
import { Braah_One } from 'next/font/google';


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
  // const { formState: { errors: formContextErrors } } = useFormContext();


  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const [products, setProducts] = useState<any>([]);
  const [loading, setIsLoading] = useState<any>(false);

  // fetch products here
  useEffect(() => {
    const fetchStoreFront = async () => {
      setIsLoading(true);
      try {
        const data = await requestClient({ token: userData?.user?.token }).get(
          "/storefront"
        );


        const allProduct = data?.data?.data?.data?.flatMap(
          (item) => item.products
        );

        const conciseProducts = allProduct.map((product) => {
          return {
            label: product?.name + " " + product?.variation?.strengthValue + "" + product?.measurement?.name,
            value: product?.id,
            // value: product?.name + " " + product?.variation?.strengthValue + "" + product?.measurement?.name,
            productBrand: product?.brand,
          }


        })


        setProducts(conciseProducts);
      } catch (e) {
        // !Todo: handle error
        // toast.error("Could not fetch store, please try again")
      } finally {
        setIsLoading(false);
      }
    };
    fetchStoreFront();
  }, [userData?.user?.token]);

  console.log("products", products);



  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    control
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

  // handling product selection / creation
  const [nameValue, setNameValue] = useState<any>();

  const handleOptionSelect = (selectedOption) => {
    if (selectedOption) {
      console.log("Selected product:", selectedOption);
      setNameValue(selectedOption);
      setValue('brandName', selectedOption.productBrand?.name);
    }
  };

  const handleCreate = (inputValue) => {
    console.log("Creating product:", inputValue);
    // Trigger your custom logic here
    setNameValue({ label: inputValue, value: inputValue });
  };

  // handling file upload
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // You can also handle the file upload logic here, e.g., sending it to a server
      console.log('Selected file:', file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      // You can also handle the file upload logic here, e.g., sending it to a server
      console.log('Dropped file:', file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

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
                <Controller
                  name="productName"
                  control={control}
                  rules={{ required: "Product Name is required" }}
                  render={({ field }) => (
                    <CreatableSelect
                      {...field}
                      options={products}
                      isClearable
                      isSearchable
                      placeholder="Select or type a product name"
                      onChange={(newValue) => { handleOptionSelect(newValue) }}
                      onCreateOption={handleCreate}
                      value={nameValue}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: errors.productName ? "red" : base.borderColor,
                        }),
                      }}
                    />
                  )}
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
                <FormLabel>Images (Optional)</FormLabel>
                <div
                  className='flex flex-col gap-2 cursor-pointer border border-dashed border-slate-300 rounded-md p-4'
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="bg-gray-50 p-2 rounded-full mx-auto max-w-max mb-4">
                    <FiUploadCloud className="w-6 h-6 text-gray-700" />
                  </div>
                  <p className='text-sm font-normal text-center'>
                    <span className="font-semibold text-primary-500">Select a PNG or JPEG to upload</span>
                    <br /> or drag and drop
                  </p>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {selectedFile ? selectedFile.name : 'Choose a file'}
                  </label>
                </div>
              </div>
              <Button colorScheme='blue' size={'sm'} onClick={onClose} className='mr-0 ml-auto'>
                Save Item
              </Button>
            </form>
          </ModalBody>

          <ModalFooter />



        </ModalContent>
      </Modal >
    </>
  )
}
