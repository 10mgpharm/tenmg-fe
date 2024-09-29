"use client";

import { useState } from "react";
import Image from "next/image";
import React from "react";
import AuthWrapper from "@/app/(auth)/components/AuthWrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import { Button } from "@chakra-ui/react";

interface IFormInput {
  email: string;
}

const ForgotPassword = () => {
  const [otp, setOtp] = useState<string>("");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <AuthWrapper type="others">
      <section className="md:w-1/2 px-6 md:px-12 lg:px-32 flex items-center">
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
              Forgotten password?
            </h3>

            <p className="text-gray-500 text-base font-normal leading-6 text-left">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5 text-gray mb-">
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
              </div>
            </div>
          </form>
          <div className="text-center">
            <Link
              href="/auth/signin"
              className="text-gray-500 text-medium font-normal leading-6 flex justify-center items-center gap-2"
            >
              <FaArrowLeft /> Return to Log In
            </Link>
          </div>
        </article>
      </section>
    </AuthWrapper>
  );
};

export default ForgotPassword;
