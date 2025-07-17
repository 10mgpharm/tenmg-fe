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
import { ArrowBackIcon } from "@chakra-ui/icons";

interface SignUpFieldProps {
  title: "SUPPLIER" | "LENDER" | "VENDOR" | "PHARMACY";
  setFormStep?: (value: number) => void;
}

interface IFormInput {
  fullname: string;
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export default function SignUpField({ title, setFormStep }: SignUpFieldProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    searchParams?.get("error") ?? null
  );
  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const nameParams = searchParams.get("name");
  const mail = searchParams.get("email");
  const emailParams = mail ? mail.replace(/ /g, "+") : null;
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

  useEffect(() => {
    if (nameParams && emailParams && businessNameParams) {
      // set this from session if exist
      if (tab.toLowerCase() === title.toLowerCase()) {
        setValue("fullname", nameParams);
        setValue("name", businessNameParams);
        setValue("email", emailParams);
      } else {
        setValue("fullname", "");
        setValue("name", "");
        setValue("email", "");
      }
    }
  }, [nameParams, emailParams, businessNameParams, setValue, tab, title]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setIsLoading(true);

      const response = await requestClient().post("/auth/signup", {
        ...data,
        termsAndConditions: true,
        businessType:
          title === "PHARMACY" ? "customer_pharmacy" : title.toLowerCase(),
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

  if (!title) {
    toast.error("No user type");
    router.back();
    return;
  }

  return (
    <>
      <Box>
        <div className="flex items-center justify-between mb-2">
          <Link href="/home">
            <Image src={"/icons/logo.svg"} alt="tenmg" boxSize="50px" />
          </Link>

          <div
            onClick={() => router.back()}
            className="size-[45px] bg-primary-50 rounded-full flex items-center justify-center group hover:w-[60px] transition-all"
          >
            <ArrowBackIcon
              fontSize={"20px"}
              className="group-hover:text-primary  transition-all cursor-pointer"
            />
          </div>
        </div>
        <Box mb={8}>
          <Heading
            as="h3"
            size="lg"
            fontWeight="medium"
            lineHeight="44px"
            color="gray.900"
          >
            Sign Up as a
            {title === "SUPPLIER"
              ? " Supplier"
              : title === "PHARMACY"
              ? " Pharmacy or Hospital"
              : title === "VENDOR"
              ? " Vendor"
              : " Lender"}
          </Heading>
          <Text className="text-18px mt-1" color="gray.500">
            Create an account for free. Already have one?{" "}
            <Link href="/auth/signin" className="!text-primary hover:underline">
              Login
            </Link>
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
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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

            {title !== "VENDOR" && (
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
      </Box>
    </>
  );
}
