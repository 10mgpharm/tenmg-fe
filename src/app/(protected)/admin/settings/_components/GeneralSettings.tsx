"use client";
import avatar from "@public/assets/images/Avatar.svg";
import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  HStack,
  Input,
  Stack,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import ChangePassword from "./ChangePassword";
import TwoFactorAuth from "./TwoFactorAuth";
import EnabledTwoFactor from "./EnabledTwoFactor";
import { useSession } from "next-auth/react";
import { NextAuthUserSession, ResponseDto, User } from "@/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { ProfileImageUploader } from "@/app/(protected)/_components/ProfileImageUploader";
interface IFormInput {
  name: string;
  email: string;
  businessName: string;
  contactEmail: string;
  contactPerson: string;
  contactPhone: string;
  businessAddress: string;
  contactPersonPosition: string;
}

const GeneralSettings = () => {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  //   const chakraToast = useToast();

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string>(
    sessionData?.user?.avatar || avatar
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUserInfo, setIsUserInfo] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isShowUpload, setIsShowUpload] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpen2FA,
    onClose: onClose2FA,
    onOpen: onOpen2fa,
  } = useDisclosure();
  const {
    isOpen: isOpenEnable2FA,
    onClose: onCloseEnable2FA,
    onOpen: onOpenEnable2fa,
  } = useDisclosure();
  const [isLoading2FA, setIsLoading2FA] = useState(false);
  const [qrcode, setQrcode] = useState<string>("");

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

  const {
    register,
    formState: { errors, isValid },
    setValue,
    handleSubmit,
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
    formdata.append("email", sessionData.user.email);
    formdata.append("name", sessionData.user.name);

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
      }).get("/account/profile");

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
    if (sessionData) {
      setValue("name", sessionData.user.name, { shouldValidate: true });
      setValue("email", sessionData.user.email, { shouldValidate: true });
    }
  }, [sessionData, setValue]);

  useEffect(() => {
    if (sessionData?.user?.token) {
      fetchUserInformation();
    }
  }, [sessionData, fetchUserInformation]);

  const SETUP_2FA = async () => {
    try {
      setIsLoading2FA(true);
      const response = await requestClient({
        token: sessionData.user.token,
      }).get("/account/2fa/setup");
      setIsLoading2FA(false);
      if (response.status === 200) {
        setQrcode(response.data?.data);
        onOpen2fa();
      }
    } catch (error) {
      setIsLoading2FA(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const RESEND_2FA = async () => {
    // onOpen2fa();
    try {
      setIsLoading2FA(true);
      const response = await requestClient({
        token: sessionData.user.token,
      }).post("/account/2fa/reset", {
        otp: "1H1DP1",
        password: "password",
      });
      setIsLoading2FA(false);
      if (response.status === 200) {
        onOpen2fa();
      }
    } catch (error) {
      setIsLoading2FA(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack justify={"space-between"}>
          <Stack>
            <Text fontWeight={600} fontSize={"1rem"}>
              Personal Details
            </Text>
            <Text fontSize={"14px"} color={"gray.500"}>
              Update your personal details.
            </Text>
          </Stack>
          <Button
            type="submit"
            fontSize={"15px"}
            h={"38px"}
            px={3}
            py={1}
            isDisabled={isLoading}
            isLoading={isLoading}
            loadingText="Submitting..."
          >
            Save Changes
          </Button>
        </HStack>
        <Box className="bg-white p-4 rounded-md border mt-5">
          <ProfileImageUploader
            filePreview={filePreview}
            sessionData={sessionData}
            handleFileChange={handleFileChange}
            uploadProfileImage={uploadProfileImage}
            isUploading={isUploading}
            isShowUpload={isShowUpload}
            fileError={fileError}
          />
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem colSpan={1}>
              <Text>Name</Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Input
                type="text"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && (
                <Text as={"span"} className="text-red-500 text-sm">
                  {errors.name?.message}
                </Text>
              )}
            </GridItem>
          </Grid>
          <Divider my={3} />
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem colSpan={1}>
              <Text fontWeight={500}>Email Address</Text>
              <Text fontSize={"15px"} h={"38px"} color={"gray.500"}>
                Your associated email address
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Input
                type="email"
                disabled
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <Text as={"span"} className="text-red-500 text-sm">
                  {errors.email?.message}
                </Text>
              )}
            </GridItem>
          </Grid>
          <Divider my={3} />
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem colSpan={1}>
              <Text fontWeight={500}>Role</Text>
              <Text fontSize={"14px"} color={"gray.500"}>
                Your associated role and permissions level
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Input
                disabled
                type="text"
                value={sessionData?.user?.entityType}
              />
            </GridItem>
          </Grid>
        </Box>
      </form>
      <Divider my={3} />
      <HStack justify={"space-between"}>
        <Stack>
          <Text fontWeight={600} fontSize={"1rem"}>
            Security
          </Text>
          <Text fontSize={"14px"} color={"gray.500"}>
            Manage your password and 2FA
          </Text>
        </Stack>
      </HStack>
      <Box className="bg-white p-4 rounded-md border mt-5">
        <HStack justify={"space-between"}>
          <Stack>
            <Text fontWeight={600} fontSize={"1rem"}>
              Password
            </Text>
            <Text fontSize={"14p"} color={"gray.500"}>
              Change your current password
            </Text>
          </Stack>
          <Button
            onClick={onOpen}
            variant={"outline"}
            fontSize={"15px"}
            h={"38px"}
            px={3}
          >
            Change password
          </Button>
        </HStack>
        <Divider my={3} />
        <HStack justify={"space-between"}>
          <Stack>
            <Text fontWeight={600} fontSize={"1rem"}>
              Enable Two-Factor Authentication
            </Text>
            <Text fontSize={"14px"} color={"gray.500"}>
              Two-Factor authentication adds another layer of security to your
              account.
            </Text>
          </Stack>
          <Button
            isLoading={isLoading2FA}
            loadingText="Submitting..."
            onClick={SETUP_2FA}
            variant={"outline"}
            fontSize={"15px"}
            h={"38px"}
            isDisabled={isLoading2FA}
            px={3}
          >
            Setup 2FA
          </Button>
          {/* <Switch 
                size='lg' 
                onChange={(e) => {
                    if(e.target.checked){onOpen2fa()}
                }} 
                /> */}
        </HStack>
      </Box>
      <ChangePassword onClose={onClose} isOpen={isOpen} />
      <TwoFactorAuth
        isOpen={isOpen2FA}
        onClose={onClose2FA}
        onOpenEnable2fa={onOpenEnable2fa}
        data={qrcode}
        token={sessionData?.user.token}
      />
      <EnabledTwoFactor isOpen={isOpenEnable2FA} onClose={onCloseEnable2FA} />
    </div>
  );
};

export default GeneralSettings;
