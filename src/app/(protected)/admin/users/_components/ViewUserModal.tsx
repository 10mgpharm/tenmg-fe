"use client";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Heading,
  Box,
  Text,
  Divider,
  Flex,
  Stack,
  Skeleton,
  Link,
} from "@chakra-ui/react";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { classNames, handleServerErrorMessage } from "@/utils";
import Image from "next/image";
import shape from "@public/assets/images/Rectangle.svg";
import { convertDate } from "@/utils/formatDate";
import pdfFileIcon from "@public/assets/images/file_fomat_icon.png";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: number;
}

export default function ViewUserModal({
  isOpen,
  onClose,
  id,
}: ViewUserModalProps) {
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState(null);

  // Grab the NextAuth session and extract the token
  const { data: session } = useSession();
  const sessionToken = session as NextAuthUserSession | null;
  const token = sessionToken?.user?.token;

  // Fetch user data when drawer is open, and we have a valid id + token
  useEffect(() => {
    const fetchUserData = async () => {
      if (!id || !token) return;
      setIsUserLoading(true);
      try {
        const response = await requestClient({ token }).get(
          `admin/users/${id}`
        );
        if (response.status === 200) {
          setUserData(response.data.data);
        }
      } catch (error) {
        toast.error(handleServerErrorMessage(error));
      } finally {
        setIsUserLoading(false);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [id, token, isOpen]);

  // If no valid ID is provided, do not render the drawer at all
  if (!id) {
    return null;
  }

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent pt={4}>
        <DrawerCloseButton p={4} />
        <DrawerHeader pb={4}>
          <Flex justifyContent={"space-between"} mt={4}>
            {isUserLoading ? (
              <Skeleton height="24px" width="50%" />
            ) : (
              <>
                <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                  {userData?.name || "N/A"}
                </Heading>
                <div>
                  <p
                    className={classNames(
                      userData?.status === 2
                        ? "bg-[#FEF3F2] text-[#B42318]"
                        : userData?.status === 1
                        ? "text-[#027A48] bg-[#ECFDF3]"
                        : "text-yellow-500 bg-yellow-50",
                      "p-1 px-2 rounded-2xl text-sm font-medium flex items-center"
                    )}
                  >
                    {"• "}
                    {userData?.status === 1
                      ? "Active"
                      : userData?.accountStatus === "SUSPENDED"
                      ? "Suspended"
                      : "Invited"}
                  </p>
                </div>
              </>
            )}
          </Flex>
        </DrawerHeader>

        <DrawerBody className="space-y-5">
          {isUserLoading ? (
            <Stack spacing={4}>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          ) : (
            <>
              {/* Business Information */}
              <Box>
                <Heading as="h3" fontSize="xl" fontWeight="semibold" mb={4}>
                  Business Information
                </Heading>

                <Stack spacing={4}>
                  <Flex mb={2}>
                    <Box w="50%" className="space-y-2">
                      <Text fontSize="sm" color="gray.600">
                        User Type
                      </Text>
                      <Text fontWeight="medium">
                        {userData?.business?.type || "N/A"}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex mb={2}>
                    <Box w="50%" className="space-y-2">
                      <Text fontSize="sm" color="gray.600">
                        Business Name
                      </Text>
                      <Text fontWeight="medium">
                        {userData?.business?.businessName || "N/A"}
                      </Text>
                    </Box>
                    <Box w="50%" className="space-y-2">
                      <Text fontSize="sm" color="gray.600">
                        Email
                      </Text>
                      <Text fontWeight="medium">
                        {userData?.email || "N/A"}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex mb={2}>
                    <Box w="50%" className="space-y-2">
                      <Text fontSize="sm" color="gray.600">
                        Contact Phone Number
                      </Text>
                      <Text fontWeight="medium">
                        {userData?.business?.contactPhone || "N/A"}
                      </Text>
                    </Box>
                    <Box w="50%" className="space-y-2">
                      <Text fontSize="sm" color="gray.600">
                        Contact Person’s Name
                      </Text>
                      <Text fontWeight="medium">
                        {userData?.business?.contactPerson || "N/A"}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex mb={2}>
                    <Box w="50%" className="space-y-2">
                      <Text fontSize="sm" color="gray.600">
                        Position
                      </Text>
                      <Text fontWeight="medium">
                        {userData?.business?.contactPersonPosition || "N/A"}
                      </Text>
                    </Box>

                    <Box w="50%" className="space-y-2">
                      <Text fontSize="sm" color="gray.600">
                        Date Joined
                      </Text>
                      <Text fontWeight="medium">
                        {(userData?.dateJoined &&
                          convertDate(userData?.dateJoined)) ||
                          "N/A"}
                      </Text>
                    </Box>
                  </Flex>
                  <Box className="space-y-2">
                    <Text fontSize="sm" color="gray.600">
                      Business Address
                    </Text>
                    <Text fontWeight="medium">
                      {userData?.business?.businessAddress || "N/A"}
                    </Text>
                  </Box>
                </Stack>
              </Box>

              {/* License Information */}
              <Box>
                <Heading as="h3" fontSize="xl" fontWeight="semibold" mb={4}>
                  License Information
                </Heading>
                <Stack spacing={4}>
                  <Flex mb={2}>
                    <Box w="50%" className="space-y-2">
                      <Text fontSize="sm" color="gray.600">
                        License Number
                      </Text>
                      <Text fontWeight="medium">
                        {userData?.business?.licenseNumber || "N/A"}
                      </Text>
                    </Box>
                    <Box w="50%" className="space-y-2">
                      <Text fontSize="sm" color="gray.600">
                        Expiry Date
                      </Text>
                      <Text fontWeight="medium">
                        {userData?.business?.expiryDate
                          ? convertDate(userData?.business?.expiryDate)
                          : "N/A"}
                      </Text>
                    </Box>
                  </Flex>

                  <Box w="100%" className="space-y-2">
                    <Text fontSize="sm" color="gray.600">
                      Date Submitted
                    </Text>
                    <Text fontWeight="medium">
                      {userData?.business?.updatedAt
                        ? convertDate(userData?.business?.updatedAt)
                        : "N/A"}
                    </Text>
                  </Box>
                </Stack>
              </Box>

              <Divider />

              {/* Document Section */}
              {userData?.business?.cacDocument && (
                <Box className="space-y-2">
                  <Flex gap={2} alignItems="center" wordBreak="break-word">
                    <Image src={pdfFileIcon} width={40} height={40} alt="pdf" />
                    <Text fontWeight="medium" flex={1}>
                      {userData?.business?.cacDocument
                        .split("/")
                        .pop()
                        ?.split("?")[0] || "document.pdf"}
                    </Text>
                    <Link
                      target="_blank"
                      href={userData?.business?.cacDocument}
                      className="text-primary-600 text-sm"
                    >
                      View
                    </Link>
                  </Flex>
                  <Text fontSize="sm" color="gray.500">
                    Size: {userData?.business?.cacFileSize || 0} KB
                  </Text>
                </Box>
              )}
            </>
          )}
        </DrawerBody>

        <DrawerFooter flexDirection="column" p={0}>
          <Image src={shape} alt="" width={298} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
