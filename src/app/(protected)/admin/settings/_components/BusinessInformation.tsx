"use client";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession, ResponseDto, User } from "@/types";
import { handleServerErrorMessage } from "@/utils";
// import { IFormInput } from "@/app/(protected)/suppliers/products/add-product/page";
import {
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Button,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
interface IFormInput {
  name: string;
  email: string;
}

const BusinessInformation = () => {

     const [isLoading, setIsLoading] = useState(false);
     const [qrcode, setQrcode] = useState<string>("");

const session = useSession();
const sessionData = session.data as NextAuthUserSession;

const onSubmit: SubmitHandler<IFormInput> = async (value) => {
  try {
    setIsLoading(true);
    const response = await requestClient({
      token: sessionData.user.token,
    }).patch("admin/settings", {
      ...value,
    });
    const { data }: ResponseDto<User> = response.data;
    if (response.status === 200) {
      toast.success(response.data.message);
      setIsLoading(false);
      await session.update({
        ...sessionData,
        user: {
          ...sessionData.user,
          name: data.name,
          email: data.email,
        },
      });
    } else {
      toast.error(`Profile change failed: ${response.data.message}`);
    }
  } catch (error) {
    setIsLoading(false);
    const errorMessage = handleServerErrorMessage(error);
    toast.error(`Profile change failed: ${errorMessage}`);
  }
};

const {
  register,
  formState: { errors, isValid },
  setValue,
  handleSubmit,
} = useForm<IFormInput>({
  mode: "onChange",
  defaultValues: {
    name: "",
    email: "",
  },
});

useEffect(() => {
  if (sessionData) {
    setValue("name", sessionData.user.name, { shouldValidate: true });
    setValue("email", sessionData.user.email, { shouldValidate: true });
  }
}, [sessionData, setValue]);
  return (
    <Stack>
      <Text fontSize="1rem" fontWeight={600} color="gray.700">
        Business Information
      </Text>

      {/* Business Info Display */}
      <Stack spacing={5} mt={6}>
        <HStack gap={5}>
          <FormControl>
            <FormLabel>Business Name</FormLabel>
            <Input
              type="text"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <Text as="span" className="text-red-500 text-sm">
                {errors.name?.message}
              </Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Contact Person Name</FormLabel>
            <Input type="text" value={""} isReadOnly />
          </FormControl>
        </HStack>
        <HStack gap={5}>
          <FormControl>
            <FormLabel>Business Email</FormLabel>
            <Input type="email" value={""} isReadOnly />
          </FormControl>
          <FormControl>
            <FormLabel>Contact Phone Number</FormLabel>
            <Input type="text" value={""} isReadOnly />
          </FormControl>
        </HStack>
        <HStack gap={5}>
          <FormControl>
            <FormLabel>Business Address</FormLabel>
            <Input type="text" value={""} isReadOnly />
          </FormControl>
          <FormControl>
            <FormLabel>Position</FormLabel>
            <Input type="text" value={""} isReadOnly />
          </FormControl>
        </HStack>
        <Flex pt={8} justify="flex-end">
          <HStack spacing={3}>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Discard
            </Button>
            <Button
              type="submit"
              fontSize={"15px"}
              h={"38px"}
              px={3}
              py={1}
              isDisabled={isLoading}
              isLoading={isLoading}
              loadingText="Submitting..."
            >
              Save Changes
            </Button>
          </HStack>
        </Flex>
      </Stack>
    </Stack>
  );
};

export default BusinessInformation;
