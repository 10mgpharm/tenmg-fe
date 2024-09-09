"use client";

import { useState } from "react";
import { Button, Link } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import AuthWrapper from "../components/auth-wrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import OTPInput from "react-otp-input";
import { FaArrowLeft } from "react-icons/fa6";

interface IFormInput {
  verification: number;
}

const Verification = () => {
  const [otp, setOtp] = useState<string>("");
  const { handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

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
              Check your email
            </h3>

            <p className="text-gray-500 text-base font-normal leading-6 text-left">
              We sent a verification link to jude@terisapharmacy.com
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-gray">
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                inputType="number"
                renderInput={(props) => <input {...props} />}
                containerStyle={{
                  gap: "12px",
                  justifyContent: "center",
                }}
                inputStyle={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  fontSize: "48px",
                }}
              />

              <div className="my-8 flex flex-col gap-4">
                <Button
                  href="/business-information"
                  color="primary"
                  size="lg"
                  className="w-full cursor-pointer hover:bg-[#7B61FF]"
                  type="submit"
                >
                  Verify email
                </Button>
              </div>
            </div>
          </form>
          <div className="text-center">
            <p className="text-gray-500 text-base font-normal leading-6 mb-8">
              Didn&apos;t receive the email?
              <Link role="button" className="text-primary-500 ml-1">
                Click to resend
              </Link>
            </p>

            <Link
              href="/signup"
              className="text-gray-500 text-medium font-normal leading-6 flex justify-center items-center gap-2"
            >
              <FaArrowLeft /> Return to Sign Up
            </Link>
          </div>
        </article>
      </section>
    </AuthWrapper>
  );
};

export default Verification;
