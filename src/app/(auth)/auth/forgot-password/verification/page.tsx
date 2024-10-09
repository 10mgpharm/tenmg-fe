'use client';

import AuthWrapper from '@/app/(auth)/components/AuthWrapper';
import ForgotPasswordEmailVerify from '@/app/(auth)/components/ForgotPasswordEmailVerify';
import requestClient from '@/lib/requestClient';
import { EmailVerified, ResponseDto } from '@/types';
import { handleServerErrorMessage } from '@/utils';
import { Button } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaArrowLeft } from 'react-icons/fa6';
import OTPInput from 'react-otp-input';
import { toast } from 'react-toastify';

interface IFormInput {
    verification: string;
}

const ForgetPasswordEmailVerification = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token && !email) redirect('/auth/forgot-password');

    const router = useRouter();

    const [otp, setOtp] = useState<string>("");
    const { handleSubmit } = useForm<IFormInput>();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingResend, setIsLoadingResend] = useState(false);

    const onSubmit: SubmitHandler<IFormInput> = async () => {
        try {
            setIsLoading(true);

            if (email) {
                const response = await requestClient({ token: token }).post(
                    "/auth/verify-email",
                    {
                        email,
                        otp: otp,
                        type: "RESET_PASSWORD_VERIFICATION",
                    }
                );

                setIsLoading(false);

                if (response.status === 200) {
                    toast.success(response?.data?.message);
                    router.push(`/auth/reset-password?token=${token}`);
                }
            } else {
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

        if (email) {
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
                            Check your email
                        </h3>

                        <p className="text-gray-500 text-base font-normal leading-6 text-left">
                            We sent a verification code to {email}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="text-gray">
                            <OTPInput
                                value={otp}
                                onChange={setOtp}
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
                                    Verify email
                                </Button>
                            </div>
                        </div>
                    </form>
                    <div className="text-center">
                        <p className="text-gray-500 text-base font-normal leading-6 mb-8">
                            Didn&apos;t receive the email?
                            <Button
                                variant={"link"}
                                pl={2}
                                onClick={resendOtp}
                                isDisabled={isLoadingResend}
                            >
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
                            <FaArrowLeft /> Return to Login
                        </Button>
                    </div>
                </article>
            </section>
        </AuthWrapper>
    );
};

const Verification = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <ForgetPasswordEmailVerification />
    </Suspense>
);

export default Verification;