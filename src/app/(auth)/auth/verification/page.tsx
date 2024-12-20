"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import React from "react";
import AuthWrapper from "@/app/(auth)/_components/AuthWrapper";
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
import Cookies from "js-cookie";

interface IFormInput {
  verification: string;
}

const VerificationComponent = () => {
  const router = useRouter();

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const searchParams = useSearchParams();
  if (!searchParams?.get("token")) redirect("/auth/signup");

  const sessionEmail = Cookies.get("email");
  const [otp, setOtp] = useState<string>("");
  const { handleSubmit } = useForm<IFormInput>();

  const token = searchParams.get("token");

  const action = searchParams.get("action") || "signin";

  const from = searchParams.get("from") || `/auth/${action}`;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResend, setIsLoadingResend] = useState(false);

  const [email, setEmail] = useState<string>(null);

  const handleNavigation = async () => {
    if (action === "signup") {
      if (sessionData?.user?.entityType === "VENDOR") {
        await signOut({
          callbackUrl: `/auth/signup/vendor?name=${sessionData?.user?.name}&email=${sessionData?.user?.email}&businessName=${sessionData?.user?.businessName}&activeTab=vendor`,
        });
      } else {
        await signOut({
          callbackUrl: `/auth/signup?name=${sessionData?.user?.name}&email=${
            sessionData?.user?.email
          }&businessName=${sessionData?.user?.businessName}&tab=${
            sessionData?.user?.entityType === "SUPPLIER"
              ? "supplier"
              : "pharmacy"
          }&activeTab=${
            sessionData?.user?.entityType === "SUPPLIER"
              ? "supplier"
              : "pharmacy"
          }`,
        });
      }
    } else {
      await signOut({
        callbackUrl: `/auth/signin/`,
      });
      router.back();
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async () => {
    try {
      setIsLoading(true);

      if (sessionData?.user) {
        const response = await requestClient({ token: token }).post(
          "/auth/verify-email",
          {
            email,
            otp: otp,
            type: "SIGNUP_EMAIL_VERIFICATION",
          }
        );

        const { data }: ResponseDto<EmailVerified> = response.data;

        setIsLoading(false);

        if (response.status === 200) {
          toast.success(response?.data?.message);

          await session.update({
            ...sessionData,
            user: {
              ...sessionData.user,
              completeProfile: false,
              emailVerifiedAt: data?.emailVerifiedAt,
            },
          });

          router.push(`/auth/business-information?token=${token}`);
        }
      } else {
        Cookies.set("otp", otp, { expires: 1 });
        router.push(`/auth/reset-password`);
        setIsLoadingResend(false);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const resendOtp = async () => {
    setIsLoadingResend(true);

    if (sessionData?.user) {
      const response = await requestClient({ token: token }).post(
        "/resend-otp",
        {
          type: "SIGNUP_EMAIL_VERIFICATION",
        }
      );

      setIsLoadingResend(false);

      if (response.status === 200) {
        toast.success(response?.data?.message);
      }
    } else {
      const response = await requestClient().post("/auth/resend-otp", {
        email: email,
        type: "RESET_PASSWORD_VERIFICATION",
      });
      if (response.status === 200) {
        toast.success(response?.data?.message);
      }
      setIsLoadingResend(false);
    }
  };

  useEffect(() => {
    if (sessionData?.user) {
      setEmail(sessionData?.user?.email);
    } else {
      setEmail(sessionEmail);
    }
  }, [sessionData, sessionEmail]);
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
              Check your Email
            </h3>

            <p className="text-gray-500 text-base font-normal leading-6 text-left">
              We Sent a Verification Code To {email}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-gray">
              <OtpInput
                value={otp}
                onChange={setOtp}
                placeholder="TF0B6S"
                numInputs={6}
                renderInput={(props) => <input {...props} />}
                containerStyle="justify-center gap-2 lg:gap-4"
                inputStyle="!w-10 h-10 md:!w-12 md:w-12 lg:!w-[60px] lg:h-[60px] rounded-[8px] border border-[#E2E8F0] text-md uppercase"
              />

              <div className="my-8 flex flex-col gap-4">
                <Button
                  variant={"solid"}
                  size="lg"
                  type="submit"
                  isDisabled={isLoading || isLoadingResend}
                  isLoading={isLoading || isLoadingResend}
                  loadingText="Verifying..."
                >
                  Verify Email
                </Button>
              </div>
            </div>
          </form>
          <div className="text-center">
            <p className="text-gray-500 text-base font-normal leading-6 mb-8">
              Didn&apos;t Receive the Email?
              <Button
                variant={"link"}
                pl={2}
                onClick={resendOtp}
                isDisabled={isLoadingResend}
              >
                Click to Resend
              </Button>
            </p>

            <Button
              variant={"link"}
              onClick={handleNavigation}
              className="text-gray-500 text-medium font-normal leading-6 flex justify-center items-center gap-2"
            >
              <FaArrowLeft /> Return to
              {action === "signup" ? " Sign Up" : " Sign In"}
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
