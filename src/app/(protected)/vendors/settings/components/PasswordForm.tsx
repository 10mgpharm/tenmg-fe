"use client";

import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import OTPAuth from "./OTPAuth";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const PasswordForm = () => {
  const [show, setShow] = useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
  };

  return (
    <div className="max-w-5xl p-5 rounded-md">
      <div className="pb-5">
        <h5 className="text-xl font-medium mb-1">Password</h5>
        <p className="text-sm font-normal text-gray-500">
          Please enter your current password to change your password.
        </p>
      </div>
      <form>
        <Divider mb={5} />
        <Stack direction={"column"} gap={5} divider={<Divider />}>
          <FormControl display={"flex"}>
            <FormLabel w={"40%"}>Current Password</FormLabel>
            <InputGroup size={"lg"} w={"60%"}>
              <Input
                type={show ? "text" : "password"}
                placeholder="***********"
                maxW="3xl"
              />
              <InputRightElement>
                {show ? (
                  <FaEye
                    onClick={() => setShow(!show)}
                    className="text-gray-500 w-5 h-5"
                  />
                ) : (
                  <FaEyeSlash
                    onClick={() => setShow(!show)}
                    className="text-gray-500 w-5 h-5"
                  />
                )}
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl display={"flex"}>
            <FormLabel w={"40%"}>New Password</FormLabel>
            <InputGroup size={"lg"} w={"60%"}>
              <Input
                type={show ? "text" : "password"}
                placeholder="***********"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters.",
                  },
                })}
              />
              <InputRightElement>
                {show ? (
                  <FaEye
                    onClick={() => setShow(!show)}
                    className="text-gray-500 w-5 h-5"
                  />
                ) : (
                  <FaEyeSlash
                    onClick={() => setShow(!show)}
                    className="text-gray-500 w-5 h-5"
                  />
                )}
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl display={"flex"}>
            <FormLabel w={"40%"}>Confirm Password</FormLabel>
            <InputGroup size={"lg"} w={"60%"}>
              <Input
                type={show ? "text" : "password"}
                placeholder="***********"
                {...register("passwordConfirmation", {
                  required: "Confirm Password is Required",
                  validate: (val) =>
                    watch("password") !== val
                      ? "Your passwords do not match"
                      : undefined,
                })}
              />
              <InputRightElement>
                {show ? (
                  <FaEye
                    onClick={() => setShow(!show)}
                    className="text-gray-500 w-5 h-5"
                  />
                ) : (
                  <FaEyeSlash
                    onClick={() => setShow(!show)}
                    className="text-gray-500 w-5 h-5"
                  />
                )}
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="2fa" mb="0">
              <Text fontWeight={"medium"}>Multi-Factor Authenticator</Text>
              <Text fontSize={"13px"} maxW={"60%"} color={"gray.400"}>
                Use multi-factor authentication (MFA) to add an extra layer of
                security to your account.
              </Text>
            </FormLabel>
            <Switch id="2fa" />
          </FormControl>
        </Stack>
      </form>
      <HStack justify={"center"} my={6}>
        <Flex>
          <Button variant="outline" mr={3}>
            Cancel
          </Button>
          <Button onClick={onOpen} colorScheme="blue">
            Save Changes
          </Button>
        </Flex>
      </HStack>
      <OTPAuth isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default PasswordForm;
