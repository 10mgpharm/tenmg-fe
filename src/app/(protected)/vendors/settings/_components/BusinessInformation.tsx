"use client";

import { MdOutlineEmail } from "react-icons/md";
import { useEffect, useState } from "react";
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
import { NextAuthUserSession, ResponseDto, User } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { useSession } from "next-auth/react";

interface IFormInput {
  businessName: string;
  contactEmail: string;
  contactPerson: string;
  contactPhone: string;
  businessAddress: string;
  contactPersonPosition: string;
}

const BusinessInformation = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      businessName: "",
      contactEmail: "",
      // contactName: user?.contactName,
      // contactPhone: user?.contactPhone,
      // businessAddress: user?.businessAddress,
      // position: user?.position,
    },
  });

  useEffect(() => {
    setValue("businessName", user?.businessName);
    setValue("contactEmail", user?.email);
  }, [setValue, user?.businessName, user?.email]);

  const onSubmit: SubmitHandler<IFormInput> = async (value) => {
    try {
      setIsLoading(true);
  
      const response = await requestClient({
        token: sessionData.user.token,
      }).patch("/vendor/settings/business-information", {
        ...value,
      });
  
      if (response.status === 200) {
        // Override backend success message with a fixed one
        toast.success("Business information successfully updated");
        setIsLoading(false);
      } else {
        toast.error(`Error: ${response.data.message}`);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
  
      // Handle unexpected errors and display a user-friendly message
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };
  

  return (
    <div className="p-2 md:p-5 rounded-md bg-white md:max-w-5xl">
      <form
        className="space-y-5 mt-2 md:mt-5 mb-3 md:mb-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <HStack gap={5} flexDirection={{ base: "column", md: "row" }}>
          <FormControl isInvalid={!!errors.businessName?.message}>
            <FormLabel fontSize={"sm"} fontWeight={"medium"}>
              Business Name
            </FormLabel>
            <Input
              placeholder="Enter business name"
              {...register("businessName", {
                required: "Business Name is required",
              })}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.contactPerson?.message}>
            <FormLabel fontSize={"sm"} fontWeight={"medium"}>
              Contact Person&apos;s Name
            </FormLabel>
            <Input
              placeholder="Enter contact name"
              {...register("contactPerson", {
                required: "Contact Person Name is required",
              })}
            />
          </FormControl>
        </HStack>
        <HStack gap={5} flexDirection={{ base: "column", md: "row" }}>
          <FormControl isInvalid={!!errors.contactEmail?.message}>
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
                pl={10}
                {...register("contactEmail", {
                  required: "Business Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors.contactEmail?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.contactPhone?.message}>
            <FormLabel fontSize={"sm"} fontWeight={"medium"}>
              Contact Phone Number
            </FormLabel>
            <Input
              type="number"
              placeholder="Enter phone number"
              {...register("contactPhone", {
                required: "Contact Phone is required",
              })}
            />
          </FormControl>
        </HStack>
        <HStack gap={5} flexDirection={{ base: "column", md: "row" }}>
          <FormControl isInvalid={!!errors.businessAddress?.message}>
            <FormLabel fontSize={"sm"} fontWeight={"medium"}>
              Business Address
            </FormLabel>
            <Input
              type="text"
              placeholder="Enter business address"
              {...register("businessAddress", {
                required: "Contact Business Address is required",
              })}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.contactPersonPosition?.message}>
            <FormLabel fontSize={"sm"} fontWeight={"medium"}>
              Position
            </FormLabel>
            <Input
              type="text"
              placeholder="Enter position"
              {...register("contactPersonPosition", {
                required: "Contact Person Position is required",
              })}
            />
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
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Save Changes
            </Button>
          </Flex>
        </HStack>
      </form>
    </div>
  );
};

export default BusinessInformation;
