import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Image, Heading, Text, FormControl, FormLabel, Input, Button, FormErrorMessage, InputGroup, InputRightElement, Link, IconButton } from "@chakra-ui/react";
import { FiEyeOff } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";

interface SignUpFieldProps {
  title: "supplier" | "pharmacy" | "vendor";
}

interface IFormInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpField({ title }: SignUpFieldProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IFormInput>({
    mode: 'onChange'
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <>
      <Box px={{ base: 6, md: 12, lg: 20, xl: 32 }}>
        <Image
          src="/assets/images/tenmg_logo.png"
          alt="tenmg"
          mb={{ md: 8 }}
          boxSize="75px"
        />

        <Box mb={8}>
          <Heading
            as="h3"
            size="lg"
            fontWeight="normal"
            mb={3}
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
          <Box mb={10}>
            <FormControl isInvalid={!!errors.name?.message} mb={5}>
              <FormLabel htmlFor="name">
                Business name <Text as="span" color="red.500">*</Text>
              </FormLabel>
              <Input
                id="name"
                placeholder="Enter your business name"
                {...register("name", { required: "Business Name is required" })}
                type="text"
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email?.message} mb={5}>
              <FormLabel htmlFor="email">
                Business email <Text as="span" color="red.500">*</Text>
              </FormLabel>
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

            <FormControl isInvalid={!!errors.password?.message} mb={5}>
              <FormLabel htmlFor="password">
                Password <Text as="span" color="red.500">*</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  id="password"
                  type={isVisible ? "text" : "password"}
                  placeholder="Enter your password"
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
                    variant={'ghost'}
                    h='1.75rem' size='sm'
                    onClick={toggleVisibility}
                    bgColor={'transparent'}
                    _hover={{
                      bg: 'transparent'
                    }}
                    icon={isVisible ? (
                      <FiEyeOff size={16} className="text-default-400 pointer-events-none text-gray" />
                    ) : (
                      <IoEyeOutline size={16} className="text-default-400 pointer-events-none text-gray" />
                    )} aria-label={""}
                  >
                  </IconButton>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.confirmPassword?.message} mb={5}>
              <FormLabel htmlFor="confirmPassword">
                Confirm Password <Text as="span" color="red.500">*</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  id="confirmPassword"
                  type={isConfirmVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (val) =>
                      watch("password") !== val ? "Your passwords do not match" : undefined,
                  })}
                />
                <InputRightElement>
                  <IconButton
                    variant={'ghost'}
                    h='1.75rem' size='sm'
                    onClick={toggleConfirmVisibility}
                    bgColor={'transparent'}
                    _hover={{
                      bg: 'transparent'
                    }}
                    icon={isConfirmVisible ? (
                      <FiEyeOff size={16} className="text-default-400 pointer-events-none text-gray" />
                    ) : (
                      <IoEyeOutline size={16} className="text-default-400 pointer-events-none text-gray" />
                    )} aria-label={""}
                  >
                  </IconButton>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
            </FormControl>
          </Box>

          <Box mb={8}>
            <Button
              colorScheme="purple"
              size="lg"
              w="full"
              type="submit"
            >
              Create account
            </Button>

            {title !== "vendor" && (
              <Button
                leftIcon={<FcGoogle />}
                variant="outline"
                size="lg"
                w="full"
                mt={4}
              >
                Sign up with Google
              </Button>
            )}
          </Box>
        </form>

        <Box textAlign="center">
          <Text color="gray.500">
            Already have an account?{" "}
            <Link href="/auth/signin" color="primary.500">
              Log in
            </Link>{" "}
            or{" "}
            <Link href={`${title !== "vendor" ? "/auth/signup/vendor" : "/auth/signup"}`} color="primary.500">
              Sign Up as a
              {title !== "vendor" ? " Vendor" : " Supplier or Pharmacy"}
            </Link>
          </Text>
        </Box>
      </Box>

    </>
  );
}
