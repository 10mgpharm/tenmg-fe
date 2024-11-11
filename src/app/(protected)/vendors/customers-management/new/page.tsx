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
import { SubmitHandler, useForm } from "react-hook-form";
import { IoCloudDoneOutline } from "react-icons/io5";
import { toast } from "react-toastify";

interface IFormInput {
  name: string;
  email: string;
  phone: string;
}

const CreateCustomer = () => {
  const router = useRouter();
  const [iconFile, setIconFile] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

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
    if (event?.target?.files?.length > 0) {
      setIconFile(URL.createObjectURL(inputFile));
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (value) => {
    try {
      setIsLoading(true);

      const response = await requestClient({
        token: sessionData.user.token,
      }).post("/vendor/customers", {
        vendorId: sessionData?.user?.id,
        ...value,
      });
      if (response.status === 201) {
        toast.success("Customer Added Successfully");
        router.push("/vendors/customers-management");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  return (
    <div className="p-3 md:p-8 bg-gray-25">
      <div>
        <h3 className="font-semibold text-2xl pb-2">Create Customer</h3>
        <p className="text-gray-500">
          Enter customers personal details and information.
        </p>
      </div>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-md my-16">
        <HStack onClick={() => router.back()} cursor={"pointer"} pb={6}>
          <ArrowLeftIcon className="w-5- h-5" />
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
              <Input placeholder="08092389823" />
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
                id="image_uploads"
                name="image"
                onChange={onLoadImage}
                accept=".csv, .json, .xls, xlsx"
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
                  Excel, CSV or JSON
                  <span className="text-sm ml-1">
                    (Max size 5MB, 800x400px)
                  </span>
                </p>
              </div>
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
