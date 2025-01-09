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
  Button,
  HStack,
  Flex,
  Divider,
  Link as ChakraLink,
  Icon,
  chakra,
  Stack,
  Image as ChakraImage,
} from "@chakra-ui/react";
import { FiEye } from "react-icons/fi";
import Image from "next/image";
import shape from "@public/assets/images/Rectangle.svg";
import { convertDate } from "@/utils/formatDate";
import { AdminApprovals } from "@/types";
import pdfFileIcon from "@public/assets/images/file_fomat_icon.png";
import Link from "next/link";

interface RequestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: AdminApprovals | null;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  requestId: string; // The ID of the request being viewed
}

export default function RequestDrawer({
  isOpen,
  onClose,
  data,
  onAccept,
  onDecline,
  requestId,
}: RequestDrawerProps) {
  if (!data) {
    return null;
  }

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent pt={4}>
        <DrawerCloseButton p={4} />
        <DrawerHeader pb={4}>
          <Heading as="h2" fontSize="2xl" fontWeight="semibold">
            {data.businessName || "N/A"}
          </Heading>
        </DrawerHeader>

        <DrawerBody className="space-y-5">
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
                  <Text fontWeight="medium">{data.type || "N/A"}</Text>
                </Box>
              </Flex>

              <Flex mb={2}>
                <Box w="50%" className="space-y-2">
                  <Text fontSize="sm" color="gray.600">
                    Business Name
                  </Text>
                  <Text fontWeight="medium">{data.businessName || "N/A"}</Text>
                </Box>
                <Box w="50%" className="space-y-2">
                  <Text fontSize="sm" color="gray.600">
                    Business Email
                  </Text>
                  <Text fontWeight="medium">{data.contactEmail || "N/A"}</Text>
                </Box>
              </Flex>

              <Flex mb={2}>
                <Box w="50%" className="space-y-2">
                  <Text fontSize="sm" color="gray.600">
                    Contact Phone Number
                  </Text>
                  <Text fontWeight="medium">{data.contactPhone || "N/A"}</Text>
                </Box>
                <Box w="50%" className="space-y-2">
                  <Text fontSize="sm" color="gray.600">
                    Contact Person’s Name
                  </Text>
                  <Text fontWeight="medium">{data.contactPerson || "N/A"}</Text>
                </Box>
              </Flex>

              <Box className="space-y-2">
                <Text fontSize="sm" color="gray.600">
                  Position
                </Text>
                <Text fontWeight="medium">
                  {data.contactPersonPosition || "N/A"}
                </Text>
              </Box>

              <Box className="space-y-2">
                <Text fontSize="sm" color="gray.600">
                  Business Address
                </Text>
                <Text fontWeight="medium">{data.businessAddress || "N/A"}</Text>
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
                  <Text fontWeight="medium">{data.licenseNumber || "N/A"}</Text>
                </Box>
                <Box w="50%" className="space-y-2">
                  <Text fontSize="sm" color="gray.600">
                    Expiry Date
                  </Text>
                  <Text fontWeight="medium">{convertDate(data.expiryDate) || "N/A"}</Text>
                </Box>
              </Flex>

              <Box w="100%" className="space-y-2">
                <Text fontSize="sm" color="gray.600">
                  Date Submitted
                </Text>
                <Text fontWeight="medium">{convertDate(data.createdAt) || "N/A"}</Text>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Document Section */}
          {data.cacDocument && (
            <Box className="space-y-2">
              <Flex gap={2} alignItems="center" wordBreak="break-word">
                <ChakraImage
                  src={pdfFileIcon.src}
                  width="40px"
                  height="40px"
                  alt="pdf"
                />
                <Text fontWeight="medium" flex={1}>
                  {data.cacDocument.split("/").pop()?.split("?")[0] ||
                    "document.pdf"}
                </Text>
                <Link
                  href={data.cacDocument}
                  className="text-primary-600 text-sm"
                >
                  View
                </Link>
              </Flex>
              <Text fontSize="sm" color="gray.500">
                Size: {data.cacFileSize || 0} KB
              </Text>
            </Box>
          )}

          <HStack w="full" p={4} justifyContent="flex-end">
            <Button
              variant="solid"
              colorScheme="red"
              backgroundColor="error.600"
              _hover="error.700"
              onClick={() => onDecline(requestId)}
            >
              Decline Request
            </Button>
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={() => onAccept(requestId)}
            >
              Accept Request
            </Button>
          </HStack>
        </DrawerBody>

        <DrawerFooter flexDirection="column" p={0}>
          <Image src={shape} alt="" width={298} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
