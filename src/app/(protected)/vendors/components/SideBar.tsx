"use client";

import { Flex, VStack, Text, Divider, HStack, Stack } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";
import { FaUser } from "react-icons/fa";
import { LuFileText } from "react-icons/lu";
import { MdPercent } from "react-icons/md";
import { SlPeople } from "react-icons/sl";
import { FaBalanceScale } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineSwapHorizontalCircle } from "react-icons/md";
import receipt from "@public/assets/images/receipt.svg";
import bullseye from "@public/assets/images/bullseye.svg";

import Link from "next/link";
// import HamurgerMenu from "./HamurgerMenu";
import {
  Cog6ToothIcon,
  HomeIcon,
  XMarkIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";
import { useMediaQuery } from "@chakra-ui/media-query";
import { classNames } from "@/utils";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { GiBullseye } from "react-icons/gi";

const navigation = [
  { name: "Dashboard", href: "/vendors", icon: HomeIcon, current: true },
  {
    name: "Customers Management",
    href: "/vendors/customers-management",
    icon: SlPeople,
    current: false,
  },
];

const creditScore = [
  {
    name: "Transaction History",
    href: "/vendors/transactions",
    icon: LuFileText,
    current: false,
  },
  {
    name: "Credit Score",
    href: "/vendors/customers-management",
    icon: MdPercent,
    current: false,
  },
];

const loans = [
  {
    name: "Loan Management",
    href: "/vendors/transactions",
    icon: FaBalanceScale,
    current: false,
  },
  {
    name: "Loan Applications",
    href: "/vendors/loan-applications",
    icon: ReceiptPercentIcon,
    current: false,
  },
  {
    name: "Loan Offers",
    href: "/vendors/loan-offers",
    icon: ReceiptPercentIcon,
    current: false,
  },
  {
    name: "Loan Repayments",
    href: "/vendors/loan-repayments",
    icon: MdOutlineSwapHorizontalCircle,
    current: false,
  },
];

const system = [
  {
    name: "Audit Logs",
    href: "/vendors/audit-logs",
    icon: GiBullseye,
    current: false,
  },
  {
    name: "Settings",
    href: "/vendors/settings",
    icon: IoSettingsOutline,
    current: false,
  },
];

const SideBar = () => {
  const [isScreenBelow560] = useMediaQuery("(max-width : 560px)");

  const router = useRouter();
  const pathname = usePathname();

  if (isScreenBelow560) {
    return "<HamurgerMenu />";
  } else {
    return (
      <div className="hidden lg:mt-[98px] lg:fixed lg:z-50 lg:flex lg:w-72 lg:flex-col h-[calc(100vh-98px)] py-12 px-6">
        <VStack spacing={8} alignItems="left" w="100%">
          <Stack>
            {navigation.map((item, id) => {
              const isActive = item.href === pathname;
              return (
                <Link key={id} passHref href={item.href}>
                  <HStack
                    spacing={3}
                    w="100%"
                    _hover={{ color: "primary.500" }}
                    cursor="pointer"
                    py={2}
                  >
                    <Icon
                      as={item.icon}
                      color={isActive ? "primary.500" : "gray.500"}
                    />
                    <Text color={isActive ? "primary.500" : "gray.500"}>
                      {item.name}
                    </Text>
                  </HStack>
                </Link>
              );
            })}
          </Stack>

          <Stack>
            <Text fontSize="xs" fontWeight="medium" letterSpacing="widest">
              CREDIT SCORE
            </Text>
            {creditScore.map((item, id) => {
              const isActive = item.href === pathname;
              return (
                <Link key={id} passHref href={item.href}>
                  <HStack
                    spacing={3}
                    w="100%"
                    _hover={{ color: "primary.500" }}
                    cursor="pointer"
                    py={2}
                  >
                    <Icon
                      as={item.icon}
                      color={isActive ? "primary.500" : "gray.500"}
                    />
                    <Text color={isActive ? "primary.500" : "gray.500"}>
                      {item.name}
                    </Text>
                  </HStack>
                </Link>
              );
            })}
          </Stack>
          <Stack>
            <Text fontSize="xs" fontWeight="medium" letterSpacing="widest">
              LOANS
            </Text>
            {loans.map((item, id) => {
              const isActive = item.href === pathname;
              return (
                <Link key={id} passHref href={item.href}>
                  <HStack
                    spacing={3}
                    w="100%"
                    _hover={{ color: "primary.500" }}
                    cursor="pointer"
                    py={2}
                  >
                    <Icon
                      as={item.icon}
                      color={isActive ? "primary.500" : "gray.500"}
                    />
                    <Text color={isActive ? "primary.500" : "gray.500"}>
                      {item.name}
                    </Text>
                  </HStack>
                </Link>
              );
            })}
          </Stack>
          <Stack>
            <Text fontSize="xs" fontWeight="medium" letterSpacing="widest">
              SYSTEM
            </Text>
            {system.map((item, id) => {
              const isActive = item.href === pathname;
              return (
                <Link key={id} passHref href={item.href}>
                  <HStack
                    spacing={3}
                    w="100%"
                    _hover={{ color: "primary.500" }}
                    cursor="pointer"
                    py={2}
                  >
                    <Icon
                      as={item.icon}
                      color={isActive ? "primary.500" : "gray.500"}
                    />
                    <Text color={isActive ? "primary.500" : "gray.500"}>
                      {item.name}
                    </Text>
                  </HStack>
                </Link>
              );
            })}
          </Stack>
        </VStack>
      </div>
    );
  }
};

export default SideBar;
