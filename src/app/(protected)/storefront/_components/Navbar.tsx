"use client";

import { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Box,
  Text,
  HStack,
  Icon,
  Stack,
  VStack,
  IconButton,
  Button,
  Avatar,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Search, UserCircle2Icon, UserCircleIcon } from "lucide-react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";
import avatar from "@public/assets/images/Avatar.png";
import Logo from "@public/assets/images/10mg logo.svg";
import { PiShoppingBagBold } from "react-icons/pi";
import { FaRegCircleQuestion } from "react-icons/fa6";
import CartDrawer from "./CartDrawer";
import SearchModal from "./SearchModal";
import Link from "next/link";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const router = useRouter();

  const handleOpenSearch = () => setIsSearchOpen(true);
  const handleCloseSearch = () => setIsSearchOpen(false);

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  const handleOpenRemove = () => setIsRemoveOpen(true);
  const handleCloseRemove = () => setIsRemoveOpen(false);

  return (
    <Box className="lg:fixed w-full bg-white z-50 border-b-[2px] max-w-screen-2xl mx-auto">
      {/* Mobile View */}

      <Box
        className="flex justify-between shadow-sm lg:pr-8 items-center h-16 px-6"
        display={{ base: "flex", md: "none" }}
      >
        {/* Logo */}
        <HStack>
          <Image
            src={Logo}
            alt="10mg Health Logo"
            className="w-20 h-20"
            width={40}
            height={40}
          />
        </HStack>

        {/* Navigation Icons */}
        <HStack spacing={4} color="primary.500">
          {/* Search Icon */}
          <Box cursor="pointer" onClick={handleOpenSearch}>
            <Stack align="center">
              <Icon as={Search} boxSize={5} />
            </Stack>
          </Box>

          {/* Cart Icon */}
          <Box cursor="pointer" onClick={handleOpenCart}>
            <Stack align="center">
              <Box position="relative" display="flex" alignItems="center">
                <Icon as={PiShoppingBagBold} boxSize={5} />
                <Box
                  as="span"
                  position="absolute"
                  top="-1"
                  right="-2"
                  bg="red.600"
                  color="white"
                  fontSize="xs"
                  px={1}
                  borderRadius="full"
                >
                  1
                </Box>
              </Box>
            </Stack>
          </Box>

          {/* Avatar Icon */}
          <Box cursor="pointer">
            <Stack align="center">
              <Box position="relative" display="flex" alignItems="center">
                <Icon as={UserCircle2Icon} boxSize={5} color="primary.500" />
              </Box>
            </Stack>
          </Box>

          {/* Mobile Dropdown Menu */}
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Menu"
              icon={<RxHamburgerMenu />}
              variant="ghost"
              fontSize="2xl"
            />
            <MenuList
              bg="white"
              w="100vw"
              p={2}
              m={0}
              borderRadius={0}
              color="gray.900"
              fontSize="md"
              fontWeight="medium"
            >
              {/* Menu Items */}
              <MenuItem py={3}>
                <Text cursor="pointer">
                  <Link href={"/storefront/settings"}>
                    Personal Information
                  </Link>
                </Text>
              </MenuItem>
              <MenuItem py={3}>
                <Text cursor="pointer">
                  <Link href={"/storefront/orders"}>
                    My Orders
                  </Link>
                </Text>
              </MenuItem>
              <MenuItem py={3}>
                <Text cursor="pointer">
                  <Link href={"/storefront/my-wishlist"}>
                    My Wishlist
                  </Link>
                </Text>
              </MenuItem>
              <MenuItem py={3}>
                <Text cursor="pointer">
                  <Link href={"/storefront/shopping-list"}>
                    Shopping List
                  </Link>
                </Text>
              </MenuItem>
              <MenuItem py={3}>
                <Text cursor="pointer">Product Reviews</Text>
              </MenuItem>
              <MenuItem py={3}>
                <Text cursor="pointer">Help</Text>
              </MenuItem>
              <Box py={3}>
                <Button
                  colorScheme="primary"
                  width="full"
                  mt={2}
                  onClick={async () => await signOut()}
                >
                  Log Out
                </Button>
              </Box>
            </MenuList>
          </Menu>
        </HStack>
      </Box>

      {/* Desktop View */}
      <Box
        className="flex justify-between shadow-sm items-center px-20 "
        display={{ base: "none", md: "flex" }}
      >
        {/* Logo */}
        <HStack className="h-16 my-4">
          <Image
            src={Logo}
            alt="10mg Health Logo"
            className="w-[160px] md:h-auto"
            width={75}
            height={75}
          />
        </HStack>

        {/* Navigation */}
        <HStack
          spacing={8}
          color="primary.500"
          fontSize="sm"
          fontWeight="medium"
          alignItems="center"
        >
          {/* Search */}
          <Box cursor="pointer" onClick={handleOpenSearch}>
            <Stack align="center" spacing={1}>
              <Icon as={Search} boxSize={5} /> <Text>Search</Text>
            </Stack>
          </Box>

          {/* Cart */}
          <Box cursor="pointer" onClick={handleOpenCart}>
            <Stack align="center" spacing={1}>
              <Box position="relative" display="flex" alignItems="center">
                <Icon as={PiShoppingBagBold} boxSize={5} />{" "}
                <Box
                  as="span"
                  position="absolute"
                  top="-1"
                  right="-2"
                  bg="red.600"
                  color="white"
                  fontSize="xs"
                  px={1}
                  borderRadius="full"
                >
                  1
                </Box>
              </Box>
              <Text>Cart</Text>
            </Stack>
          </Box>

          {/* FAQs */}
          <Box
            cursor="pointer"
            onClick={() => {
              router.push("/faq");
            }}
          >
            <Stack align="center" spacing={1}>
              <Icon as={FaRegCircleQuestion} boxSize={5} />
              <Text>FAQs</Text>
            </Stack>
          </Box>

          {/* Account */}
          <Menu>
            <MenuButton as="button">
              <Stack align="center" spacing={1}>
                <Image src={avatar} alt="User Avatar" width={24} height={24} />
                <Text>Account</Text>
              </Stack>
            </MenuButton>
            <MenuList
              bg="white"
              w="280px"
              m={0}
              rounded="xl"
              color="gray.900"
              fontSize="md"
              fontWeight="medium"
            >
              <Box borderBottomWidth="thin" px={4} py={3}>
                <HStack spacing={4}>
                  <Avatar size="md" name="Bubbles Pharmacy" src={avatar.src} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium" fontSize="md">
                      Bubbles Pharmacy
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      hello@bubbles.com
                    </Text>
                  </VStack>
                </HStack>
              </Box>
              <MenuItem py={3} px={4}>
                <Text cursor="pointer">
                  <Link href={"/storefront/settings"}>
                    Personal Information
                  </Link>
                </Text>
              </MenuItem>
              <MenuItem py={3} px={4}>
                <Text cursor="pointer">
                  <Link href={"/storefront/orders"}>
                    My Orders
                  </Link>
                </Text>
              </MenuItem>
              <MenuItem py={3} px={4}>
                <Text cursor="pointer">
                  <Link href={"/storefront/my-wishlist"}>
                    My Wishlist
                  </Link>
                </Text>
              </MenuItem>
              <MenuItem py={3} px={4}>
                <Text cursor="pointer">
                  <Link href={"/storefront/shopping-list"}>
                    Shopping List
                  </Link>
                </Text>
              </MenuItem>
              <MenuItem py={3} px={4} color="error.500" borderTopWidth="thin" onClick={async () => await signOut()}>
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Box>

      {/* Search Modal */}
      <SearchModal
        isSearchOpen={isSearchOpen}
        handleCloseSearch={handleCloseSearch}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        isRemoveOpen={isRemoveOpen}
        handleOpenRemove={handleOpenRemove}
        handleCloseRemove={handleCloseRemove}
      />
    </Box>
  );
};

export default Navbar;
