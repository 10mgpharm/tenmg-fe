"use client";

import CustomCreatableSelectComponent, {
  CreatableSelectOption,
} from "@/app/(protected)/_components/CustomCreatableSelect";
import { MedicationResponseData, NextAuthUserSession } from "@/types";
import { convertCreateOptionArray } from "@/utils/convertSelectArray";
import {
  Center,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { IoCloudDoneOutline } from "react-icons/io5";
import { IFormInput } from "../add-product/page";
import { useSession } from "next-auth/react";
import requestClient from "@/lib/requestClient";
import { toQueryString } from "@/utils";

interface IChildComponentProps {
  title: string;
  isEditing: boolean;
  register: UseFormRegister<IFormInput>;
  control: Control<IFormInput>;
  errors: FieldErrors<IFormInput>;
  handleStepValidation: () => void;
  setValue: UseFormSetValue<IFormInput>;
  getValue: UseFormGetValues<IFormInput>;
  type: string;
}

const DetailForm: React.FC<IChildComponentProps> = ({
  title,
  isEditing,
  errors,
  control,
  register,
  setValue,
  getValue,
  handleStepValidation,
  type,
}) => {
  const toast = useToast();
  const router = useRouter();
  const [iconFile, setIconFile] = useState<string>("");
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;
  const formattedImage = getValue("thumbnailFile");

  const [brandData, setBrandData] = useState<MedicationResponseData>();
  const [categoryData, setCategoryData] = useState<MedicationResponseData>();
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  const fetchingBrandTypes = useCallback(async () => {
    const params = {
      status: ["approved", "pending"],
      active: "active",
    };
    setIsLoadingBrands(true);
    try {
      const baseUrl =
        type === "admin" ? `/admin/settings/brands` : `/supplier/brands`;

      const response = await requestClient({ token: token }).get(
        `${baseUrl}?${toQueryString(params)}`
      );
      if (response.status === 200) {
        setBrandData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoadingBrands(false);
  }, [token, type]);

  const fetchingCategoriesTypes = useCallback(async () => {
    const params = {
      status: ["approved", "pending"],
      active: "active",
    };
    setIsLoadingCategory(true);
    try {
      const baseUrl =
        type === "admin"
          ? `/admin/settings/categories`
          : `/supplier/categories`;
      const response = await requestClient({ token: token }).get(
        `${baseUrl}?${toQueryString(params)}`
      );
      if (response.status === 200) {
        setCategoryData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoadingCategory(false);
  }, [token, type]);

  useEffect(() => {
    if (!token) return;
    fetchingBrandTypes();
    fetchingCategoriesTypes();
  }, [fetchingBrandTypes, fetchingCategoriesTypes, token]);

  useEffect(() => {
    if (formattedImage && !isEditing) {
      setIconFile(URL.createObjectURL(formattedImage as unknown as Blob));
    } else {
      setIconFile(formattedImage);
    }
  }, [formattedImage, isEditing]);

  const onLoadImage = (event: any) => {
    if (!event.target.files) return;
    if (event.target.files[0].size >= 5 * 1024 * 1024)
      return toast({
        title: "Warning",
        status: "warning",
        description:
          "A file selected is larger than the maximum 5MB limit, Please select a file smaller than 5MB.",
        duration: 2000,
        position: "bottom",
      });
    const inputFile = event.target.files[0];
    setValue("thumbnailFile", inputFile);
    if (event?.target?.files?.length > 0) {
      setIconFile(URL.createObjectURL(inputFile));
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-md py-8 sm:my-16">
      <div className="flex items-center justify-between">
        <HStack onClick={() => router.back()} cursor={"pointer"}>
          <ArrowLeftIcon className="w-5- h-5" />
          <Text>Back to products</Text>
        </HStack>
        <div className="">
          <p className="font-semibold">Steps 1/3</p>
        </div>
      </div>
      <h3 className="font-semibold text-xl text-gray-700 my-5">{title}</h3>
      <div className="space-y-5">
        <FormControl isInvalid={!!errors.productName}>
          <FormLabel>Product Name</FormLabel>
          <Input
            id="productName"
            name="productName"
            placeholder="e.g Panadol"
            type="text"
            isInvalid={!!errors.productName}
            _focus={{
              border: !!errors.productName ? "red.300" : "border-gray-300",
            }}
            {...register("productName", {
              required: true,
            })}
          />
        </FormControl>
        <FormControl isInvalid={!!errors.productDescription}>
          <FormLabel>Product Description</FormLabel>
          <Textarea
            id="productDescription"
            placeholder="Enter a description"
            isInvalid={!!errors.productDescription}
            _focus={{
              border: !!errors.productDescription
                ? "red.300"
                : "border-gray-300",
            }}
            {...register("productDescription", {
              required: true,
            })}
          />
        </FormControl>
        <HStack flexDir={["column", "row"]} gap={4}>
          <FormControl isInvalid={!!errors.brandName}>
            <FormLabel>Brand</FormLabel>
            <Controller
              control={control}
              name={"brandName"}
              rules={{ required: "Brand is required" }}
              render={({ field: { onChange, value } }) => {
                return (
                  <div className="flex flex-col">
                    <CustomCreatableSelectComponent
                      isLoading={isLoadingBrands}
                      value={value}
                      name={"brandName"}
                      placeholder={"e.g GlaxoSmithKline (GSK)"}
                      options={convertCreateOptionArray(brandData?.data)}
                      onOptionSelected={(
                        selectedOption: CreatableSelectOption
                      ) => {
                        onChange(selectedOption?.value);
                      }}
                    />
                    {errors.brandName?.message && (
                      <Text as={"span"} className="text-red-500 text-sm">
                        {errors?.brandName?.message}
                      </Text>
                    )}
                  </div>
                );
              }}
            />
          </FormControl>
          <FormControl isInvalid={!!errors.categoryName}>
            <FormLabel>Category</FormLabel>
            <Controller
              control={control}
              name={"categoryName"}
              rules={{ required: "Category is required" }}
              render={({ field: { onChange, value } }) => (
                <div className="flex flex-col">
                  <CustomCreatableSelectComponent
                    isLoading={isLoadingCategory}
                    value={value}
                    name={"categoryName"}
                    placeholder={"e.g Analgesics"}
                    options={convertCreateOptionArray(categoryData?.data)}
                    onOptionSelected={(
                      selectedOption: CreatableSelectOption
                    ) => {
                      onChange(selectedOption?.value);
                    }}
                  />
                  {errors.categoryName?.message && (
                    <Text as={"span"} className="text-red-500 text-sm">
                      {errors?.categoryName?.message}
                    </Text>
                  )}
                </div>
              )}
            />
          </FormControl>
        </HStack>
        <FormControl isInvalid={!!errors.thumbnailFile}>
          {/* <FormLabel>Brand</FormLabel> */}
          <Controller
            control={control}
            name={"thumbnailFile"}
            rules={{ required: "Image is required" }}
            render={({ field: { onChange, value } }) => {
              return (
                <div className="mb-8">
                  <p className="font-medium text-gray-800 mb-3">
                    Upload Product Image
                  </p>
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
                      id="thumbnailFile"
                      name="thumbnailFile"
                      onChange={onLoadImage}
                      accept=".jpeg, .png, .jpg"
                      style={{
                        opacity: "0",
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                      }}
                    />
                    <div className="flex flex-col gap-2 cursor-pointer">
                      <div className="bg-gray-50 p-2 rounded-full mx-auto max-w-max mb-4">
                        <IoCloudDoneOutline className="w-6 h-6 text-gray-700" />
                      </div>
                      <p className="text-sm font-normal text-center">
                        <span className="font-semibold text-primary-500">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-gray-500 text-center">
                        JPEG, PNG or JPG
                        <span className="text-sm ml-1">
                          (Max size 5MB, 800x400px)
                        </span>
                      </p>
                    </div>
                  </Center>
                  {errors.thumbnailFile && (
                    <Text as={"span"} className="text-red-500 text-sm">
                      {errors?.thumbnailFile?.message}
                    </Text>
                  )}
                  {iconFile && (
                    <img
                      src={iconFile}
                      alt=""
                      className="w-10 h-10 mt-3 rounded-sm"
                    />
                  )}
                </div>
              );
            }}
          />
        </FormControl>
      </div>
      <div className="flex gap-4 justify-end mt-5 mb-6">
        <button
          type="button"
          className="p-3 w-32 rounded-md border text-gray-600"
        >
          Back
        </button>
        <button
          type="button"
          className="w-[280px] p-3 rounded-md bg-primary-500 text-white"
          onClick={handleStepValidation}
        >
          Next: Product Essentials
        </button>
      </div>
    </div>
  );
};

export default DetailForm;
