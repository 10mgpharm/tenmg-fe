"use client";

import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  Image as ChakraImage,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa6";
import { handleServerErrorMessage } from "@/utils";
import { toast } from "react-toastify";

interface IFormInput {
  businessName: string;
  businessEmail: string;
  businessType?: string;
  contactPhone: string;
  contactPersonName: string;
  contactPersonPosition: string;
}

const BusinessInformationComponent = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(null);
  const [provider, setProvider] = useState<string>(null);

  const searchParams = useSearchParams();

  if (!searchParams?.get("token")) redirect("/auth/signup");
  const token = searchParams.get("token");

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<IFormInput>({
    defaultValues: {
      businessType: null,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (sessionData?.user) {
      setName(sessionData?.user?.name);
      setProvider(sessionData?.user?.account?.provider);
      // set this from session if exist
      setValue("businessName", sessionData?.user?.businessName);
      setValue("businessEmail", sessionData?.user?.email);
    }
  }, [sessionData?.user, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setIsLoading(true);

      const response = await requestClient({ token: token }).post(
        "/auth/signup/complete",
        {
          ...data,
          termsAndConditions: true,
          provider: provider,
        }
      );

      if (response.status === 200) {
        await session.update({
          user: {
            ...sessionData,
            completeProfile: true,
            emailVerifiedAt: sessionData?.user?.emailVerifiedAt,
          },
        });

        setIsLoading(false);

        return router.push(`/`);
      }

      setIsLoading(false);
      toast.error(`Sign up failed: ${response.data.message}`);
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(`Sign up failed: ${errorMessage}`);
    }
  };

  return (
    <Flex minH="100vh" w="full" justifyContent="center">
      {/* Left Image Background */}
      <Flex
        flex="1"
        bgImage="url('/assets/images/business_info_bg.png')"
        bgPos="center"
        bgSize="cover"
        bgRepeat="no-repeat"
        display={["none", "none", "block"]}
      />

      {/* Right Form Section */}
      <Flex flex="1" alignItems="center" px={["6", "12", "20", "32"]}>
        <Flex direction="column" w="full">
          <ChakraImage
            src="/assets/images/tenmg_logo.png"
            alt="tenmg"
            mb={[6, 8]}
            boxSize="75px"
          />

          {/* Heading */}
          <Flex direction="column" mb={8}>
            <Text fontWeight="normal" fontSize="4xl" color="gray.900" mb={3}>
              Business info
            </Text>
            {name && provider === "google" && (
              <Text fontSize="lg" color="gray.500">
                Hi <b>{name}</b>, Kindly provide us your business information.
              </Text>
            )}
            {provider !== "google" && (
              <Text fontSize="lg" color="gray.500">
                Kindly complete your business information to proceed.
              </Text>
            )}
          </Flex>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap={5} mb={10}>
              {/* Business Name */}
              <FormControl isInvalid={!!errors.businessName}>
                <FormLabel htmlFor="businessName">
                  Business Name{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Input
                  id="businessName"
                  isDisabled={isLoading}
                  placeholder="Enter your business name"
                  {...register("businessName", {
                    required: "Business Name is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.businessName?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Business Type */}
              {provider !== "credentials" && (
                <FormControl isInvalid={!!errors.businessName}>
                  <FormLabel htmlFor="businessType">
                    Business Type{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    id="businessType"
                    placeholder="Enter your business type"
                    isDisabled={isLoading}
                    {...register("businessType", {
                      required: "Business Type is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.businessType?.message}
                  </FormErrorMessage>
                </FormControl>
              )}

              {/* Business Email */}
              <FormControl isInvalid={!!errors.businessEmail}>
                <FormLabel htmlFor="businessEmail">
                  Business Email{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Input
                  id="businessEmail"
                  type="email"
                  placeholder="Enter your business email"
                  isDisabled={isLoading}
                  {...register("businessEmail", {
                    required: "Business Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.businessEmail?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Business Phone Number */}
              <FormControl isInvalid={!!errors.contactPhone}>
                <FormLabel htmlFor="contactPhone">
                  Business phone number{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Input
                  id="contactPhone"
                  placeholder="Enter your business phone number"
                  isDisabled={isLoading}
                  {...register("contactPhone", {
                    required: "Business phone number is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.contactPhone?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Contact Name */}
              <FormControl isInvalid={!!errors.contactPersonName}>
                <FormLabel htmlFor="contactPersonName">
                  Contact Person&apos;s Name{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Input
                  id="contactPersonName"
                  placeholder="Enter your contact person's name"
                  isDisabled={isLoading}
                  {...register("contactPersonName", {
                    required: "Contact person's name is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.contactPersonName?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Contact Position */}
              <FormControl isInvalid={!!errors.contactPersonPosition}>
                <FormLabel htmlFor="contactPersonPosition">
                  Position of contact person{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Input
                  id="contactPersonPosition"
                  placeholder="Managing Director"
                  isDisabled={isLoading}
                  {...register("contactPersonPosition", {
                    required: "Position of contact person is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.contactPersonPosition?.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>

            {/* Terms & Conditions */}
            <Flex mb={10} alignItems="center" gap={2}>
              <Checkbox id="remember" />
              <Text color="gray.500" fontSize="lg">
                I confirm that I have read and agree to 10 MG Pharmacy&apos;s
                Terms & Conditions and Privacy Policy
              </Text>
            </Flex>

            {/* Submit Button */}
            <Flex direction="column" gap={4} mb={8}>
              <Button
                size="lg"
                type="submit"
                w="full"
                isDisabled={isLoading}
                loadingText="Submitting..."
              >
                Proceed to dashboard
              </Button>
            </Flex>
          </form>

          <div className="text-center mb-3">
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
        </Flex>
      </Flex>
    </Flex>
  );
};

const BusinessInformation = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <BusinessInformationComponent />
  </Suspense>
);

export default BusinessInformation;
