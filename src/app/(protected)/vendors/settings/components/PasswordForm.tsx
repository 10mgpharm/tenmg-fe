"use client";

import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
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
import { NextAuthUserSession, ResponseDto } from "@/types";
import { useSession } from "next-auth/react";

interface IFormInput {
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

const PasswordForm = () => {
  const [currentPasswordShow, setCurrentPasswordShow] =
    useState<boolean>(false);
  const [confirmPasswordShow, setConfirmPasswordShow] =
    useState<boolean>(false);
  const [newPasswordShow, setNewPasswordShow] = useState<boolean>(false);

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
        "/account/settings/password",
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
    <div className="max-w-5xl p-5 rounded-md">
      <div className="pb-5">
        <h5 className="text-xl font-medium mb-1">Password</h5>
        <p className="text-sm font-normal text-gray-500">
          Please enter your current password to change your password.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Divider mb={5} />
        <Stack direction={"column"} gap={5} divider={<Divider />}>
          <FormControl
            display={"flex"}
            isInvalid={!!errors.currentPassword?.message}
          >
            <FormLabel w={"40%"}>
              Current Password
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Box w={"60%"}>
              <InputGroup size={"lg"}>
                <Input
                  type={currentPasswordShow ? "text" : "password"}
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
                  {currentPasswordShow ? (
                    <FaEye
                      onClick={() =>
                        setCurrentPasswordShow(!currentPasswordShow)
                      }
                      className="text-gray-500 w-5 h-5"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() =>
                        setCurrentPasswordShow(!currentPasswordShow)
                      }
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
          <FormControl
            display={"flex"}
            isInvalid={!!errors.newPassword?.message}
          >
            <FormLabel w={"40%"} htmlFor="newPassword">
              New Password
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Box w={"60%"}>
              <InputGroup size={"lg"}>
                <Input
                  type={newPasswordShow ? "text" : "password"}
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
                  {newPasswordShow ? (
                    <FaEye
                      onClick={() => setNewPasswordShow(!newPasswordShow)}
                      className="text-gray-500 w-5 h-5"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() => setNewPasswordShow(!newPasswordShow)}
                      className="text-gray-500 w-5 h-5"
                    />
                  )}
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
            </Box>
          </FormControl>

          <FormControl
            display={"flex"}
            isInvalid={!!errors.passwordConfirmation?.message}
          >
            <FormLabel w={"40%"} htmlFor="passwordConfirmation">
              Confirm Password
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Box w={"60%"}>
              <InputGroup size={"lg"}>
                <Input
                  type={confirmPasswordShow ? "text" : "password"}
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
                  {confirmPasswordShow ? (
                    <FaEye
                      onClick={() =>
                        setConfirmPasswordShow(!confirmPasswordShow)
                      }
                      className="text-gray-500 w-5 h-5"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() =>
                        setConfirmPasswordShow(!confirmPasswordShow)
                      }
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

          <FormControl display="flex" alignItems="center">
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
        <HStack justify={"center"} my={6}>
          <Flex>
            <Button variant="outline" mr={3}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue" isDisabled={isLoading}>
              Save Changes
            </Button>
          </Flex>
        </HStack>
      </form>

      <OTPAuth isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default PasswordForm;
