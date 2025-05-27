"use client";

import {
  Box,
  Container,
  Divider,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Link,
} from "@chakra-ui/react";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import Image from "next/image";
import Logo from "@public/assets/images/logoWhite.svg";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Footer = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear(); // Get the current year

  const redirectUser = (path: string) => {
    signOut({ redirect: false })
      .then(() => router.push(path))
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  return (
    <Box bg="primary.600" color="white" py={10}>
      <Box className="px-3 md:px-20">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {/* Company Logo and Description */}
            <Stack spacing={4}>
              <HStack>
                <Image
                  src={Logo}
                  alt="10mg Health Logo"
                  className="w-[160px] md:h-auto"
                  width={75}
                  height={75}
                />
              </HStack>
            </Stack>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} mb={8}>
            {/* Links Section */}
            <Stack spacing={4}>
              <Text fontWeight="bold" fontSize="md">
                Our Company
              </Text>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" cursor="pointer">
                  Founder&apos;s Desk
                </Text>
                <Text fontSize="sm" cursor="pointer">
                  Our Story
                </Text>
                <Text fontSize="sm" cursor="pointer">
                  Challenges
                </Text>
              </VStack>
            </Stack>

            <Stack spacing={4}>
              <Text fontWeight="bold" fontSize="md">
                Users
              </Text>
              <VStack align="start" spacing={1}>
                <Text
                  onClick={() => redirectUser("/auth/signup?tab=supplier")}
                  fontSize="sm"
                  cursor="pointer"
                >
                  Suppliers
                </Text>
                <Text
                  onClick={() => redirectUser("/auth/signup?tab=pharmacy")}
                  fontSize="sm"
                  cursor="pointer"
                >
                  Pharmacies
                </Text>
                <Text
                  onClick={() => redirectUser("/auth/signup/vendor")}
                  fontSize="sm"
                  cursor="pointer"
                >
                  Vendors
                </Text>
                <Text
                  onClick={() => redirectUser("/auth/signup/lender")}
                  fontSize="sm"
                  cursor="pointer"
                >
                  Lenders
                </Text>
              </VStack>
            </Stack>

            <Stack spacing={4}>
              <Text fontWeight="bold" fontSize="md">
                Resources
              </Text>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" cursor="pointer">
                  Blogs
                </Text>
                <Link href="/storefront/faq" fontSize="sm" cursor="pointer">
                  FAQs
                </Link>
                <Text fontSize="sm" cursor="pointer">
                  Cookies
                </Text>
              </VStack>
            </Stack>

            {/* Legal Links */}

            <Stack spacing={2}>
              <Text fontWeight="bold" fontSize="md">
                Legal
              </Text>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" cursor="pointer">
                  Licenses
                </Text>
                <Text fontSize="sm" cursor="pointer">
                  Privacy Policy
                </Text>
                <Text fontSize="sm" cursor="pointer">
                  Cookie Policies
                </Text>
                <Text fontSize="sm" cursor="pointer">
                  Terms and Conditions
                </Text>
              </VStack>
            </Stack>
          </SimpleGrid>
        </SimpleGrid>

        {/* Footer Divider */}
        <Divider borderColor="whiteAlpha.600" />

        {/* Bottom Section */}
        <Stack
          mt={8}
          spacing={4}
          align="center"
          justify="space-between"
          direction={{ base: "column", md: "row" }}
        >
          <Text fontSize="sm" textAlign="center">
            &copy; {currentYear} 10MG Pharmacy. All Rights Reserved.
          </Text>
          <HStack spacing={6}>
            <FaTwitter cursor="pointer" />
            <FaLinkedin cursor="pointer" />
            <FaInstagram cursor="pointer" />
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
