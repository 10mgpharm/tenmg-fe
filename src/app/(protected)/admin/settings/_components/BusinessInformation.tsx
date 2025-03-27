"use client";
import { MdOutlineEmail } from "react-icons/md";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
} from "@chakra-ui/react";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession, User } from "@/types";
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

const BusinessInformation = ({ user }: { user?: User }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInfoLoading, setIsInfoLoading] = useState<boolean>(false);
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  console.log(sessionData)
  // Determine user role
  const isMainAdmin = sessionData?.user?.entityType === "ADMIN";
  const isAdminMember = sessionData?.user?.entityType === "admin_member";

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      businessName: "",
      contactEmail: "",
      contactPhone: "",
      businessAddress: "",
      contactPersonPosition: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsInfoLoading(true);
        const response = await requestClient({
          token: sessionData.user.token,
        }).get("/admin/settings");

        const data = response.data.data;
        console.log(data)
        console.log("usd", isAdminMember);

        if (isAdminMember) {
          // Admin members can only see their own data, not the business info
          setValue("contactEmail", sessionData.user.email);
          setValue("contactPerson", sessionData.user.name);
          setValue("contactPhone", sessionData.user.phone || "");
          // setValue("contactPersonPosition", sessionData.user.position || "");
        } else {
          // Main admin gets full business data
          setValue("businessName", data.businessName);
          setValue("contactEmail", data.contactEmail);
          setValue("contactPerson", data.contactPerson);
          setValue("contactPhone", data.contactPhone);
          setValue("businessAddress", data.businessAddress);
          setValue("contactPersonPosition", data.contactPersonPosition || "");
        }
      } catch (error) {
        const errorMessage = handleServerErrorMessage(error);
        toast.error(errorMessage);
      } finally {
        setIsInfoLoading(false);
      }
    };

    if (sessionData?.user?.token) fetchUser();
  }, [sessionData?.user?.token, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (value) => {
    if (!isMainAdmin) return; // Prevent submission if not main admin

    try {
      setIsLoading(true);

      const response = await requestClient({
        token: sessionData.user.token,
      }).patch("/admin/settings/business-information", value);

      if (response.status === 200) {
        toast.success("Business information successfully updated");
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 md:p-5 rounded-md bg-white md:max-w-5xl">
      <form
        className="space-y-5 mt-2 md:mt-5 mb-3 md:mb-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Skeleton isLoaded={!isInfoLoading}>
          <HStack gap={5} flexDirection={{ base: "column", md: "row" }}>
            <FormControl isInvalid={!!errors.businessName?.message}>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Business Name
              </FormLabel>
              <Input
                type="text"
                isDisabled
                placeholder="Enter business name"
                {...register("businessName")}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.contactPerson?.message}>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Contact Person&apos;s Name
              </FormLabel>
              <Input
                type="text"
                isDisabled={!isMainAdmin}
                placeholder="Enter contact name"
                {...register("contactPerson")}
              />
            </FormControl>
          </HStack>
        </Skeleton>

        <Skeleton isLoaded={!isInfoLoading}>
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
                  isDisabled={!isMainAdmin}
                  placeholder="Enter business email"
                  pl={10}
                  {...register("contactEmail")}
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.contactEmail?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.contactPhone?.message}>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Contact Phone Number
              </FormLabel>
              <Input
                type="number"
                isDisabled={!isMainAdmin}
                placeholder="Enter phone number"
                {...register("contactPhone")}
              />
            </FormControl>
          </HStack>
        </Skeleton>

        <Skeleton isLoaded={!isInfoLoading}>
          <HStack gap={5} flexDirection={{ base: "column", md: "row" }}>
            <FormControl isInvalid={!!errors.businessAddress?.message}>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Business Address
              </FormLabel>
              <Input
                type="text"
                isDisabled={!isMainAdmin}
                placeholder="Enter business address"
                {...register("businessAddress")}
              />
            </FormControl>
            <FormControl isInvalid={!!errors.contactPersonPosition?.message}>
              <FormLabel fontSize={"sm"} fontWeight={"medium"}>
                Position
              </FormLabel>
              <Input
                type="text"
                isDisabled={!isMainAdmin}
                placeholder="Enter position"
                {...register("contactPersonPosition")}
              />
            </FormControl>
          </HStack>
        </Skeleton>

        {isMainAdmin && (
          <Skeleton isLoaded={!isInfoLoading}>
            <HStack
              justify={"center"}
              pt={16}
              flexDirection={{ base: "column", md: "row" }}
            >
              <Flex>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isLoading={isLoading}
                  isDisabled={isLoading || isInfoLoading}
                >
                  Save Changes
                </Button>
              </Flex>
            </HStack>
          </Skeleton>
        )}
      </form>
    </div>
  );
};

export default BusinessInformation;
