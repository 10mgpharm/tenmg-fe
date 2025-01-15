"use client";

import React, { useState, useRef, forwardRef, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Box,
  Text,
  Flex,
} from "@chakra-ui/react";
import { IoCloudDoneOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import DateComponent from "@/app/(protected)/suppliers/products/_components/DateComponent";
import { BusinessStatus } from "@/constants";
import moment from "moment";

interface IFormInput {
  licenseNumber: string;
  expiryDate: Date | null;
  cacDocument: File | null;
}

type BusinessLicense = {
  expiryDate: string;
  licenseFile: string;
  licenseNumber: string;
  licenseVerificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const LicenseUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const [businessLicense, setBusinessLisense] = useState<BusinessLicense>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error(
          "File size exceeds the 10MB limit. Please upload a smaller file."
        );
        setFile(null);
        setValue("cacDocument", null);
      } else {
        setFile(selectedFile);
        setValue("cacDocument", selectedFile);
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.size > MAX_FILE_SIZE) {
        toast.error(
          "File size exceeds the 10MB limit. Please upload a smaller file."
        );
        setFile(null);
        setValue("cacDocument", null);
      } else {
        setFile(droppedFile);
        setValue("cacDocument", droppedFile);
      }
    }
  };

  const onSubmit = async (value: IFormInput) => {
    const date = new Date(value.expiryDate);
    const formattedDate = date.toISOString().split("T")[0];

    const formData = new FormData();
    formData.append("licenseNumber", value.licenseNumber);
    formData.append("expiryDate", formattedDate);
    if (value.cacDocument) {
      formData.append("cacDocument", value.cacDocument);
    } else {
      console.log("No CAC document selected.");
    }

    try {
      setIsLoading(true);
      const response = await requestClient({
        token: sessionData.user.token,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).post("/storefront/settings/license", formData);
      if (response.status === 200) {
        toast.success(response.data.message);

        // update session here
        await session.update({
          ...sessionData,
          user: {
            ...sessionData.user,
           businessStatus: BusinessStatus.PENDING_APPROVAL 
          },
        });

        const { expiryDate, licenseFile, licenseNumber, licenseVerificationStatus } = response.data?.data;
        
        setBusinessLisense({
          expiryDate,
          licenseFile,
          licenseNumber,
          licenseVerificationStatus,
        });

        setIsLoading(false);
      } else {
        toast.error(`License upload failed: ${response.data.message}`);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(`License upload failed: ${errorMessage}`);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  // handle fetch license
  useEffect(() => {
    const fetchLicense = async () => {
      setIsLoading(true);
      try {
        const response = await requestClient({
          token: sessionData.user.token,
        }).get("/storefront/settings/license");
        setIsLoading(false);

        if (response.status === 200) {
          const { expiryDate, licenseFile, licenseNumber, licenseVerificationStatus } = response.data?.data;
          setBusinessLisense({
            expiryDate,
            licenseFile,
            licenseNumber,
            licenseVerificationStatus,
          });
        }
      } catch (error) {
        setIsLoading(false);
        const errorMessage = handleServerErrorMessage(error);
        toast.error(`License fetch failed: ${errorMessage}`);
      }
    };
    if (sessionData?.user?.token) fetchLicense();
  }, [sessionData?.user?.token]);

  if (sessionData?.user?.businessStatus === BusinessStatus.PENDING_APPROVAL) {
    return (
      <Box className="max-w-2xl bg-white p-10 rounded-md border-2 border-gray-200 flex flex-col space-y-5">
        <Text className="text-left text-sm font-medium text-red-500">
          Your business CAC and License has been updated. Please check back later for the approval status.
        </Text>
        {/* preview with document link  */}
        {isLoading && (
          <Flex direction={'column'} gap={5} className="animate-pulse">
            <Text className="text-left text-sm font-medium text-gray-500 bg-gray-500 w-full h-5">
              {' '}
            </Text>
            <Text className="text-left text-sm font-medium text-gray-500 bg-gray-500 w-full h-5">
              {' '}
            </Text>
            <Text className="text-left text-sm font-medium text-gray-500 bg-gray-500 w-9/12 h-5">
              {' '}
            </Text>
          </Flex>
        )}
        {!isLoading && (
          <Flex direction={'column'} gap={5}>
            <Text className="text-left text-sm font-medium text-gray-500">
              CAC Document:
              <a target="_blank" href={businessLicense?.licenseFile} className="font-bold cursor-pointer underline">
                View Document
              </a>
            </Text>
            <Text className="text-left text-sm font-medium text-gray-500">
              License Number: <span className="font-bold">{businessLicense?.licenseNumber}</span>
            </Text>
            <Text className="text-left text-sm font-medium text-gray-500">
              Expiry Date: <span className="font-bold">{businessLicense?.expiryDate ? moment(businessLicense?.expiryDate)?.format('MMMM Do YYYY') : 'N/A'}</span>
            </Text>
          </Flex>
        )}
      </Box>
    )
  }

  return (
    <>
    <Box className="max-w-2xl bg-white p-10 rounded-md border-2 border-gray-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 mb-6"
        encType="multipart/form-data"
      >
        {/* License Number */}
        <FormControl isInvalid={!!errors.licenseNumber}>
          <FormLabel>License Number</FormLabel>
          <Input
            type="text"
            placeholder="Enter License Number"
            {...register("licenseNumber", {
              required: "License number is required.",
            })}
          />
          <FormErrorMessage>{errors.licenseNumber?.message}</FormErrorMessage>
        </FormControl>

        {/* Expiry Date */}
        <FormControl isInvalid={!!errors.expiryDate}>
          <FormLabel>Expiry Date</FormLabel>
          <Controller
            name="expiryDate"
            control={control}
            rules={{ required: "Expiry date is required" }}
            render={({ field }) => (
              <DateComponent
                startDate={field.value}
                setStartDate={field.onChange}
              />
            )}
          />

          <FormErrorMessage>{errors.expiryDate?.message}</FormErrorMessage>
        </FormControl>

        {/* CAC Document Upload */}
        <FormControl isInvalid={!!errors.cacDocument} className="mb-8">
          <FormLabel>CAC Document</FormLabel>
          <Controller
            name="cacDocument"
            control={control}
            rules={{
              required: "CAC Document is required",
            }}
            render={({ field }) => (
              <Box
                className="border relative p-4 rounded-md"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  handleDrop(e);
                  field.onChange(e.dataTransfer.files?.[0]);
                }}
                cursor="pointer"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf, .doc, .docx"
                  onChange={(e) => {
                    handleFileChange(e);
                    field.onChange(e.target.files?.[0]);
                  }}
                  className="hidden"
                />
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box bg="gray.50" p={2} rounded="full" mx="auto" mb={4}>
                    <IoCloudDoneOutline className="w-6 h-6 text-gray-700" />
                  </Box>
                  <Text fontSize="sm" textAlign="center">
                    <span className="font-semibold text-primary-500">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </Text>
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    PDF, DOC or DOCX. Maximum size of 10MB (max. 800x400px)
                  </Text>
                  {file && (
                    <Text fontSize="sm" color="gray.500">
                      Selected file: {field.value?.name}
                    </Text>
                  )}
                </Box>
              </Box>
            )}
          />

          <FormErrorMessage>{errors.cacDocument?.message}</FormErrorMessage>
        </FormControl>

        {/* Submit Button */}
        <Button
          type="submit"
          colorScheme="blue"
          w="full"
          isDisabled={isLoading}
          isLoading={isLoading}
          loadingText="Submitting"
        >
          Submit
        </Button>
      </form>
    </Box>
    </>
  );
};

export default LicenseUpload;
