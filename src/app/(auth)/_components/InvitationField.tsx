"use client";

import Image from "next/image";
import { Suspense, useEffect, useState, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { signIn, SignInResponse } from "next-auth/react";

import {
  Heading,
  Text,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Checkbox,
  Link,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { FiEyeOff } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";

interface IFormInput {
  password: string;
  passwordConfirmation: string;
  termsAndConditions: boolean;
}

export default function InvitationField() {
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [error, setError] = useState("");

  // Password visibility states
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  // Data from fetched invite
  const [inviteData, setInviteData] = useState<{
    fullName?: string;
    email?: string;
    acceptUrl?: string;
  } | null>(null);

  const searchParams = useSearchParams();
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  // Replace &amp; with & in the URL for proper parsing
  const decodedUrl = currentUrl.replace(/&amp;/g, "&");
  const urlObj = decodedUrl ? new URL(decodedUrl) : null;

  const inviteId = urlObj?.searchParams.get("inviteId");
  const token = urlObj?.searchParams.get("inviteToken");
  const expires = urlObj?.searchParams.get("expires");
  const signature = urlObj?.searchParams.get("signature");

  let inviteQuery = "/auth/invite/view?";
  if (inviteId) inviteQuery += `inviteId=${inviteId}`;
  if (token) inviteQuery += `&inviteToken=${token}`;
  if (expires) inviteQuery += `&expires=${expires}`;
  if (signature) inviteQuery += `&signature=${signature}`;

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IFormInput>({ mode: "onChange" });

  const toggleVisibility = () => setIsVisible((prev) => !prev);
  const toggleConfirmVisibility = () => setIsConfirmVisible((prev) => !prev);

  const onSubmit: SubmitHandler<IFormInput> = useCallback(
    async (data) => {
      if (!inviteData?.acceptUrl) return;
      setIsLoading(true);

      try {
        const response = await requestClient().post(inviteData.acceptUrl, data);

        setIsLoading(false);
        if (response.status === 201) {
          toast.success(response?.data?.message);
          const callbackUrl =
            searchParams.get("callbackUrl") || `${window.location.origin}/`;

          const loginResponse: SignInResponse = await signIn("credentials", {
            email: inviteData.email,
            password: data.password,
            callbackUrl,
            redirect: false,
          });

          if (!loginResponse.error && loginResponse.ok && loginResponse.url) {
            window.location.href = loginResponse.url;
          } else {
            toast.error(loginResponse.error);
          }
        }
      } catch (error: any) {
        setIsLoading(false);
        toast.error(handleServerErrorMessage(error));
      }
    },
    [inviteData, searchParams]
  );

  const fetchInvite = useCallback(async () => {
    setIsViewLoading(true);
    try {
      const response = await requestClient().get(inviteQuery);
      if (response.status === 200) {
        setInviteData(response.data?.data ?? null);
      }
    } catch (error: any) {
      const errorMessage = handleServerErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsViewLoading(false);
    }
  }, [inviteQuery]);

  useEffect(() => {
    // Fetch invite details on component mount
    if (inviteId && token && expires && signature) {
      fetchInvite();
    } else {
      setError("Invalid or missing query parameters.");
    }
  }, [inviteId, token, expires, signature, fetchInvite]);

  const firstName = inviteData?.fullName?.split(" ")[0] ?? "Guest";

  const hasError = !!error;
  const isLoadingContent = isViewLoading || !inviteData;

  return (
    <section className="md:w-1/2 px-4 md:px-12 lg:px-32 flex items-center min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <article className="w-full">
          {hasError ? (
            <Heading
              as="h3"
              size="xl"
              fontWeight="medium"
              mb={3}
              color="error.500"
            >
              {error}
            </Heading>
          ) : isLoadingContent ? (
            <Heading
              as="h3"
              size="xl"
              fontWeight="medium"
              mb={3}
              color="gray.900"
            >
              <Flex justify="center" align="center" height="200px">
                <Spinner size="xl" />
              </Flex>
            </Heading>
          ) : (
            <>
              <Image
                src="/icons/logo.svg"
                className="md:mb-8"
                alt="tenmg"
                width={75}
                height={75}
              />
              <div className="mb-8">
                <Heading
                  as="h3"
                  size="xl"
                  fontWeight="medium"
                  mb={3}
                  color="gray.900"
                >
                  Welcome {firstName}
                </Heading>
                <Text fontSize="lg" color="gray.500">
                  Create a new password to finish your account setup.
                </Text>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5 text-gray mb-10">
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel htmlFor="password">
                      Password
                      <Text as="span" color="red.500">
                        *
                      </Text>
                    </FormLabel>
                    <InputGroup>
                      <Input
                        id="password"
                        type={isVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        isDisabled={isLoading}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Must be at least 8 characters.",
                          },
                        })}
                      />
                      <InputRightElement>
                        <IconButton
                          variant="ghost"
                          h="1.75rem"
                          size="sm"
                          onClick={toggleVisibility}
                          bgColor="transparent"
                          _hover={{ bg: "transparent" }}
                          isDisabled={isLoading}
                          icon={
                            isVisible ? (
                              <FiEyeOff size={16} className="text-gray" />
                            ) : (
                              <IoEyeOutline size={16} className="text-gray" />
                            )
                          }
                          aria-label="Toggle Password Visibility"
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.password?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.passwordConfirmation}>
                    <FormLabel htmlFor="passwordConfirmation">
                      Confirm Password
                      <Text as="span" color="red.500">
                        *
                      </Text>
                    </FormLabel>
                    <InputGroup>
                      <Input
                        id="passwordConfirmation"
                        type={isConfirmVisible ? "text" : "password"}
                        isDisabled={isLoading}
                        placeholder="Confirm your password"
                        {...register("passwordConfirmation", {
                          required: "Confirm Password is required",
                          validate: (val) =>
                            watch("password") !== val
                              ? "Your passwords do not match"
                              : undefined,
                        })}
                      />
                      <InputRightElement>
                        <IconButton
                          isDisabled={isLoading}
                          variant="ghost"
                          h="1.75rem"
                          size="sm"
                          onClick={toggleConfirmVisibility}
                          bgColor="transparent"
                          _hover={{ bg: "transparent" }}
                          icon={
                            isConfirmVisible ? (
                              <FiEyeOff size={16} className="text-gray" />
                            ) : (
                              <IoEyeOutline size={16} className="text-gray" />
                            )
                          }
                          aria-label="Toggle Confirm Password Visibility"
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.passwordConfirmation?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.termsAndConditions}>
                    <div className="flex gap-2 items-center">
                      <Checkbox
                        id="remember"
                        {...register("termsAndConditions", {
                          required:
                            "You must agree to the Terms and Conditions",
                        })}
                      />
                      <Text color="gray.500" fontSize="md">
                        I confirm that I have read and agree to 10 MG&apos;s{" "}
                        <Link href="#" color="primary.500">
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link href="#" color="primary.500">
                          Privacy Policy
                        </Link>
                      </Text>
                    </div>
                    <FormErrorMessage>
                      {errors.termsAndConditions?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <Button
                    size="lg"
                    w="full"
                    type="submit"
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    loadingText="Submitting..."
                  >
                    Login
                  </Button>
                </div>
              </form>
            </>
          )}
        </article>
      </Suspense>
    </section>
  );
}
