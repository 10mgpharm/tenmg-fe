"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import React from "react";
import AuthWrapper from "@/app/(auth)/components/AuthWrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import OtpInput from "react-otp-input";
import { FaArrowLeft } from "react-icons/fa6";
import { Button } from "@chakra-ui/react";
import { redirect, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import { useRouter } from "next/navigation";

interface IFormInput {
  verification: string;
}

const VerificationComponent = () => {
  const session = useSession();
  console.log("🚀 ~ VerificationComponent ~ session:", session);
  const data = session.data as NextAuthUserSession;

  console.log("VerificationComponent", session);

  const searchParams = useSearchParams();
  const router = useRouter();

  if (!searchParams?.get("token")) redirect("/auth/signup");

  const [otp, setOtp] = useState<string>("");
  const { handleSubmit } = useForm<IFormInput>();

  const token = searchParams.get("token");

  const onSubmit: SubmitHandler<IFormInput> = async () => {
    const response = await requestClient({ token: token }).post(
      "/auth/verify-email",
      {
        email: data?.user?.email || "",
        otp: otp,
      }
    );

    if (response.statusText === "success") {
      router.push(`/auth/business-information?token=${token}`);
    }
  };

  const resendOtp = async () => {
    const response = await requestClient({ token: token }).post("/resend-otp", {
      type: "SIGNUP_EMAIL_VERIFICATION",
    });

    console.log("🚀 ~ response ~ response:", response);
  };

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
              We sent a verification code to{" "}
              {data?.user?.email || "jude@terisapharmacy.com"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-gray">
              {/* TODO: add otp responsiveness*/}
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => <input {...props} />}
                containerStyle="justify-center gap-2 lg:gap-4"
                inputStyle="!w-10 h-10 md:!w-12 md:w-12 lg:!w-[60px] lg:h-[60px] rounded-[8px] border border-[#E2E8F0] text-md uppercase"
              />

              <div className="my-8 flex flex-col gap-4">
                <Button variant={"solid"} size="lg" type="submit">
                  Verify Email
                </Button>
              </div>
            </div>
          </form>
          <div className="text-center">
            <p className="text-gray-500 text-base font-normal leading-6 mb-8">
              Didn&apos;t receive the email?
              <Button variant={"link"} pl={2} onClick={resendOtp}>
                Click to resend
              </Button>
            </p>

            <Button
              variant={"link"}
              onClick={async () => {
                await signOut();
                router.push("/auth/signup");
              }}
              className="text-gray-500 text-medium font-normal leading-6 flex justify-center items-center gap-2"
            >
              <FaArrowLeft /> Return to Sign Up
            </Button>
          </div>
        </article>
      </section>
    </AuthWrapper>
  );
};

const Verification = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <VerificationComponent />
  </Suspense>
);

export default Verification;
