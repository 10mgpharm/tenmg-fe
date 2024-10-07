"use client";

import { MdOutlineEmail } from "react-icons/md";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
} from "@chakra-ui/react";
import requestClient from "@/lib/requestClient";
import { ResponseDto, User } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

interface IFormInput {
  name: string;
  email: string;
  contactName: string;
  contactPhone: string;
  businessAddress: string;
  position: string;
}

const PersonalInformation = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setIsLoading(true);

      const response = await requestClient().post("/auth/signup", {});
      const { status, message }: ResponseDto<User> = response.data;
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Divider mb={[2, 5]} border="1px solid gray.200" />
      <div className="p-2 md:p-5 rounded-md bg-white md:max-w-5xl">
        <form
          className="space-y-5 mt-2 md:mt-5 mb-3 md:mb-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <HStack gap={5} flexDirection={{ base: "column", md: "row" }}>
            <FormControl isInvalid={!!errors.name?.message}>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Business Name
              </FormLabel>
              <Input
                placeholder="Enter business name"
                defaultValue={user?.businessName}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.contactName?.message}>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Contact Person&apos;s Name
              </FormLabel>
              <Input placeholder="Enter contact name" />
            </FormControl>
          </HStack>
          <HStack gap={5} flexDirection={{ base: "column", md: "row" }}>
            <FormControl isInvalid={!!errors.email?.message}>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Business Email
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" fontSize="1.2em">
                  <MdOutlineEmail color="gray.300" />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="Enter business email"
                  defaultValue={user?.email}
                  pl={10}
                  {...register("email", {
                    required: "Business Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
              </InputGroup>
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.contactPhone?.message}>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Contact Phone Number
              </FormLabel>
              <Input type="number" placeholder="Enter phone number" />
            </FormControl>
          </HStack>
          <HStack gap={5} flexDirection={{ base: "column", md: "row" }}>
            <FormControl isInvalid={!!errors.businessAddress?.message}>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Business Address
              </FormLabel>
              <Textarea placeholder="Enter here" />
            </FormControl>

            <FormControl isInvalid={!!errors.position?.message}>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Position
              </FormLabel>
              <Textarea placeholder="Enter here" />
            </FormControl>
          </HStack>
          <HStack
            justify={"center"}
            pt={16}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Flex>
              <Button variant="outline" mr={3}>
                Cancel
              </Button>
              <Button colorScheme="blue">Save Changes</Button>
            </Flex>
          </HStack>
        </form>
      </div>
    </>
  );
};

export default PersonalInformation;
