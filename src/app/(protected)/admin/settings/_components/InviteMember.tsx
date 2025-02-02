import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Text,
  chakra,
} from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import shape from "@public/assets/images/Rectangle.svg";
import { SubmitHandler, useForm } from "react-hook-form";
import requestClient from "@/lib/requestClient";
import { handleServerErrorMessage } from "@/utils";
import { toast } from "react-toastify";

interface IFormInput {
  fullName: string;
  email: string;
  role: "admin" | "operator" | "support";
}

const INVITE_PATHS: { [key in "admin" | "vendor"]: string } = {
  admin: "/admin/settings/invite",
  vendor: "/vendor/settings/invite",
};

const InviteMember = ({
  isOpen,
  onClose,
  accountType,
  fetchTeamMembers,
  token,
}: {
  isOpen: boolean;
  onClose: () => void;
  accountType?: "vendor" | "admin";
  fetchTeamMembers?: () => void;
  token?: string;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "onBlur",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const endpoint = INVITE_PATHS[accountType] ?? INVITE_PATHS.vendor;
    try {
      setIsLoading(true);
      const response = await requestClient({ token: token }).post(
        endpoint,
        data
      );
      if (response.status === 200) {
        toast.success(response?.data?.message);
        reset();
        fetchTeamMembers();
        onClose();
      }
    } catch (error) {
      toast.error(handleServerErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Invite Member</DrawerHeader>
        <DrawerBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb={5} isInvalid={!!errors.fullName}>
              <FormLabel htmlFor="fullName">Full Name</FormLabel>
              <Input
                id="fullName"
                type="text"
                {...register("fullName", {
                  required: "Full Name is Required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/, // Regex to allow only letters and spaces
                    message: "Only letters are allowed in the Full Name",
                  },
                })}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /[^A-Za-z\s]/g,
                    ""
                  ); // Remove non-letter characters
                }}
                placeholder="Enter full name"
              />

              <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mb={5} isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is Required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid Email Address",
                  },
                })}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mb={10}>
              <FormLabel>Roles</FormLabel>
              <Flex alignItems={"center"} gap={10}>
                <Select {...register("role", { required: true })} w={"70%"}>
                  <option value="admin">Admin</option>
                  <option value="operation">Operation</option>
                  <option value="support">Support</option>
                </Select>
                <chakra.span
                  className="text-primary-600 text-sm font-medium line-clamp-1 min-w-max cursor-pointer"
                  onClick={() => setIsDetailsVisible(!isDetailsVisible)} // Toggle visibility
                >
                  {isDetailsVisible ? "Hide Role Details" : "View Role Details"}
                </chakra.span>
              </Flex>
            </FormControl>

            {isDetailsVisible && ( // Conditional rendering for Role Details
              <Box p={4} rounded={"md"} bg={"gray.100"}>
                <Text fontWeight={500} fontSize={"15px"} mb={1}>
                  Role&apos;s Permissions
                </Text>
                <ul className="list-disc px-4 text-sm">
                  <li>API Management: Create, Edit, Delete</li>
                  <li>
                    User Management: Invite, Deactivate, Activate, Assign roles
                  </li>
                  <li>
                    Monitoring and Analytics: Generate Analytics, View API Usage
                    reports
                  </li>
                </ul>
              </Box>
            )}

            <HStack maxW="300px" ml="auto" gap={3} mt={6}>
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary-600 text-white w-[65%]"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Invite Member
              </Button>
            </HStack>
          </form>
        </DrawerBody>
        <DrawerFooter p={0}>
          <Image src={shape} alt="" />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default InviteMember;
