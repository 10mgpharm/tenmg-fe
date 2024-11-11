"use client";

import requestClient from "@/lib/requestClient";
import { handleServerErrorMessage } from "@/utils";
import {
  Button,
  Center,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import UploadFile from "../../components/UploadFile";

interface IFormInput {
  name: string;
  email: string;
  phone: string;
  referenceId?: string;
  file?: File | null;
}

const CreateCustomer = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const onSubmit = async (value: IFormInput) => {
    const formData = new FormData();
    formData.append("email", value.email);
    formData.append("vendorId", sessionData?.user?.id);
    formData.append("name", value.name);
    formData.append("phone", value.phone);
    if (value.referenceId) {
      formData.append("referenceId", value.referenceId);
    }
    if (value.file) {
      formData.append("file", value.file);
    }

    try {
      setIsLoading(true);
      const response = await requestClient({
        token: sessionData.user.token,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).post("/vendor/customers", formData);

      if (response.status === 201) {
        toast.success("Customer Added Successfully");
        router.push("/vendors/customers-management");
      } else {
        toast.error(`Failed to Add Customer: ${response.data.message}`);
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(`Failed to Add Customer: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-3 md:p-8 bg-gray-25">
      <div>
        <h3 className="font-semibold text-2xl pb-2">Create Customer</h3>
        <p className="text-gray-500">
          Enter customer&apos;s personal details and information.
        </p>
      </div>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-md my-16">
        <HStack onClick={() => router.back()} cursor={"pointer"} pb={6}>
          <ArrowLeftIcon className="w-5 h-5" />
          <Text>Back</Text>
        </HStack>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <HStack gap={6} flexDirection={{ base: "column", md: "row" }}>
            <FormControl isInvalid={!!errors.name?.message}>
              <FormLabel>
                Full Name
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                placeholder="Jude Bellingham"
                {...register("name", {
                  required: "Full Name is required",
                })}
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.email?.message}>
              <FormLabel>
                Email Address
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                placeholder="judebellingham@gmail.com"
                {...register("email", {
                  required: "Email Address is required",
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
          </HStack>
          <HStack gap={6} flexDirection={{ base: "column", md: "row" }}>
            <FormControl isInvalid={!!errors.phone?.message}>
              <FormLabel>
                Phone Number
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                placeholder="08092389823"
                {...register("phone", {
                  required: "Phone Number is required",
                })}
              />
              <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>External Reference ID</FormLabel>
              <Input placeholder="Reference ID" {...register("referenceId")} />
            </FormControl>
          </HStack>
          <Divider />
          <div className="mb-8">
            <p className="font-medium text-gray-800 mb-1">
              Upload Transaction History
            </p>
            <span className="text-gray-500 mb-3 text-sm">
              All your transactions for the past 6 months, you can upload this
              later.
            </span>
            <Center
              mt={3}
              as="div" // Changed from "button" to "div" to prevent form submission
              py={4}
              border={"1px solid rgb(238, 238, 238)"}
              w={"full"}
              rounded={"md"}
              flexDir={"column"}
              pos={"relative"}
              overflow={"hidden"}
            >
              <UploadFile
                onUpload={(file) => setValue("file", file)}
                accept=".csv, .xlsx, .xls"
                uploadLabel="Click to upload customer data or drag and drop here"
                uploadSuccessMessage="Customer data uploaded successfully!"
              />
            </Center>
          </div>
          <div className="flex gap-4 justify-center mt-5 mb-6">
            <Button
              variant="solid"
              type="submit"
              isDisabled={isLoading}
              isLoading={isLoading}
              loadingText="Submitting"
            >
              Save Customer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomer;
