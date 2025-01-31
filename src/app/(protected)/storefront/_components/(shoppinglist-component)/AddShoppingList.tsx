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
import { toast } from 'react-toastify';
import { useShoppingList } from '../../storeFrontState/useShoppingList';
import { MdLabel } from 'react-icons/md';


interface IShoppingListInput {
  productName: string;
  purchaseDate: string;
  brandName: string;
  description: string;
}

export default function AddShoppingList() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { addShoppingList, loading: shoppingListLoading, shoppingList } = useShoppingList();
  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const [products, setProducts] = useState<any>([]);
  const [loading, setIsLoading] = useState<any>(false);

  // fetch products here
  useEffect(() => {
    const fetchStoreFront = async () => {
      setIsLoading(true);
      try {
        const response = await requestClient({ token: userData?.user?.token }).get("/storefront");
        const allProducts = response?.data?.data?.data?.flatMap((item) => item.products) || [];

        // Filter out products that exist in the shopping list
        const filteredProducts = allProducts.filter(
          (product) => !shoppingList?.some((item) => item?.productId === product?.id)
        );

        // Map the remaining products to concise format
        const conciseProducts = filteredProducts.map((product) => ({
          label: `${product.name} ${product.variation?.strengthValue || ""} ${product.measurement?.name || ""}`,
          value: product.id,
          productBrand: product.brand || "Unknown Brand",
        }));

        setProducts(conciseProducts);
      } catch (error) {
        console.error("Could not fetch store:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreFront();
  }, [userData?.user?.token, shoppingList]);



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
      purchaseDate: "",
      brandName: "",
      description: "",
    },
  });

  // handling product selection / creation
  const [nameValue, setNameValue] = useState<any>();



  const handleOptionSelect = (selectedOption) => {
    if (selectedOption) {
      console.log("Selected product:", selectedOption);
      setNameValue(selectedOption);
      setValue('brandName', selectedOption.productBrand?.name);
      setValue('productName', selectedOption?.label);
    }
  };

  const handleCreate = (inputValue) => {
    // console.log("Creating product:", inputValue);
    // Trigger your custom logic here
    setNameValue({ label: inputValue, value: inputValue });
    setValue('productName', inputValue);
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

  // const [loadingShoppingList, setIsLoadingShoppingList] = useState<boolean>(false);



  const onSubmit = async (data) => {
    console.log('submitted', data)

    const formData = new FormData();

    formData.append('productName', data.productName);
    formData.append('brandName', data.brandName);
    formData.append('purchaseDate', data.purchaseDate);
    formData.append('description', data.description);
    formData.append('file', selectedFile);

    if (nameValue?.value === nameValue?.label) {
      formData.append('existIn10mgStore', 'NON-EXIST');
    } else {
      formData.append('productId', nameValue?.value);

    }

    const res = await addShoppingList(formData, userData?.user?.token);

    // if (res === "200") {
    toast.success("Item added to shopping list successfully");
    setValue('productName', '');
    setValue('brandName', '');
    setValue('purchaseDate', '');
    setValue('description', '');
    setSelectedFile(null);
    onClose();
    window.location.reload();
    // }
  }



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
              onSubmit={handleSubmit(onSubmit)}
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
                  placeholder={"Brand Name of the Product"}
                  {...register("brandName", {
                    required: "Product Brand is required",
                  })}
                />
              </FormControl>
              {/* </HStack> */}

              {/* <HStack gap={5}> */}
              <FormControl isInvalid={!!errors.purchaseDate?.message}>
                <FormLabel>Expected Purchase Date</FormLabel>
                <Input
                  type="date"
                  placeholder={""}
                  {...register("purchaseDate", {
                    required: "Select Purchase Date",
                  })}
                />
              </FormControl>
              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Note</FormLabel>
                <Textarea
                  id="description"
                  // defaultValue={data?.description}
                  placeholder="Enter a description"
                  isInvalid={!!errors.description}
                  _focus={{
                    border: !!errors.description ? "red.300" : "border-gray-300",
                  }}
                  {...register("description", {
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
                    <label htmlFor="file-upload" className="cursor-pointer font-semibold text-primary-500">Select a PNG or JPEG to upload</label>
                    <br /> or drag and drop
                  </p>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label className="cursor-text text-center">
                    {selectedFile && selectedFile.name}
                  </label>
                </div>
              </div>
              <div className='w-full flex items-center gap-4'>
                <Button colorScheme='blue' size={'sm'}
                  className='mx-auto w-fit my-2' type="submit">
                  Save Item
                </Button>
              </div>
            </form>
          </ModalBody>

          <ModalFooter />



        </ModalContent>
      </Modal >
    </>
  )
}

//  onClick={onClose}