"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  Avatar,
  Box,
  Icon,
} from "@chakra-ui/react";
import { HiddenFileUpload } from "../../../../_components/(settings-component)/HiddenFileUpload";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { useToast } from "@chakra-ui/react";
import requestClient from "@/lib/requestClient";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { FaCamera } from "react-icons/fa6";
import { ProfileImageUploader } from "@/app/(protected)/_components/ProfileImageUploader";

interface IFormInput {
  businessName: string;
  contactEmail: string;
  contactPerson: string;
  contactPhone: string;
  businessAddress: string;
  contactPersonPosition: string;
}

export default function ProfileInformation() {
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInfoLoading, setIsInfoLoading] = useState<boolean>(false);
  const [isShowUpload, setIsShowUpload] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

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
      contactPersonPosition: "",
    },
  });

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError("File size must be less than 5MB");
      event.target.value = "";
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setFileError("Only image files are allowed");
      event.target.value = "";
      return;
    }

    setIsShowUpload(true);
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const uploadProfileImage = useCallback(async () => {
    if (!file) return;

    const formdata = new FormData();
    formdata.append("profilePicture", file);
    formdata.append("email", userEmail);
    formdata.append("name", userName);

    setIsUploading(true);

    try {
      const response = await requestClient({
        token: sessionData.user.token,
      }).post("/account/profile", formdata);

      if (response.status === 200) {
        toast.success(response?.data?.message);

        //  update session here
        await session.update({
          ...sessionData,
          user: {
            ...sessionData.user,
            picture: response?.data?.data?.avatar,
          },
        });
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [file, userEmail, userName, sessionData, session]);

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
      setValue("contactPersonPosition", data.contactPersonPosition);
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

      const response = await requestClient({
        token: sessionData.user.token,
      }).patch("/storefront/settings/business-information", {
        ...value,
      });

      if (response.status === 200) {
        toast.success("Personal information successfully updated");
        //  update session here
        await session.update({
          ...sessionData,
          user: {
            ...sessionData.user,
            businessName: value.businessName,
          },
        });
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
    <Stack p={4}>
      <ProfileImageUploader
        filePreview={filePreview}
        sessionData={sessionData}
        handleFileChange={handleFileChange}
        uploadProfileImage={uploadProfileImage}
        isUploading={isUploading}
        isShowUpload={isShowUpload}
        fileError={fileError}
      />
      <form className="space-y-5 mt-6" onSubmit={handleSubmit(onSubmit)}>
        <HStack gap={5}>
          <FormControl isInvalid={!!errors.businessName?.message}>
            <FormLabel>Business Name</FormLabel>
            <Input
              type="text"
              placeholder={"Jacquelyn's Pharmacy"}
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
              isDisabled
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

          <FormControl isInvalid={!!errors.contactPersonPosition?.message}>
            <FormLabel>Contact Person Position</FormLabel>
            <Input
              type="tel"
              placeholder={"Managing Director"}
              {...register("contactPersonPosition", {
                required: "Contact Person Position is required",
              })}
            />
          </FormControl>
        </HStack>
        <div className="w-fit mx-auto mt-10">
          <Flex className="flex items-center gap-3">
            <Button variant="solid" type="submit">
              Save Changes
            </Button>
          </Flex>
        </div>
      </form>
    </Stack>
  );
}
