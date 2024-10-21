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

interface IFormInput {
  fullName: string;
  email: string;
  role: "admin" | "operator" | "support";
}

const InviteMember = ({
  isOpen,
  onClose,
  accountType,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  accountType?: "vendor";
  onSubmit?: SubmitHandler<IFormInput>;
  isLoading?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "onBlur",
  });

  const [isDetails, setIsDetails] = useState(true);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Invite Member</DrawerHeader>
        <DrawerBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            {accountType && (
              <FormControl mb={5} isInvalid={!!errors.fullName}>
                <FormLabel htmlFor="fullName">Full Name</FormLabel>
                <Input
                  id="fullName"
                  {...register("fullName", {
                    required: "Full Name is Required",
                  })}
                />
                <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
              </FormControl>
            )}
            <FormControl mb={5} isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is Required",
                  pattern: {
                    value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
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
                  <option value="operator">Operator</option>
                  <option value="support">Support</option>
                </Select>
                <chakra.span
                  className="text-primary-600 text-sm cursor-pointer"
                  w={"30%"}
                  onClick={() => setIsDetails(!isDetails)}
                >
                  {isDetails ? "Hide Role Details" : "Show Role Details"}
                </chakra.span>
              </Flex>
            </FormControl>

            {isDetails && (
              <Box p={4} rounded={"md"} bg={"gray.100"}>
                <Text fontWeight={500} fontSize={"15px"} mb={1}>
                  Role&apos;s Permission
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
