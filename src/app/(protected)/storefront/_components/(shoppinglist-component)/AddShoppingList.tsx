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
} from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form';
import { FiUploadCloud } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';
import requestClient from '@/lib/requestClient';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import { useShoppingList } from '../../storeFrontState/useShoppingList';

interface IShoppingListInput {
  productName: string;
  purchaseDate: string;
  brandName: string;
  description: string;
}

export default function AddShoppingList() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { addShoppingList, shoppingList } = useShoppingList();
  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const [products, setProducts] = useState<any>([]);
  const [loading, setIsLoading] = useState<any>(false);
  const [nameValue, setNameValue] = useState<any>();
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
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

  useEffect(() => {
    const fetchStoreFront = async () => {
      setIsLoading(true);
      try {
        const response = await requestClient({ token: userData?.user?.token }).get("/storefront");
        const allProducts = response?.data?.data?.data?.flatMap((item) => item.products) || [];
        const filteredProducts = allProducts.filter(
          (product) => !shoppingList?.some((item) => item?.productId === product?.id)
        );
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

  const handleOptionSelect = (selectedOption) => {
    if (selectedOption) {
      setNameValue(selectedOption);
      setValue('brandName', selectedOption.productBrand?.name);
      setValue('productName', selectedOption?.label);
    }
  };

  const handleCreate = (inputValue) => {
    setNameValue({ label: inputValue, value: inputValue });
    setValue('productName', inputValue);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log('Selected file:', file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      console.log('Dropped file:', file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
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
    toast.success("Item added to shopping list successfully");
    reset();
    setSelectedFile(null);
    onClose();
    // window.location.reload();
  };

  const handleModalClose = () => {
    reset();
    setNameValue(null);
    setSelectedFile(null);
    onClose();
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <>
      <Button onClick={onOpen}>Add Item</Button>

      <Modal isOpen={isOpen} onClose={handleModalClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Item to Shopping List</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form className="space-y-3 mt-2" onSubmit={handleSubmit(onSubmit)}>
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

              <FormControl isInvalid={!!errors.purchaseDate?.message}>
                <FormLabel>Expected Purchase Date</FormLabel>
                <Input
                  // min={new Date().toISOString().split("T")[0]}
                  min={minDate}
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
                  placeholder="Additional Information"
                  isInvalid={!!errors.description}
                  _focus={{
                    border: !!errors.description ? "red.300" : "border-gray-300",
                  }}
                  {...register("description", {
                    required: true,
                  })}
                />
              </FormControl>

              <div>
                <FormLabel>Images (Optional)</FormLabel>
                <div
                  className='flex flex-col gap-2 cursor-pointer border border-dashed border-slate-300 rounded-md p-4'
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="bg-gray-50 p-2 rounded-full mx-auto max-w-max mb-4">
                      <FiUploadCloud className="w-6 h-6 text-gray-700" />
                    </div>
                  </label>
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
                  <label className="cursor-text text-center text-green-600">
                    {selectedFile && selectedFile.name}
                  </label>
                </div>
              </div>

              <div className='w-full flex items-center gap-4'>
                <Button colorScheme='blue' size={'sm'} className='mx-auto w-fit my-2' type="submit">
                  Save Item
                </Button>
              </div>
            </form>
          </ModalBody>

          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  )
}