"use client";

import Image from "next/image";
import {  useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { EmailVerified, NextAuthUserSession, ResponseDto } from "@/types";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

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
} from "@chakra-ui/react";
import { FiEyeOff } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";

interface IFormInput {
  password: string;
  passwordConfirmation: string;
  termsAndConditions: boolean;
}

export default function InvitationField() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);

  const searchParams = useSearchParams();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const name = "Judas";

  const params = "";

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setIsLoading(true);

      const response = await requestClient().post("/auth/invite/accept", {
        ...data,
      });

      setIsLoading(false);
      3;
      if (response.status === 200) {
        toast.success(response?.data?.message);
        // Add Login endpoint hwre,
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.success(errorMessage);
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const fetchInvite = async () => {
    try {
      const response = await requestClient().get(`/auth/invite/view?${params}`);

      if (response.status === 200) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.success(errorMessage);
    }
  };

  //   TODO: Add Conditions to display "This invitation link has expired. Please contact the vendor for a new invitation."

  useEffect(() => {
    fetchInvite();
  }, []);

  return (
    <section className="md:w-1/2 px-4 md:px-12 lg:px-32 flex items-center min-h-screen">
      <article className="w-full">
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
            Welcome {name}
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Create new password to finish your account setup.
          </Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5 text-gray mb-10">
            <FormControl isInvalid={!!errors.password?.message}>
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
                    variant={"ghost"}
                    h="1.75rem"
                    size="sm"
                    onClick={toggleVisibility}
                    bgColor={"transparent"}
                    _hover={{
                      bg: "transparent",
                    }}
                    isDisabled={isLoading}
                    icon={
                      isVisible ? (
                        <FiEyeOff
                          size={16}
                          className="text-default-400 pointer-events-none text-gray"
                        />
                      ) : (
                        <IoEyeOutline
                          size={16}
                          className="text-default-400 pointer-events-none text-gray"
                        />
                      )
                    }
                    aria-label={""}
                  ></IconButton>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.passwordConfirmation?.message}>
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
                  placeholder="Enter your password"
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
                    variant={"ghost"}
                    h="1.75rem"
                    size="sm"
                    onClick={toggleConfirmVisibility}
                    bgColor={"transparent"}
                    _hover={{
                      bg: "transparent",
                    }}
                    icon={
                      isConfirmVisible ? (
                        <FiEyeOff
                          size={16}
                          className="text-default-400 pointer-events-none text-gray"
                        />
                      ) : (
                        <IoEyeOutline
                          size={16}
                          className="text-default-400 pointer-events-none text-gray"
                        />
                      )
                    }
                    aria-label={""}
                  ></IconButton>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.passwordConfirmation?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.termsAndConditions?.message}>
              <div className="">
                <div className="flex gap-2 items-center">
                  {/* <input type="checkbox" id="remember" className="w-4 h-4" /> */}
                  <Checkbox
                    id="remember"
                    {...register("termsAndConditions", {
                      required: "Terms and Conditions is required",
                    })}
                  />
                  <Text color="gray.500" fontSize="md">
                    I confirm that I have read and agree to 10 MG&apos;s
                    <Link href="#" color="primary.500">
                      {" "}
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
              </div>
            </FormControl>

            <Button
              size="lg"
              w="full"
              type="submit"
              loadingText="Submitting..."
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              Login
            </Button>
          </div>
        </form>
      </article>
    </section>
  );
}
