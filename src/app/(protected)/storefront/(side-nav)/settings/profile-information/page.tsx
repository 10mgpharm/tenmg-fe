"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  FormErrorMessage,
} from "@chakra-ui/react";
import { HiddenFileUpload } from "../../../_components/(settings-component)/HiddenFileUpload";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { useToast } from "@chakra-ui/react";
import requestClient from "@/lib/requestClient";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

interface IFormInput {
  businessName: string;
  contactEmail: string;
  contactPerson: string;
  contactPhone: string;
  businessAddress: string;
}

export default function ProfileInformation() {
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInfoLoading, setIsInfoLoading] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const chakraToast = useToast();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      businessName: "",
      contactEmail: "",
      contactPerson: "",
      contactPhone: "",
      businessAddress: "",
    },
  });

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const uploadProfileImage = async () => {
    if (!file) return;

    const formdata = new FormData();
    formdata.append("profilePicture", file);
    formdata.append("email", userEmail);
    formdata.append("name", userName);

    try {
      const response = await requestClient({
        token: sessionData.user.token,
      }).post("/account/profile", formdata);

      if (response.status === 200) {
        toast.success(response?.data?.message);
        fetchUserInformation();
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const fetchUserInformation = useCallback(async () => {
    try {
      setIsInfoLoading(true);

      const response = await requestClient({
        token: sessionData.user.token,
      }).get("/storefront/settings");

      const data = response.data.data;
      setValue("businessName", data.businessName);
      setValue("contactEmail", data.contactEmail);
      setValue("contactPerson", data.contactPerson);
      setValue("contactPhone", data.contactPhone);
      setValue("businessAddress", data.businessAddress);
      setUserEmail(data.contactEmail);
      setUserName(data.businessName);
      setFilePreview(data.owner.avatar);
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsInfoLoading(false);
    }
  }, [sessionData?.user?.token, setValue]);

  useEffect(() => {
    if (sessionData?.user?.token) fetchUserInformation();
  }, [sessionData?.user?.token, fetchUserInformation]);

  const onSubmit: SubmitHandler<IFormInput> = async (value) => {
    try {
      setIsLoading(true);
      if (file) {
        await uploadProfileImage();
      }

      const response = await requestClient({
        token: sessionData.user.token,
      }).patch("/storefront/settings/business-information", {
        ...value,
      });

      if (response.status === 200) {
        toast.success("Personal information successfully updated");
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack>
      <div className="flex gap-4 items-center">
        <div
          className="size-28 rounded-full bg-cover bg-center bg-no-repeat shadow-gray-400 shadow-md"
          style={{
            backgroundImage: `url(${
              filePreview ? filePreview : "/assets/images/avatar.jpg"
            })`,
          }}
        />
        <div className="flex flex-col justify-between gap-3">
          <Text fontSize={"1rem"} fontWeight={600} color="gray.700">
            Profile Image
          </Text>
          <Text fontSize={"14px"} fontWeight={400} color="gray.700">
            Min 400x400px, PNG or JPEG
          </Text>

          <HiddenFileUpload setFilePreview={setFilePreview} setFile={setFile} />
        </div>
      </div>
      <form className="space-y-5 mt-6" onSubmit={handleSubmit(onSubmit)}>
        <HStack gap={5}>
          <FormControl isInvalid={!!errors.businessName?.message}>
            <FormLabel>Business Name</FormLabel>
            <Input
              type="text"
              placeholder={"Jacquelyn’s Pharmacy"}
              {...register("businessName", {
                required: "Business Name is required",
              })}
            />
          </FormControl>
          <FormControl isInvalid={!!errors.contactPerson?.message}>
            <FormLabel>Contact Person Name</FormLabel>
            <Input
              type="text"
              placeholder={"Jacquelyn Bernard"}
              {...register("contactPerson", {
                required: "Contact Person is required",
              })}
            />
          </FormControl>
        </HStack>
        <HStack gap={5}>
          <FormControl isInvalid={!!errors.contactEmail?.message}>
            <FormLabel>Business Email</FormLabel>
            <Input
              type="email"
              placeholder={"olivia@untitledui.com"}
              {...register("contactEmail", {
                required: "Business Email is required",
              })}
            />
          </FormControl>
          <FormControl isInvalid={!!errors.contactPhone?.message}>
            <FormLabel>Contact Phone Number</FormLabel>
            <Input
              type="tel"
              placeholder={"08123456789"}
              {...register("contactPhone", {
                required: "Contact Person Phone is required",
              })}
            />
          </FormControl>
        </HStack>
        <HStack gap={5}>
          <FormControl isInvalid={!!errors.businessAddress?.message}>
            <FormLabel>Business Address</FormLabel>
            <Input
              type="text"
              placeholder={"Plot 360 Obafemi Awolowo way, Jabi District, Abuja"}
              {...register("businessAddress", {
                required: "business Address is required",
              })}
            />
          </FormControl>

          <div className="w-full" />
        </HStack>
        <div className="w-fit mx-auto mt-10">
          <Flex className="flex items-center gap-3">
            <Button variant={"outline"}>Discard</Button>
            <Button bg={"blue.700"} type="submit">
              Save Changes
            </Button>
          </Flex>
        </div>
      </form>
    </Stack>
  );
}
