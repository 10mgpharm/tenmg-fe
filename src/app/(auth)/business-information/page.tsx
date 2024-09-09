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
import SignUpField from "../components/signup-field";
interface IFormInput {
  name: string;
  email: string;
  phone: string;
  contactName: string;
  contactPosition: string;
}

const BusinessInformation = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="min-h-screen md:flex w-full justify-center">
      <div className="md:min-h-screen md:w-1/2 bg-[url('/assets/images/business_info_bg.png')] bg-cover bg-center bg-no-repeat"></div>
      <section className="md:w-1/2 flex items-center px-6 md:px-12 lg:px-20 xl:px-32">
        <section className="w-full">
          <Image
            src="/assets/images/tenmg_logo.png"
            className="md:mb-8"
            alt="tenmg"
            width={75}
            height={75}
          />

          <div className="mb-8">
            <h3 className="font-normal text-gray-900 text-4xl leading-[44px] tracking-tight mb-3">
              Business info
            </h3>

            <p className="text-gray-500 text-base font-normal leading-6 text-left">
              Kindly provide us your business information.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5 text-gray mb-10">
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="name">
                  Business name
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  className="p-[10px_14px] w-full gap-2 rounded-lg border-1 border-gray-300"
                  type="text"
                  placeholder="Enter your business name"
                  {...register("name", {
                    required: "Business Name is required",
                  })}
                />
                {errors.name && (
                  <span className="text-gray-500">{errors.name?.message}</span>
                )}
              </div>
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="email">
                  Business email
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  className="p-[10px_14px] w-full gap-2 rounded-lg border-1 border-gray-300"
                  type="email"
                  placeholder="Enter your business email"
                  {...register("email", {
                    required: "Business Email is required",
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
                <label htmlFor="phone">
                  Business phone number
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  className="p-[10px_14px] w-full gap-2 rounded-lg border-1 border-gray-300"
                  type="text"
                  placeholder="Enter your business phone number"
                  {...register("phone", {
                    required: "Business phone number is required",
                  })}
                />
                {errors.phone && (
                  <span className="text-gray-500">{errors.phone?.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-[6px]">
                <label htmlFor="contactName">
                  Contact person&apos;s name
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="contactName"
                  className="p-[10px_14px] w-full gap-2 rounded-lg border-1 border-gray-300"
                  type="text"
                  placeholder="Enter your contact person's name"
                  {...register("contactName", {
                    required: "Contact person's name is required",
                  })}
                />
                {errors.contactName && (
                  <span className="text-gray-500">
                    {errors.contactName?.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-[6px]">
                <label htmlFor="contactPosition">
                  Position of contact person
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="contactPosition"
                  className="p-[10px_14px] w-full gap-2 rounded-lg border-1 border-gray-300"
                  type="text"
                  placeholder="Managing Director"
                  {...register("contactPosition", {
                    required: "Position of contact person is required",
                  })}
                />
                {errors.contactPosition && (
                  <span className="text-gray-500">
                    {errors.contactPosition?.message}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-10 flex justify-between gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4" />
              <p className="text-gray-500 text-base font-normal leading-6 text-left">
                I confirm that I have read and agree to 10 MG Pharmacy&apos;s
                Terms & Conditions and Privacy Policy
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              <Button
                color="primary"
                size="lg"
                className="w-full cursor-pointer hover:bg-[#7B61FF]"
                type="submit"
              >
                Proceed to dashboard
              </Button>
            </div>
          </form>
        </section>
      </section>
    </div>
  );
};

export default BusinessInformation;
