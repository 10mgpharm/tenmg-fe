"use client";
import { ProfileImageUploader } from "@/app/(protected)/_components/ProfileImageUploader";
import ChangePassword from "@/app/(protected)/admin/settings/_components/ChangePassword";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession, ResponseDto, User } from "@/types";
import { handleServerErrorMessage } from "@/utils";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Switch,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface IFormInput {
  name: string;
  email: string;
}

export default function Page() {
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInfoLoading, setIsInfoLoading] = useState<boolean>(false);
  const [isShowUpload, setIsShowUpload] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const { isOpen, onClose, onOpen } = useDisclosure();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
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

  useEffect(() => {
    if (sessionData) {
      setValue("name", sessionData.user.name, { shouldValidate: true });
      setValue("email", sessionData.user.email, { shouldValidate: true });
    }
  }, [sessionData, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (value) => {
    try {
      setIsLoading(true);
      const response = await requestClient({
        token: sessionData.user.token,
      }).patch("account/profile", {
        ...value,
      });
      const { data }: ResponseDto<User> = response.data;

      if (response.status === 200) {
        toast.success(response.data.message);
        setIsLoading(false);
        await session.update({
          ...sessionData,
          user: {
            ...sessionData.user,
            name: data.name,
            email: data.email,
          },
        });
      } else {
        toast.error(`Profile change failed: ${response.data.message}`);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(`Profile change failed: ${errorMessage}`);
    }
  };

  return (
    <div>
      <div className="w-full flex justify-between p-5 ">
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold text-lg">Personal Information</h3>
            <p className="text-sm text-slate-300">
              Update your personal detials
            </p>
          </div>

          <ProfileImageUploader
            filePreview={filePreview}
            sessionData={sessionData}
            handleFileChange={handleFileChange}
            uploadProfileImage={uploadProfileImage}
            isUploading={isUploading}
            isShowUpload={isShowUpload}
            fileError={fileError}
          />
        </div>
        <Button size={"sm"} variant={"solid"} colorScheme={"primary"}>
          Save Changes
        </Button>
      </div>

      <div className="p-5 rounded-lg bg-white/70 border border-slate-200">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder={"Chudi"}
                {...register("name", {
                  required: "Name is required",
                })}
              />
            </FormControl>
          </div>

          <Divider />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <FormLabel>Email</FormLabel>
            <FormControl className="col-span-2">
              <Input
                type="email"
                placeholder={"olivia@untitledui.com"}
                {...register("email", {
                  required: "email is required",
                })}
              />
            </FormControl>
          </div>
        </form>
      </div>

      <div className="space-y-5 w-full flex justify-between p-5 ">
        <div>
          <h3 className="font-semibold text-lg">Security</h3>
          <p className="text-sm text-slate-300">Manage your password and 2FA</p>
        </div>
        <Button size={"sm"} variant={"solid"} colorScheme={"primary"}>
          Save Changes
        </Button>
      </div>
      <div className="p-5 rounded-lg bg-white/70 border border-slate-200">
        <div className="space-y-5 w-full flex justify-between p-5 ">
          {/* <div className='space-y-5'> */}
          <div>
            <h3 className="font-semibold text-lg">Password</h3>
            <p className="text-sm text-slate-300">
              Change your current password
            </p>
          </div>
          <Button
            size={"sm"}
            variant={"outline"}
            colorScheme={"primary"}
            onClick={onOpen}
          >
            Change Password
          </Button>
          {/* </div> */}
        </div>

        <Divider my={4} />

        <div className="space-y-5 w-full flex justify-between p-5 ">
          <div>
            <h3 className="font-semibold text-lg">
              Enable Two-Factor Authentication
            </h3>
            <p className="text-sm text-slate-300">
              Two-Factor authentication adds another layer of security to your
              account.
            </p>
          </div>
          <Switch colorScheme="primary" />
        </div>

        <ChangePassword onClose={onClose} isOpen={isOpen} />
      </div>
    </div>
  );
}
