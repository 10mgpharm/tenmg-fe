"use client";

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

import { useSession } from "next-auth/react";
import { NextAuthUserSession, ResponseDto, User } from "@/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import ChangePassword from "@/app/(protected)/admin/settings/_components/ChangePassword";
import TwoFactorAuth from "@/app/(protected)/admin/settings/_components/TwoFactorAuth";
import EnabledTwoFactor from "@/app/(protected)/admin/settings/_components/EnabledTwoFactor";

interface IFormInput {
  name: string;
  email: string;
  role?: string;
}

const GeneralSettings = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2FA, setIsLoading2FA] = useState(false);
  const [qrcode, setQrcode] = useState<string>("");
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const onSubmit: SubmitHandler<IFormInput> = async (value) => {
    try {
      setIsLoading(true);
      const response = await requestClient({
        token: sessionData.user.token,
      }).patch("account/profile", {
        ...value,
      });
      const { data }: ResponseDto<User> = response.data;

      // const data = response.data.data;

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
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (sessionData) {
      setValue("name", sessionData.user.name, { shouldValidate: true });
      setValue("email", sessionData.user.email, { shouldValidate: true });
      setValue("role", sessionData.user.role); // Add this line
    }
  }, [sessionData, setValue]);

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
              <Input disabled type="text" {...register("role")} />
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
            <Text fontSize={"14px"} color={"gray.500"}>
              Change your current password
            </Text>
          </Stack>

          <Button
            onClick={onOpen}
            variant={"outline"}
            color={"gray.500"}
            fontSize={"15px"}
            h={"38px"}
            px={3}
          >
            Change Password
          </Button>
        </HStack>

        <Divider my={3} />
        <HStack justify={"space-between"}>
          <Stack>
            <Text fontWeight={600} fontSize={"1rem"}>
              Enable Two-Factor Authentication
            </Text>
            <Text fontSize={"14px"} color={"gray.500"}>
              Two-Factor authentication adds another layer <br /> of security to
              your account.
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
