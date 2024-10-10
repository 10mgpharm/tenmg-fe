"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import React from "react";
import AuthWrapper from "@/app/(auth)/components/AuthWrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import requestClient from "@/lib/requestClient";
import { useRouter } from "next/navigation";
import { handleServerErrorMessage } from "@/utils";
import Cookies from "js-cookie";
import { ResponseDto, User } from "@/types";

interface IFormInput {
  email: string;
}

const ForgotPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setIsLoading(true);

      const response = await requestClient().post("/auth/forgot-password", {
        email: data.email,
      });
      const { data: user, accessToken }: ResponseDto<User> = response.data;

      setIsLoading(false);

      if (response.status === 200) {
        toast.success(response?.data?.message);
        router.push(`/auth/forgot-password/verification?token=${accessToken?.token}&email=${user.email}`);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.success(errorMessage);
    }
  };

  return (
    <AuthWrapper type="others">
      <section className="md:w-1/2 px-6 md:px-12 lg:px-32 flex items-center min-h-screen">
        <article className="w-full">
          <Image
            src="/icons/logo.svg"
            className="md:mb-8"
            alt="tenmg"
            width={75}
            height={75}
          />

          <div className="mb-8">
            <h3 className="font-normal text-gray-900 text-4xl leading-[44px] tracking-tight mb-3">
              Forgot Password?
            </h3>

            <p className="text-gray-500 text-base font-normal leading-6 text-left">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5 text-gray mb-">
              <FormControl isInvalid={!!errors.email?.message} mb={5}>
                <FormLabel htmlFor="email">
                  Business Email{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your business email"
                  isDisabled={isLoading}
                  {...register("email", {
                    required: "Business Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <Button
                size="lg"
                w="full"
                type="submit"
                isDisabled={isLoading}
                isLoading={isLoading}
              >
                Reset Password
              </Button>
              <div className="text-center">
                <Link
                  href="/auth/signin"
                  className="text-medium font-normal leading-6 flex justify-center items-center gap-2 text-primary hover:underline"
                >
                  <FaArrowLeft /> Return to Log In
                </Link>
              </div>
              {/*               
              <div className="flex flex-col gap-[6px]">
                <label>
                  Business email
                  <span className="text-red-500">*</span>
                </label>
                <input
                  className="p-[10px_14px] w-full gap-2 rounded-lg border-1 border-gray-300"
                  type="text"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-gray-500">{errors.email?.message}</span>
                )}
              </div>
              <div className="my-6">
                <Button
                  color="primary.500"
                  size="lg"
                  className="w-full cursor-pointer hover:bg-[#7B61FF]"
                  type="submit"
                >
                  Reset Password
                </Button>
              </div> */}
            </div>
          </form>
        </article>
      </section>
    </AuthWrapper>
  );
};

export default ForgotPassword;
