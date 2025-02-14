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
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function OperationLayout({
  isOpen,
  onClose,
  title,
  description,
  children,
}: RequestDrawerProps) {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent pt={4}>
        <DrawerCloseButton p={4} />
        <DrawerHeader pb={4} mt={12}>
          <Heading as="h2" fontSize="2xl" fontWeight="semibold" mb={2}>
            {title}
          </Heading>
          <Text mb={4} color="gray.400" fontWeight={500} fontSize="md">
            {description}
          </Text>
        </DrawerHeader>

        <DrawerBody>{children}</DrawerBody>

        <DrawerFooter flexDirection="column" p={0}>
          <Image src={shape} alt="" width={298} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
