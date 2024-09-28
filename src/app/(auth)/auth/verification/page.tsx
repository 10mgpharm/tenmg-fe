"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import React from "react";
import AuthWrapper from "@/app/(auth)/components/AuthWrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import OtpInput from "react-otp-input";
import { FaArrowLeft } from "react-icons/fa6";
import { Button } from "@chakra-ui/react";
import { redirect, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { EmailVerified, NextAuthUserSession, ResponseDto } from "@/types";
import requestClient from "@/lib/requestClient";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

interface IFormInput {
  verification: string;
}

const VerificationComponent = () => {
  const router = useRouter();

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const searchParams = useSearchParams();
  if (!searchParams?.get("token")) redirect("/auth/signup");

  const [otp, setOtp] = useState<string>("");
  const { handleSubmit } = useForm<IFormInput>();

  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResend, setIsLoadingResend] = useState(false);

  const [email, setEmail] = useState<string>(null);

  const onSubmit: SubmitHandler<IFormInput> = async () => {
    try {
      setIsLoading(true);

      const response = await requestClient({ token: token }).post(
        "/auth/verify-email",
        {
          email,
          otp: otp,
        }
      );

      const { data }: ResponseDto<EmailVerified> = response.data;

      setIsLoading(false);

      if (response.status === 200) {
        toast.success(response?.data?.message);

        await session.update({
          user: {
            ...sessionData,
            completeProfile: false,
            emailVerifiedAt: data?.emailVerifiedAt,
          }
        });

        router.push(`/auth/business-information?token=${token}`);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const resendOtp = async () => {
    setIsLoadingResend(true);

    const response = await requestClient({ token: token }).post("/resend-otp", {
      type: "SIGNUP_EMAIL_VERIFICATION",
    });

    setIsLoadingResend(false);

    if (response.status === 200) {
      toast.success(response?.data?.message);
    }
  };

  useEffect(() => {
    if (sessionData?.user) {
      setEmail(sessionData?.user?.email);
    }
  }, [sessionData])
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
              We sent a verification link to{" "}
              {email}
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
                containerStyle={{
                  gap: "12px",
                  justifyContent: "center",
                }}
                inputStyle={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  fontSize: "24px",
                  textTransform: "uppercase",
                }}
              />

              <div className="my-8 flex flex-col gap-4">
                <Button
                  variant={"solid"}
                  size="lg"
                  type="submit"
                  isDisabled={isLoading || isLoadingResend}
                  isLoading={isLoading || isLoadingResend}
                  loadingText='Verifying...'
                >
                  Verify email
                </Button>
              </div>
            </div>
          </form>
          <div className="text-center">
            <p className="text-gray-500 text-base font-normal leading-6 mb-8">
              Didn&apos;t receive the email?
              <Button variant={"link"} pl={2} onClick={resendOtp} isDisabled={isLoadingResend}>
                Click to resend
              </Button>
            </p>

            <Button
              variant={"link"}
              onClick={async () => {
                await signOut();
                redirect("/auth/signup");
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
