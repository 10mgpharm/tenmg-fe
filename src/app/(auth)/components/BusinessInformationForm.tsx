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
import { signOut } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa6";
import { handleServerErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import CustomRadio from "./CustomRadio";

interface IFormInput {
  businessName: string;
  businessEmail: string;
  businessType?: string;
  contactPhone: string;
  contactPersonName: string;
  contactPersonPosition: string;
}

export default function BusinessInformationForm({ sessionData }: { sessionData: NextAuthUserSession }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>(null);
    const [provider, setProvider] = useState<string>(null);

  const searchParams = useSearchParams();

  if (!searchParams?.get("token")) redirect("/auth/signup");
  const token = searchParams.get("token");

  const {
    control,
    register,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
  } = useForm<IFormInput>({
    defaultValues: {
      businessType: null,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (sessionData?.user) {
      setName(sessionData?.user?.name);
      setProvider(sessionData?.user?.account?.provider);
      // set this from session if exist
      setValue("businessName", sessionData?.user?.businessName);
      setValue("businessEmail", sessionData?.user?.email);
      if (sessionData?.user?.account?.provider === "google") {
        setValue("businessType", "supplier");
      }
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

      setIsLoading(false);

      if (response.status === 200) {
        toast.success(
          `You have successfully compeleted Sign up process. Redirect to Login....`
        );

        setTimeout(async () => {
          // signout so user can login with the newly created account
          await signOut();
        }, 5000);
      } else {
        toast.error(`Sign up failed: ${response.data.message}`);
      }
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
            src="/icons/logo.svg"
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
                Hi <b>{name}</b>, Kindly complete your business information to
                proceed.
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
                  isDisabled={isLoading || provider === "credentials"}
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
                <FormControl isInvalid={!!errors.businessType}>
                  <FormLabel htmlFor="businessType">
                    Business type{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </FormLabel>
                  <Controller
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Business type is required",
                      },
                    }}
                    name={`businessType`}
                    render={() => (
                      <CustomRadio
                        name="businessType"
                        options={["Supplier", "Pharmacy"]}
                        defaultValue={getValues("businessType")}
                        onChangeCallback={(selectedValue: string) => {
                          const value: "supplier" | "customer_pharmacy" =
                            selectedValue == "Supplier"
                              ? "supplier"
                              : "customer_pharmacy";
                          setValue("businessType", value);
                        }}
                      />
                    )}
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
                  isDisabled={isLoading || provider === "credentials"}
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
              <Controller
                name="contactPhone"
                control={control}
                rules={{
                  required: "Business phone number is required",
                }}
                render={({ field }) => (
                  <FormControl isInvalid={!!errors.contactPhone}>
                    <FormLabel htmlFor="contactPhone">
                      Business Phone Number{" "}
                      <Text as="span" color="red.500">
                        *
                      </Text>
                    </FormLabel>
                    <Input
                      {...field}
                      id="contactPhone"
                      placeholder="Enter your business phone number"
                      onChange={(e) => {
                        const value = e.target.value;
                        const sanitizedValue = value.replace(
                          /[^0-9!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?]/g,
                          ""
                        );
                        field.onChange(sanitizedValue);
                      }}
                    />
                    <FormErrorMessage>
                      {errors.contactPhone?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              />
              ;{/* Contact Name */}
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
                isLoading={isLoading}
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
                redirect("/auth/signup");
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
}
