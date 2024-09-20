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
import { AxiosError } from "axios";

interface IFormInput {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessType?: string;
  contactPersonName: string;
  contactPersonDesignation: string;
}

const BusinessInformationComponent = () => {
  const router = useRouter();

  const session = useSession();
  console.log("🚀 ~ BusinessInformationComponent ~ session:", session);
  const data = session.data as NextAuthUserSession;

  const searchParams = useSearchParams();
  if (!searchParams?.get("token")) redirect("/auth/signup");

  const token = searchParams.get("token");

  const provider = data?.user?.account?.type;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await requestClient({ token: token }).post(
        "/auth/signup/complete",
        {
          name: data?.businessName,
          contactPhone: data?.businessPhone,
          contactPerson: data?.contactPersonName,
          contactPersonPosition: data?.contactPersonDesignation,
          termsAndConditions: true,
          provider: provider,
        }
      );

      if (response.statusText === "success") {
        router.push(`/`);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          setErrorMessage(
            `Sign up failed: ${
              error.response.data.message || "Please try again later."
            }`
          );
          console.error("Error response:", error.response.data);
        } else if (error.request) {
          setErrorMessage(
            "Network error. Please check your connection and try again."
          );
          console.error("Network error:", error.request);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
          console.error("Error:", error.message);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
        console.error("Non-Axios error:", error);
      }
    }
  };

  const [name, setName] = useState<string>(null);
  const [errorMessage, setErrorMessage] = useState<string>(
    searchParams?.get("error") ?? null
  );

  console.log(
    "🚀 ~ BusinessInformationComponent ~ errorMessage:",
    errorMessage
  );

  useEffect(() => {
    if (data?.user) {
      setName(data?.user?.name);
    }
  }, [data?.user]);

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
            {name && (
              <Text fontSize="lg" color="gray.500">
                Hi <b>{name}</b>, Kindly provide us your business information.
              </Text>
            )}
            {!name && (
              <Text fontSize="lg" color="gray.500">
                Kindly provide us your business information.
              </Text>
            )}
          </Flex>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap={5} mb={10}>
              {/* Business Name */}
              <FormControl isInvalid={!!errors.businessName}>
                <FormLabel htmlFor="businessName">
                  Business name{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Input
                  id="businessName"
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
                    Business type{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    id="businessType"
                    placeholder="Enter your business type"
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
                  Business email{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Input
                  id="businessEmail"
                  type="email"
                  placeholder="Enter your business email"
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
              <FormControl isInvalid={!!errors.businessPhone}>
                <FormLabel htmlFor="businessPhone">
                  Business phone number{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Input
                  id="businessPhone"
                  placeholder="Enter your business phone number"
                  {...register("businessPhone", {
                    required: "Business phone number is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.businessPhone?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Contact Name */}
              <FormControl isInvalid={!!errors.contactPersonName}>
                <FormLabel htmlFor="contactPersonName">
                  Contact person&apos;s name{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Input
                  id="contactPersonName"
                  placeholder="Enter your contact person's name"
                  {...register("contactPersonName", {
                    required: "Contact person's name is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.contactPersonName?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Contact Position */}
              <FormControl isInvalid={!!errors.contactPersonDesignation}>
                <FormLabel htmlFor="contactPersonDesignation">
                  Position of contact person{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Input
                  id="contactPersonDesignation"
                  placeholder="Managing Director"
                  {...register("contactPersonDesignation", {
                    required: "Position of contact person is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.contactPersonDesignation?.message}
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
              <Button colorScheme="purple" size="lg" type="submit" w="full">
                Proceed to dashboard
              </Button>
            </Flex>
          </form>

          <div className="text-center mb-3">
            <Button
              variant={"link"}
              onClick={async () => {
                await signOut();
                router.back();
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
