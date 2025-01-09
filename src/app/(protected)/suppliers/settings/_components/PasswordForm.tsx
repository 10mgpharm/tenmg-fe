"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import OTPAuth from "./OTPAuth";

const PasswordForm = () => {
  // Separate states for each password field
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <div className="max-w-2xl bg-white p-5 rounded-md">
      <form className="space-y-5">
        {/* Current Password Field */}
        <FormControl>
          <FormLabel>Current Password</FormLabel>
          <InputGroup size={"lg"}>
            <Input
              type="text" // Always text to handle dynamic display
              value={showCurrent ? currentPassword : "*".repeat(currentPassword.length)}
              placeholder="***********"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <InputRightElement>
              {showCurrent ? (
                <FaEye
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="text-gray-500 w-5 h-5 cursor-pointer"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="text-gray-500 w-5 h-5 cursor-pointer"
                />
              )}
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* New Password Field */}
        <FormControl>
          <FormLabel>New Password</FormLabel>
          <InputGroup size={"lg"}>
            <Input
              type="text" // Always text to handle dynamic display
              value={showNew ? newPassword : "*".repeat(newPassword.length)}
              placeholder="***********"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <InputRightElement>
              {showNew ? (
                <FaEye
                  onClick={() => setShowNew(!showNew)}
                  className="text-gray-500 w-5 h-5 cursor-pointer"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setShowNew(!showNew)}
                  className="text-gray-500 w-5 h-5 cursor-pointer"
                />
              )}
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* Confirm Password Field */}
        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup size={"lg"}>
            <Input
              type="text" // Always text to handle dynamic display
              value={showConfirm ? confirmPassword : "*".repeat(confirmPassword.length)}
              placeholder="***********"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <InputRightElement>
              {showConfirm ? (
                <FaEye
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-gray-500 w-5 h-5 cursor-pointer"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-gray-500 w-5 h-5 cursor-pointer"
                />
              )}
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* Multi-Factor Authentication */}
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
      </form>

      {/* Action Buttons */}
      <HStack justify={"end"} my={6}>
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
