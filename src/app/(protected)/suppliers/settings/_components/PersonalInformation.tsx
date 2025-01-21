"use client";

import avatar from "@public/assets/images/Avatar.svg";
import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { handleServerErrorMessage } from "@/utils";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import Loader from "@/app/(protected)/admin/_components/Loader";
import { ProfileImageUploader } from "@/app/(protected)/_components/ProfileImageUploader";

interface IFormInput {
  businessName: string;
  contactEmail: string;
  contactPerson: string;
  contactPhone: string;
  businessAddress: string;
  contactPersonPosition: string;
}

const PersonalInformation = () => {
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const chakraToast = useToast();

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string>(
    sessionData?.user?.avatar || avatar
  );
  const [userInformation, setUserInformation] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUserInfo, setIsUserInfo] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isShowUpload, setIsShowUpload] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      businessName: "",
      contactEmail: "",
      contactPhone: "",
      businessAddress: "",
      contactPersonPosition: "",
    },
  });

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
      setIsUserInfo(true);

      const response = await requestClient({
        token: sessionData.user.token,
      }).get("/supplier/settings");

      const data = response.data.data;
      setValue("businessName", data.businessName);
      setValue("contactEmail", data.contactEmail);
      setValue("contactPerson", data.contactPerson);
      setValue("contactPhone", data.contactPhone);
      setValue("businessAddress", data.businessAddress);
      setValue("contactPersonPosition", data.contactPersonPosition || "");
      setUserEmail(data.contactEmail);
      setUserName(data.businessName);
      setFilePreview(data.owner.avatar);
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsUserInfo(false);
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
      }).patch("/supplier/settings/business-information", {
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

  if (isUserInfo) {
    return <Loader />;
  }

  return (
    <div className="p-5 rounded-md bg-white max-w-3xl">
      {/* <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Image
            src={previewUrl}
            width={50}
            height={50}
            alt=""
            className="rounded-full h-[55px] w-[55px]"
          />
          <div className="">
            <h3 className="font-medium text-gray-500">Profile Picture</h3>
            <p className="text-gray-400 text-sm">
              {" "}
              PNG or JPG
              <br></br>
              <span className="text-xs">(Max size 5MB, 800x400px)</span>
            </p>
          </div>
        </div>
        <Center
          as="button"
          flexDir={"column"}
          width={"98px"}
          pos={"relative"}
          overflow={"hidden"}
        >
          <input
            type="file"
            id="image_uploads"
            name="image"
            onChange={onLoadImage}
            accept=".png, .jpg, .jpeg"
            style={{
              opacity: "0",
              position: "absolute",
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
          <span className="border p-2 rounded-md px-4 text-center">Upload</span>
        </Center>
      </div> */}
      <ProfileImageUploader
        filePreview={filePreview}
        sessionData={sessionData}
        handleFileChange={handleFileChange}
        uploadProfileImage={uploadProfileImage}
        isUploading={isUploading}
        isShowUpload={isShowUpload}
        fileError={fileError}
      />
      <form className="space-y-5 mt-5 mb-8" onSubmit={handleSubmit(onSubmit)}>
        <HStack gap={5}>
          <FormControl isInvalid={!!errors.contactPerson?.message}>
            <FormLabel>Contact Person&apos;s Name</FormLabel>
            <Input
              placeholder="Enter contact name"
              {...register("contactPerson", {
                required: "Contact Name is required",
              })}
            />
            <FormErrorMessage>{errors.contactPerson?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.businessName?.message}>
            <FormLabel>Business Name</FormLabel>
            <Input
              placeholder="Enter business name"
              {...register("businessName", {
                required: "Business Name is required",
              })}
            />
            <FormErrorMessage>{errors.businessName?.message}</FormErrorMessage>
          </FormControl>
        </HStack>
        <HStack gap={5}>
          <FormControl isInvalid={!!errors.contactEmail?.message}>
            <FormLabel>Business email</FormLabel>
            <Input
              type="email"
              placeholder="Enter business email"
              {...register("contactEmail", {
                required: "Business Email is required",
              })}
            />
            <FormErrorMessage>{errors.contactEmail?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.contactPhone?.message}>
            <FormLabel>Contact Phone Number</FormLabel>
            <Input
              type="number"
              placeholder="Enter phone number"
              {...register("contactPhone", {
                required: "Contact Phone Number is required",
              })}
            />
            <FormErrorMessage>{errors.contactPhone?.message}</FormErrorMessage>
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
            <FormErrorMessage>
              {errors.businessAddress?.message}
            </FormErrorMessage>
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
            <FormErrorMessage>
              {errors.contactPersonPosition?.message}
            </FormErrorMessage>
          </FormControl>
        </HStack>

        <HStack justify={"end"}>
          <Flex>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isLoading}
              isDisabled={isLoading || isUserInfo}
            >
              Save Changes
            </Button>
          </Flex>
        </HStack>
      </form>
    </div>
  );
};

export default PersonalInformation;
