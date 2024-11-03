"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Image,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Link,
  IconButton,
} from "@chakra-ui/react";
import { FiEyeOff } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { signIn, SignInResponse } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import requestClient from "@/lib/requestClient";
import { ResponseDto, User } from "@/types";
import { useRouter } from "next/navigation";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

interface SignUpFieldProps {
  title: "supplier" | "pharmacy" | "vendor";
  tabIndex?: number;
}

interface IFormInput {
  fullname: string;
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export default function SignUpField({ title, tabIndex }: SignUpFieldProps) {
  const searchParams = useSearchParams();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    searchParams?.get("error") ?? null
  );
  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const router = useRouter();
  const nameParams = searchParams.get("name");
  const emailParams = searchParams.get("email");
  const businessNameParams = searchParams.get("businessName");
  const tab = searchParams.get("activeTab");

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<IFormInput>({
    defaultValues: {
      fullname: "",
      name: "",
      email: "",
    },
    mode: "onChange",
  });

  const titleTabs =
    tabIndex === 0 ? "supplier" : tabIndex === 1 ? "pharmacy" : 0;

  useEffect(() => {
    if (nameParams && emailParams && businessNameParams) {
      // set this from session if exist
      if (tab === titleTabs) {
        setValue("fullname", nameParams);
        setValue("name", businessNameParams);
        setValue("email", emailParams);
      } else {
        setValue("fullname", "");
        setValue("name", "");
        setValue("email", "");
      }
    }
  }, [nameParams, emailParams, businessNameParams, setValue, tab, titleTabs]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setIsLoading(true);

      const response = await requestClient().post("/auth/signup", {
        ...data,
        termsAndConditions: true,
        businessType: title === "pharmacy" ? "customer_pharmacy" : title,
      });
      const { status, message }: ResponseDto<User> = response.data;

      if (status === "error") {
        setIsLoading(false);
        return setErrorMessage(message);
      }

      // if signup successful, auto login so next-auth can handle proper redirection to otp screen
      const loginResponse: SignInResponse = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl:
          searchParams.get("callbackUrl") || `${window.location.origin}/`,
        redirect: false,
      });

      setIsLoading(false);

      if (!loginResponse.error && loginResponse.ok && loginResponse.url) {
        return (window.location.href = loginResponse.url);
      }
      toast.error(loginResponse.error);
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Box px={{ base: 6, md: 12, lg: 20, xl: 32 }}>
        <Image
          src={"/icons/logo.svg"}
          alt="tenmg"
          mb={{ md: 8 }}
          boxSize="75px"
        />

        <Box mb={8}>
          <Heading
            as="h3"
            size="xl"
            fontWeight="medium"
            mb={3}
            lineHeight="44px"
            color="gray.900"
          >
            Sign Up as a
            {title === "supplier"
              ? " Supplier"
              : title === "pharmacy"
              ? " Pharmacy or Hospital"
              : " Vendor"}
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Create an account for free.
          </Text>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {errorMessage && (
            <ErrorMessage
              error={errorMessage}
              onClose={() => setErrorMessage(null)}
            />
          )}

          <Box mb={10}>
            <FormControl isInvalid={!!errors.fullname?.message} mb={5}>
              <FormLabel htmlFor="fullname">
                Full Name{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                id="fullname"
                placeholder="Enter your name"
                {...register("fullname", { required: "Your name is required" })}
                type="text"
                isDisabled={isLoading}
              />
              <FormErrorMessage>{errors.fullname?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.name?.message} mb={5}>
              <FormLabel htmlFor="name">
                Business Name
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                id="name"
                placeholder="Enter your business name"
                {...register("name", { required: "Business Name is required" })}
                type="text"
                isDisabled={isLoading}
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email?.message} mb={5}>
              <FormLabel htmlFor="email">
                Business Email
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your business email"
                isDisabled={isLoading}
                {...register("email", {
                  required: "Business Email is required",
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password?.message} mb={5}>
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

            <FormControl
              isInvalid={!!errors.passwordConfirmation?.message}
              mb={5}
            >
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
          </Box>

          <Box mb={8}>
            <Button
              size="lg"
              w="full"
              type="submit"
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              Create Account
            </Button>

            {title !== "vendor" && (
              <Button
                leftIcon={<FcGoogle />}
                variant="outline"
                size="lg"
                w="full"
                mt={4}
                onClick={() =>
                  signIn("google", {
                    callbackUrl:
                      searchParams.get("callbackUrl") ||
                      `${window.location.origin}/`,
                  })
                }
              >
                Sign Up with Google
              </Button>
            )}
          </Box>
        </form>

        <Box textAlign="center">
          <Text color="gray.500">
            Already have an account?{" "}
            <Link href="/auth/signin" color="primary.500">
              Log In
            </Link>{" "}
            or{" "}
            <Link
              href={`${
                title !== "vendor" ? "/auth/signup/vendor" : "/auth/signup"
              }`}
              color="primary.500"
            >
              Sign Up as a
              {title !== "vendor" ? " Vendor" : " Supplier or Pharmacy"}
            </Link>
          </Text>
        </Box>
      </Box>
    </>
  );
}
