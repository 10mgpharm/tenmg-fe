"use client";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";
import { handleServerErrorMessage } from "@/utils";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface IFormInput {
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

export default function Password() {
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showConfirmedPassword, setShowConfirmedPassword] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm<IFormInput>({
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setIsLoading(true);

      const response = await requestClient({ token: token }).patch(
        "/account/password",
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          newPasswordConfirmation: data.passwordConfirmation,
        }
      );

      if (response.status === 200) {
        toast.success(response?.data?.message);
        reset({
          currentPassword: "",
          newPassword: "",
          passwordConfirmation: "",
        });
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <VStack>
        <div className="flex flex-col justify-between gap-3 w-full">
          <Text fontSize={"1rem"} fontWeight={600} color="gray.700">
            Change Password
          </Text>
          <Text fontSize={"14px"} fontWeight={400} color="gray.700">
            Please enter your current password to change your password.
          </Text>
        </div>
        <Divider my={3} />

        <form className="space-y-5 w-full" onSubmit={handleSubmit(onSubmit)}>
          <HStack className="w-full">
            <FormLabel className="w-1/4">Current Password</FormLabel>
            <FormControl
              className="flex w-full flex-col"
              isInvalid={!!errors.currentPassword?.message}
            >
              <div className="w-full lg:w-2/4 relative">
                <div className="w-fit absolute z-10 top-1/2 -translate-y-1/2 right-2 ">
                  {showCurrentPassword ? (
                    <EyeSlashIcon
                      className="w-4 cursor-pointer text-gray-400"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    />
                  ) : (
                    <EyeIcon
                      className="w-4 cursor-pointer text-gray-400"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    />
                  )}
                </div>
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder={"current password"}
                  className="w-fit"
                  {...register("currentPassword", {
                    required: "Current Password is required",
                    minLength: {
                      value: 8,
                      message: "Must be at least 8 characters.",
                    },
                  })}
                />
              </div>
              <FormErrorMessage>
                {errors.currentPassword?.message}
              </FormErrorMessage>
            </FormControl>
          </HStack>
          <Divider my={3} />
          <HStack className="w-full">
            <FormLabel className="w-1/4">New Password</FormLabel>
            <FormControl
              className="flex w-full flex-col"
              isInvalid={!!errors.newPassword?.message}
            >
              <div className="w-full lg:w-2/4">
                <div className="w-full relative">
                  <div className="w-fit absolute z-10 top-1/2 -translate-y-1/2 right-2 ">
                    {showPassword ? (
                      <EyeSlashIcon
                        className="w-4 cursor-pointer text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <EyeIcon
                        className="w-4 cursor-pointer text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={"new password"}
                    className="w-fit"
                    {...register("newPassword", {
                      required: "New Password is required",
                      minLength: {
                        value: 8,
                        message: "Must be at least 8 characters.",
                      },
                      validate: (val) =>
                        watch("currentPassword") === val
                          ? "Your new password shouldn't be the same as current password"
                          : undefined,
                    })}
                  />
                </div>
                {/* <p className='text-sm text-gray-500 font-semibold'>Your new password must be more than 8 characters.</p> */}
              </div>
              <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
            </FormControl>
          </HStack>
          <Divider my={3} />
          <HStack className="w-full">
            <FormLabel className="w-1/4">Confirm New Password</FormLabel>
            <FormControl
              className="flex w-full flex-col"
              isInvalid={!!errors.passwordConfirmation?.message}
            >
              <div className="w-full lg:w-2/4 relative">
                <div className="w-fit absolute z-10 top-1/2 -translate-y-1/2 right-2 ">
                  {showConfirmedPassword ? (
                    <EyeSlashIcon
                      className="w-4 cursor-pointer text-gray-400"
                      onClick={() =>
                        setShowConfirmedPassword(!showConfirmedPassword)
                      }
                    />
                  ) : (
                    <EyeIcon
                      className="w-4 cursor-pointer text-gray-400"
                      onClick={() =>
                        setShowConfirmedPassword(!showConfirmedPassword)
                      }
                    />
                  )}
                </div>
                <Input
                  type={showConfirmedPassword ? "text" : "password"}
                  placeholder={"confirm password"}
                  className="w-fit"
                  {...register("passwordConfirmation", {
                    required: "Confirm Password is Required",
                    validate: (val) =>
                      watch("newPassword") !== val
                        ? "Your passwords do not match"
                        : undefined,
                  })}
                />
              </div>
              <FormErrorMessage>
                {errors.passwordConfirmation?.message}
              </FormErrorMessage>
            </FormControl>
          </HStack>
          <Divider my={3} />

          <div className="w-fit mx-auto mt-10">
            <Flex className="flex items-center gap-3">
              <Button variant="solid" type="submit" isDisabled={isLoading}>
                Save Changes
              </Button>
            </Flex>
          </div>
        </form>
      </VStack>
    </div>
  );
}
