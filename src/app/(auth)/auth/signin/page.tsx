import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import LoginForm from "@/app/(auth)/_components/LoginForm";
import Link from "next/link";
import AuthWrapper from "@/app/(auth)/_components/AuthWrapper";
import { Heading, Text } from "@chakra-ui/react";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect(`/`);
  }
  return (
    <AuthWrapper type="others">
      <section className="md:w-1/2 px-4 md:px-12 lg:px-32 flex items-center min-h-screen">
        <article className="w-full">
          <Link href="/home">
            <Image
              src="/icons/logo.svg"
              className="md:mb-8"
              alt="tenmg"
              width={75}
              height={75}
              style={{ cursor: "pointer" }}
            />
          </Link>

          <div className="mb-8">
            <Heading
              as="h3"
              size="xl"
              fontWeight="medium"
              mb={3}
              color="gray.900"
            >
              Welcome Back
            </Heading>
            <p className="text-gray-500 text-[17px] mt-2">
              Please enter your details to continue, or{" "}
              <Link
                href="/auth/signup"
                className="text-blue-500  hover:underline"
              >
                sign up
              </Link>
              .
            </p>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>
        </article>
      </section>
    </AuthWrapper>
  );
}
