"use client";

import { useState } from "react";
import { Button, Link } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FiEyeOff } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import AuthWrapper from "../components/auth-wrapper";
interface IFormInput {
  email: string;
  password: string;
}

const SignIn = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <AuthWrapper type="others">
      <section className="md:w-1/2 px-6 md:px-12 lg:px-32 flex items-center">
        <article className="w-full">
          <Image
            src="/assets/images/tenmg_logo.png"
            className="md:mb-8"
            alt="tenmg"
            width={75}
            height={75}
          />

          <div className="mb-8">
            <h3 className="font-normal text-gray-900 text-4xl leading-[44px] tracking-tight mb-3">
              Welcome back
            </h3>

            <p className="text-gray-500 text-base font-normal leading-6 text-left">
              Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5 text-gray">
              <div className="flex flex-col gap-[6px]">
                <label>
                  Business email or Phone number
                  <span className="text-red-500">*</span>
                </label>
                <input
                  className="p-[10px_14px] w-full gap-2 rounded-lg border-1 border-gray-300"
                  type="text"
                  placeholder="Enter your business email or phone number"
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
              <div className="flex flex-col gap-[6px]">
                <label>
                  Password
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-lg border-1 border-gray-300">
                  <input
                    className="m-[10px_14px] w-full border-none outline-none"
                    type={isVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: true,
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
                  <span className="text-gray-500">Password is required</span>
                )}
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <input type="checkbox" id="remember" className="w-4 h-4" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link href="#">Forgot password?</Link>
              </div>
            </div>
            <div className="my-6 flex flex-col gap-4">
              <Button
                color="primary"
                size="lg"
                className="w-full cursor-pointer hover:bg-[#7B61FF]"
                type="submit"
              >
                Sign in
              </Button>
              <Button
                size="lg"
                variant="bordered"
                className="w-full cursor-pointer text-gray"
                startContent={<FcGoogle className="text-2xl" />}
              >
                Sign in with Google
              </Button>
            </div>
          </form>
          <div className="text-center">
            <p className="text-gray-500 text-base font-normal leading-6 flex justify-center gap-1">
              Don&apos;t have an account?
              <Link href="/signup" className="text-primary-500">
                Sign up
              </Link>
            </p>
          </div>
        </article>
      </section>
    </AuthWrapper>
  );
};

export default SignIn;
