"use client";

import React, { useState, useRef, forwardRef } from "react";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Box,
  Text,
  InputGroup,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import { IoCalendarOutline, IoCloudDoneOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession, ResponseDto, User } from "@/types";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface IFormInput {
  licenseNumber: string;
  date: Date | null;
  cacDocument: File | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

interface CustomDateInputProps {
  value?: string;
  onClick?: () => void;
  className?: string; // Optional className prop
}

const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ value, onClick }, ref) => (
    <InputGroup onClick={onClick} cursor="pointer" w={"100%"}>
      <Input readOnly value={value} ref={ref} w={"100%"} />
      <InputRightElement pointerEvents="none">
        <Icon as={IoCalendarOutline} color="gray.500" />
      </InputRightElement>
    </InputGroup>
  )
);

CustomDateInput.displayName = 'CustomDateInput';

const LicenseUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

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

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
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

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (value: IFormInput) => {
    console.log("Form Data:", value);

    const formData = new FormData();
    formData.append("licenseNumber", value.licenseNumber);
    formData.append(
      "date",
      selectedDate ? selectedDate.toString().split("T")[0] : ""
    );
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
      }).post("/vendor/settings/license", formData);
      // const { data }: ResponseDto<User> = response.data;
      console.log(response);
      if (response.status === 200) {
        toast.success(response.data.message);
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

  console.log(selectedDate);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  return (
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
        <FormControl isInvalid={!!errors.date}>
          <FormLabel>Expiry Date</FormLabel>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            customInput={<CustomDateInput />}
            wrapperClassName="w-full"
          />

          <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
        </FormControl>

        {/* CAC Document Upload */}
        <Box className="mb-8">
          <Text fontWeight="medium" mb={3}>
            CAC Document
          </Text>
          <Box
            className="border relative p-4 rounded-md"
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            cursor="pointer"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf, .doc, .docx"
              onChange={handleFileChange}
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
                  Selected file: {file.name}
                </Text>
              )}
            </Box>
          </Box>
        </Box>

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
  );
};

export default LicenseUpload;
