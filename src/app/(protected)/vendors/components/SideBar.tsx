"use client";

import { useState, useEffect } from "react";
import { Text, Box } from "@chakra-ui/layout";
import { LuFileText } from "react-icons/lu";
import { MdPercent } from "react-icons/md";
import { SlPeople } from "react-icons/sl";
import { FaBalanceScale, FaHamburger } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineSwapHorizontalCircle } from "react-icons/md";
import receipt from "@public/assets/images/receipt.svg";
import bullseye from "@public/assets/images/bullseye.svg";

import {
  Cog6ToothIcon,
  HomeIcon,
  XMarkIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "@/utils";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { GiBullseye } from "react-icons/gi";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
} from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";

const navigationItems = [
  { name: "Dashboard", href: "/vendors", icon: HomeIcon, current: true },
  {
    name: "Customers Management",
    href: "/vendors/customers-management",
    icon: SlPeople,
    current: false,
  },
];

const creditScoreItems = [
  {
    name: "Transaction History",
    href: "/vendors/transactions",
    icon: LuFileText,
    current: false,
  },
  {
    name: "Credit Score",
    href: "/vendors/credit-score",
    icon: MdPercent,
    current: false,
  },
];

const loanItems = [
  {
    name: "Loan Management",
    href: "/vendors/loan",
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

const systemItems = [
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

const smVariant = { navigation: "drawer", navigationButton: true };
const mdVariant = { navigation: "sidebar", navigationButton: false };

const SideBar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const variants = useBreakpointValue({ base: smVariant, md: mdVariant });

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false); // Close sidebar on route change
  }, [pathname]);

  return variants.navigation === "drawer" ? (
    <>
      <Box p={4}>
        <IconButton
          variant="outline"
          aria-label="Menu"
          icon={<RxHamburgerMenu />}
          onClick={toggleSidebar}
        />
      </Box>

      <Drawer isOpen={isSidebarOpen} placement="left" onClose={toggleSidebar}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody>
              <SidebarContent pathname={pathname} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  ) : (
    <Box
      display={{ base: "none", lg: "flex" }}
      mt={{ lg: "98px" }}
      position="fixed"
      zIndex={50}
      w="72"
      h="calc(100vh - 98px)"
    >
      <SidebarContent pathname={pathname} />
    </Box>
  );
};

export default SideBar;

const SidebarContent = ({ pathname }: { pathname: string }) => (
  <Box className="flex grow flex-col gap-y-5 md:overflow-y-auto bg-white md:px-6 pb-4 pt-8 mt-4 md:border-r border-gray-200">
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <RenderSection
          title="NAVIGATION"
          items={navigationItems}
          pathname={pathname}
        />
        <Text fontSize="xs" fontWeight="medium" letterSpacing="widest">
          CREDIT SCORE
        </Text>
        <RenderSection
          title="CREDIT SCORE"
          items={creditScoreItems}
          pathname={pathname}
        />
        <Text fontSize="xs" fontWeight="medium" letterSpacing="widest">
          LOANS
        </Text>
        <RenderSection title="LOANS" items={loanItems} pathname={pathname} />
        <Text fontSize="xs" fontWeight="medium" letterSpacing="widest">
          SYSTEM
        </Text>
        <RenderSection title="SYSTEM" items={systemItems} pathname={pathname} />
      </ul>
    </nav>
  </Box>
);

const RenderSection = ({
  title,
  items,
  pathname,
}: {
  title: string;
  items: any[];
  pathname: string;
}) => (
  <ul role="list" className="-mx-2 space-y-8">
    {items.map((item) => {
      const isActive = item.href === pathname;
      return (
        <li key={item.name}>
          <a href={item.href} className={getNavItemClassNames(isActive)}>
            <item.icon
              aria-label={item.name}
              className={
                isActive
                  ? "text-white bg-primary-500 rounded-full p-2 w-10 h-10"
                  : "text-gray-500 h-6 w-6"
              }
            />
            {item.name}
          </a>
        </li>
      );
    })}
  </ul>
);

const getNavItemClassNames = (isActive: boolean) =>
  classNames(
    isActive ? "bg-primary-50 text-primary-500 p-0.5" : "text-gray-500 px-3",
    "group group-hover:bg-primary-50 flex gap-x-3 items-center rounded-md text-sm font-semibold leading-6"
  );
