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
  Link,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa6";
import { handleServerErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import CustomRadio from "./CustomRadio";
import { cn } from "@/lib/utils";

interface IFormInput {
  businessName: string;
  businessEmail: string;
  businessType?: string;
  contactPhone: string;
  contactPersonName: string;
  contactPersonPosition: string;
  termsAndConditions: boolean;
}

export default function BusinessInformationForm({
  sessionData,
}: {
  sessionData: NextAuthUserSession;
}) {
  const session = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(null);
  const [provider, setProvider] = useState<string>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  if (!searchParams?.get("token")) router.replace("/auth/signin");
  const token = searchParams.get("token");

  const action = searchParams.get("action") || "signup";

  const from = searchParams.get("from") || `/auth/${action}`;

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
          `You have successfully completed sign up process. Redirect to Dashboard....`
        );

        await session.update({
          ...sessionData,
          user: {
            ...sessionData.user,
            completeProfile: true,
            businessName: data.businessName,
            entityType: data.businessType.toUpperCase(),
          },
        });
        router.replace("/");
      } else {
        toast.error(`Sign up failed: ${response.data.message}`);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(`Sign up failed: ${errorMessage}`);
    }
  };

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
              Business Information
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
                  Business Name{" "}
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
                  className={cn(
                    isLoading ||
                      (provider === "credentials" && "!bg-gray-300 !text-black")
                  )}
                />
                <FormErrorMessage>
                  {errors.businessName?.message}
                </FormErrorMessage>
              </FormControl>
              {/* Business Type */}
              {provider !== "credentials" && (
                <FormControl isInvalid={!!errors.businessType}>
                  <FormLabel htmlFor="businessType">
                    Business Type{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </FormLabel>
                  <Controller
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Business Type is required",
                      },
                    }}
                    name={`businessType`}
                    render={() => (
                      <CustomRadio
                        name="businessType"
                        options={["Supplier", "Pharmacy", "Lender"]}
                        defaultValue={getValues("businessType")}
                        onChangeCallback={(selectedValue: string) => {
                          let value:
                            | "supplier"
                            | "customer_pharmacy"
                            | "lender";
                          if (selectedValue === "Supplier") value = "supplier";
                          else if (selectedValue === "Pharmacy")
                            value = "customer_pharmacy";
                          else value = "lender";
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
                  Business Email{" "}
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
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                  className={cn(
                    isLoading ||
                      (provider === "credentials" && "!bg-gray-300 !text-black")
                  )}
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
                  required: "Business Phone Number is required",
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
                    required: "Contact Person's Name is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.contactPersonName?.message}
                </FormErrorMessage>
              </FormControl>
              {/* Contact Position */}
              <FormControl isInvalid={!!errors.contactPersonPosition}>
                <FormLabel htmlFor="contactPersonPosition">
                  Position of Contact Person{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Input
                  id="contactPersonPosition"
                  placeholder="Managing Director"
                  isDisabled={isLoading}
                  {...register("contactPersonPosition", {
                    required: "Position of Contact Person is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.contactPersonPosition?.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>

            {/* Terms & Conditions */}

            <FormControl isInvalid={!!errors.termsAndConditions}>
              <Flex mb={10} alignItems="center" gap={2}>
                <Checkbox
                  id="remember"
                  {...register("termsAndConditions", {
                    required: "Terms and Conditions is required",
                  })}
                />
                <Text color="gray.500" fontSize="md">
                  I confirm that I have read and agree to 10 MG&apos;s
                  <Link href="#" color={"blue.500"}>
                    {" "}
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="#" color={"blue.500"}>
                    Privacy Policy
                  </Link>
                </Text>
              </Flex>
              <FormErrorMessage>
                {errors.termsAndConditions?.message}
              </FormErrorMessage>
            </FormControl>

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
              onClick={handleNavigation}
              className="text-gray-500 text-medium font-normal leading-6 flex justify-center items-center gap-2"
            >
              <FaArrowLeft /> Return to
              {action === "signup" ? " Sign Up" : " Sign In"}
            </Button>
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
}
