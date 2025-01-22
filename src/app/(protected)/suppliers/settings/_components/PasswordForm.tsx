"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import OTPAuth from "./OTPAuth";
import { SubmitHandler, useForm } from "react-hook-form";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";

interface IFormInput {
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

const PasswordForm = () => {
  // Separate states for each password field
  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

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

      setIsLoading(false);

      if (response.status === 200) {
        toast.success(response?.data?.message);
        reset({
          currentPassword: "",
          newPassword: "",
          passwordConfirmation: "",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-5 rounded-md">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Stack direction={"column"} gap={4}>
          <FormControl isInvalid={!!errors.currentPassword?.message}>
            <FormLabel>
              Current Password
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Box>
              <InputGroup size={"lg"}>
                <Input
                  type={showCurrent ? "text" : "password"}
                  placeholder="***********"
                  maxW="3xl"
                  {...register("currentPassword", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Must be at least 8 characters.",
                    },
                  })}
                />
                <InputRightElement>
                  {showCurrent ? (
                    <FaEye
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="text-gray-500 w-5 h-5"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="text-gray-500 w-5 h-5"
                    />
                  )}
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.currentPassword?.message}
              </FormErrorMessage>
            </Box>
          </FormControl>
          {/* New Password */}
          <FormControl isInvalid={!!errors.newPassword?.message}>
            <FormLabel htmlFor="newPassword">
              New Password
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Box>
              <InputGroup size={"lg"}>
                <Input
                  type={showNew ? "text" : "password"}
                  id="password"
                  placeholder="***********"
                  {...register("newPassword", {
                    required: "Password is required",
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
                <InputRightElement>
                  {showNew ? (
                    <FaEye
                      onClick={() => setShowNew(!showNew)}
                      className="text-gray-500 w-5 h-5"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() => setShowNew(!showNew)}
                      className="text-gray-500 w-5 h-5"
                    />
                  )}
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
            </Box>
          </FormControl>

          <FormControl isInvalid={!!errors.passwordConfirmation?.message}>
            <FormLabel htmlFor="passwordConfirmation">
              Confirm Password
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Box>
              <InputGroup size={"lg"}>
                <Input
                  type={showConfirm ? "text" : "password"}
                  id="passwordConfirmation"
                  placeholder="***********"
                  {...register("passwordConfirmation", {
                    required: "Confirm Password is Required",
                    validate: (val) =>
                      watch("newPassword") !== val
                        ? "Your passwords do not match"
                        : undefined,
                  })}
                />
                <InputRightElement>
                  {showConfirm ? (
                    <FaEye
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-gray-500 w-5 h-5"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-gray-500 w-5 h-5"
                    />
                  )}
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.passwordConfirmation?.message}
              </FormErrorMessage>
            </Box>
          </FormControl>

          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <FormLabel htmlFor="2fa" mb="0">
              <Text fontWeight={"medium"}>Multi-Factor Authenticator</Text>
              <Text fontSize={"13px"} maxW={"60%"} color={"gray.400"}>
                Use multi-factor authentication (MFA) to add an extra layer of
                security to your account.
              </Text>
            </FormLabel>
            <Switch id="2fa" />
          </FormControl>
        </Stack>

        {/* <FormControl isInvalid={!!errors.currentPassword?.message}>
          <FormLabel>Current Password</FormLabel>
          <InputGroup size={"lg"}>
            <Input
              type="text" // Always text to handle dynamic display
              value={
                showCurrent
                  ? currentPassword
                  : "*".repeat(currentPassword.length)
              }
              placeholder="***********"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <InputRightElement>
              {showCurrent ? (
                <FaEye
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="text-gray-500 w-5 h-5 cursor-pointer"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="text-gray-500 w-5 h-5 cursor-pointer"
                />
              )}
            </InputRightElement>
          </InputGroup>
        </FormControl>

        
        <FormControl isInvalid={!!errors.newPassword?.message}>
          <FormLabel>New Password</FormLabel>
          <InputGroup size={"lg"}>
            <Input
              type="text" // Always text to handle dynamic display
              value={showNew ? newPassword : "*".repeat(newPassword.length)}
              placeholder="***********"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <InputRightElement>
              {showNew ? (
                <FaEye
                  onClick={() => setShowNew(!showNew)}
                  className="text-gray-500 w-5 h-5 cursor-pointer"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setShowNew(!showNew)}
                  className="text-gray-500 w-5 h-5 cursor-pointer"
                />
              )}
            </InputRightElement>
          </InputGroup>
        </FormControl>

        
        <FormControl isInvalid={!!errors.passwordConfirmation?.message}>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup size={"lg"}>
            <Input
              type="text" // Always text to handle dynamic display
              value={
                showConfirm
                  ? confirmPassword
                  : "*".repeat(confirmPassword.length)
              }
              placeholder="***********"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <InputRightElement>
              {showConfirm ? (
                <FaEye
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-gray-500 w-5 h-5 cursor-pointer"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-gray-500 w-5 h-5 cursor-pointer"
                />
              )}
            </InputRightElement>
          </InputGroup>
        </FormControl> */}

        {/* Multi-Factor Authentication */}
        {/* <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="2fa" mb="0">
            <Text fontWeight={"medium"}>Multi-Factor Authenticator</Text>
            <Text fontSize={"13px"} maxW={"60%"} color={"gray.400"}>
              Use multi-factor authentication (MFA) to add an extra layer of
              security to your account.
            </Text>
          </FormLabel>
          <Switch id="2fa" />
        </FormControl> */}
        <HStack justify={"end"} my={6}>
          <Button type="submit" colorScheme="blue">
            Save Changes
          </Button>
        </HStack>
      </form>

      {/* Action Buttons */}

      <OTPAuth isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default PasswordForm;
