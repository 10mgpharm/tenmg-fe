import {
  Box,
  Container,
  Divider,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import Image from "next/image";
import Logo from "@public/assets/images/logoWhite.svg";

const Footer = () => {
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
              <Text fontSize="sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore
              </Text>
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
                Features
              </Text>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" cursor="pointer">
                  Suppliers
                </Text>
                <Text fontSize="sm" cursor="pointer">
                  Pharmacies
                </Text>
                <Text fontSize="sm" cursor="pointer">
                  Vendors
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
                <Text fontSize="sm" cursor="pointer">
                  FAQs
                </Text>
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
            &copy; 2024 10MG Pharmacy. All rights reserved.
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
