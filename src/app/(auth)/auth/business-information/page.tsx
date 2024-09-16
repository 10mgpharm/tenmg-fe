"use client";

import { NextAuthUserSession } from "@/types";
import { Button, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Input, Text, Image as ChakraImage } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa6";

interface IFormInput {
  name: string;
  email: string;
  phone: string;
  contactName: string;
  contactPosition: string;
}

const BusinessInformationComponent = () => {
  const router = useRouter();

  const session = useSession();
  const data = session.data as NextAuthUserSession;

  const searchParams = useSearchParams();
  if (!searchParams?.get('token')) redirect('/auth/signup')

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  const [name, setName] = useState<string>(null);

  useEffect(() => {
    if (data?.user) {
      setName(data?.user?.name)
    }
  }, [data?.user])

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
            {name && <Text fontSize="lg" color="gray.500">
              Hi <b>{name}</b>, Kindly provide us your business information.
            </Text>}
            {!name && <Text fontSize="lg" color="gray.500">
            Kindly provide us your business information.
            </Text>}
          </Flex>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap={5} mb={10}>
              {/* Business Name */}
              <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="name">Business name <Text as="span" color="red.500">*</Text></FormLabel>
                <Input
                  id="name"
                  placeholder="Enter your business name"
                  {...register("name", {
                    required: "Business Name is required",
                  })}
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              {/* Business Email */}
              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">Business email <Text as="span" color="red.500">*</Text></FormLabel>
                <Input
                  id="email"
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
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              {/* Business Phone Number */}
              <FormControl isInvalid={!!errors.phone}>
                <FormLabel htmlFor="phone">Business phone number <Text as="span" color="red.500">*</Text></FormLabel>
                <Input
                  id="phone"
                  placeholder="Enter your business phone number"
                  {...register("phone", {
                    required: "Business phone number is required",
                  })}
                />
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>

              {/* Contact Name */}
              <FormControl isInvalid={!!errors.contactName}>
                <FormLabel htmlFor="contactName">
                  Contact person&apos;s name <Text as="span" color="red.500">*</Text>
                </FormLabel>
                <Input
                  id="contactName"
                  placeholder="Enter your contact person's name"
                  {...register("contactName", {
                    required: "Contact person's name is required",
                  })}
                />
                <FormErrorMessage>{errors.contactName?.message}</FormErrorMessage>
              </FormControl>

              {/* Contact Position */}
              <FormControl isInvalid={!!errors.contactPosition}>
                <FormLabel htmlFor="contactPosition">
                  Position of contact person <Text as="span" color="red.500">*</Text>
                </FormLabel>
                <Input
                  id="contactPosition"
                  placeholder="Managing Director"
                  {...register("contactPosition", {
                    required: "Position of contact person is required",
                  })}
                />
                <FormErrorMessage>{errors.contactPosition?.message}</FormErrorMessage>
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
              variant={'link'}
              onClick={async () => {
                await signOut();
                router.back()
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
