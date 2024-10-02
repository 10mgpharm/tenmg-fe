"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import React from "react";
import AuthWrapper from "@/app/(auth)/components/AuthWrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import { FiEyeOff } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface IFormInput {
  password: string;
  passwordConfirmation: string;
}

const ResetPassword = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
  const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false); // change to true after the password reset is successful
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(null);
  const [otp, setOtp] = useState<string>(null);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const router = useRouter();

  const sessionEmail = Cookies.get("email");
  const sessionOtp = Cookies.get("otp");

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setIsLoading(true);

      // const response = await requestClient().post("/auth/reset-password", {
      //   email: email,
      //   otp: otp,
      //   password: data.password,
      //   passwordConfirmation: data.passwordConfirmation,
      // });

      console.log({
        email: email,
        otp: otp,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      });

      setIsLoading(false);

      // if (response.status === 200) {
      //   toast.success(response?.data?.message);
      //   router.push("/auth/reset-password");
      // }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    setEmail(sessionEmail);
    setOtp(sessionOtp);
  }, [sessionEmail, sessionOtp]);

  return (
    <AuthWrapper type="reset-password">
      <section className="md:w-1/2 px-6 md:px-12 lg:px-32 flex items-center">
        <article className="w-full">
          <Image
            src="/icons/logo.svg"
            className="md:mb-8"
            alt="tenmg"
            width={75}
            height={75}
          />

          {isPasswordReset ? (
            <>
              <div className="mb-8">
                <h3 className="font-normal text-gray-900 text-4xl leading-[44px] tracking-tight mb-3">
                  Password reset
                </h3>

                <p className="text-gray-500 text-base font-normal leading-6 text-left">
                  Your password has been successfully reset. Click below to log
                  in magically.
                </p>
              </div>
              <Button
                color="primary"
                as={Link}
                href="/auth/signin"
                size="lg"
                className="w-full cursor-pointer hover:bg-[#7B61FF]"
                type="submit"
              >
                Login
              </Button>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="font-normal text-gray-900 text-4xl leading-[44px] tracking-tight mb-3">
                  Set new password
                </h3>

                <p className="text-gray-500 text-base font-normal leading-6 text-left">
                  Your new password must be different to previously used
                  passwords.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5 text-gray mb-10">
                  {/* <div className="flex flex-col gap-[6px]">
                    <label htmlFor="password">
                      Password
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex rounded-lg border-1 border-gray-300">
                      <input
                        id="password"
                        className="m-[10px_14px] w-full border-none outline-none"
                        type={isVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Must be at least 8 characters.",
                          },
                        })}
                      />
                      <button
                        className="focus:outline-none px-4"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label="toggle password visibility"
                      >
                        {isVisible ? (
                          <FiEyeOff className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <IoEyeOutline className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="text-gray-500">
                        {errors.password?.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-[6px]">
                    <label htmlFor="confirmPassword">
                      Confirm Password
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex rounded-lg border-1 border-gray-300">
                      <input
                        className="m-[10px_14px] w-full border-none outline-none"
                        type={isConfirmVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        id="confirmPassword"
                        {...register("confirmPassword", {
                          required: "Confirm Password is required",
                          validate: (val: string) => {
                            if (watch("password") != val) {
                              return "Your passwords do no match";
                            }
                          },
                        })}
                      />
                      <button
                        className="focus:outline-none px-4"
                        type="button"
                        onClick={toggleConfirmVisibility}
                        aria-label="toggle password visibility"
                      >
                        {isConfirmVisible ? (
                          <FiEyeOff className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <IoEyeOutline className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <span className="text-gray-500">
                        {errors.confirmPassword?.message}
                      </span>
                    )}
                  </div> */}

                  <FormControl isInvalid={!!errors.password?.message}>
                    <FormLabel htmlFor="password">
                      Password
                      <Text as="span" color="red.500">
                        *
                      </Text>
                    </FormLabel>
                    <InputGroup>
                      <Input
                        id="password"
                        type={isVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        isDisabled={isLoading}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Must be at least 8 characters.",
                          },
                        })}
                      />
                      <InputRightElement>
                        <IconButton
                          variant={"ghost"}
                          h="1.75rem"
                          size="sm"
                          onClick={toggleVisibility}
                          bgColor={"transparent"}
                          _hover={{
                            bg: "transparent",
                          }}
                          isDisabled={isLoading}
                          icon={
                            isVisible ? (
                              <FiEyeOff
                                size={16}
                                className="text-default-400 pointer-events-none text-gray"
                              />
                            ) : (
                              <IoEyeOutline
                                size={16}
                                className="text-default-400 pointer-events-none text-gray"
                              />
                            )
                          }
                          aria-label={""}
                        ></IconButton>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.password?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={!!errors.passwordConfirmation?.message}
                  >
                    <FormLabel htmlFor="passwordConfirmation">
                      Confirm Password
                      <Text as="span" color="red.500">
                        *
                      </Text>
                    </FormLabel>
                    <InputGroup>
                      <Input
                        id="passwordConfirmation"
                        type={isConfirmVisible ? "text" : "password"}
                        isDisabled={isLoading}
                        placeholder="Enter your password"
                        {...register("passwordConfirmation", {
                          required: "Confirm Password is required",
                          validate: (val) =>
                            watch("password") !== val
                              ? "Your passwords do not match"
                              : undefined,
                        })}
                      />
                      <InputRightElement>
                        <IconButton
                          isDisabled={isLoading}
                          variant={"ghost"}
                          h="1.75rem"
                          size="sm"
                          onClick={toggleConfirmVisibility}
                          bgColor={"transparent"}
                          _hover={{
                            bg: "transparent",
                          }}
                          icon={
                            isConfirmVisible ? (
                              <FiEyeOff
                                size={16}
                                className="text-default-400 pointer-events-none text-gray"
                              />
                            ) : (
                              <IoEyeOutline
                                size={16}
                                className="text-default-400 pointer-events-none text-gray"
                              />
                            )
                          }
                          aria-label={""}
                        ></IconButton>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.passwordConfirmation?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <Button
                    size="lg"
                    w="full"
                    type="submit"
                    loadingText="Submitting..."
                    isDisabled={isLoading}
                    isLoading={isLoading}
                  >
                    Reset Password
                  </Button>
                </div>
              </form>
            </>
          )}
        </article>
      </section>
    </AuthWrapper>
  );
};

export default ResetPassword;
