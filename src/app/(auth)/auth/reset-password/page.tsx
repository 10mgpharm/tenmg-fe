"use client";

import { useState } from "react";
import Image from "next/image";
import React from "react";
import AuthWrapper from "@/app/(auth)/components/AuthWrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import { FiEyeOff } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { Button } from "@chakra-ui/react";
import Link from "next/link";

interface IFormInput {
  password: string;
  confirmPassword: string;
}

const ForgotPassword = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
  const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false); // change to true after the password reset is successful

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <AuthWrapper type="reset-password">
      <section className="md:w-1/2 px-6 md:px-12 lg:px-32 flex items-center">
        <article className="w-full">
          <Image
            src="/assets/images/tenmg_logo.png"
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
                  <div className="flex flex-col gap-[6px]">
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
                  </div>
                </div>
                <div>
                  <Button
                    color="primary.500"
                    size="lg"
                    className="w-full cursor-pointer hover:bg-[#7B61FF]"
                    type="submit"
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

export default ForgotPassword;
