"use client";

import { useState, useEffect } from "react";
import { Text, Box } from "@chakra-ui/layout";
import { LuFileText } from "react-icons/lu";
import { MdPercent } from "react-icons/md";
import { SlPeople } from "react-icons/sl";
import { FaBalanceScale } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineSwapHorizontalCircle } from "react-icons/md";
import { BusinessStatus } from "@/constants";
import { HomeIcon, ReceiptPercentIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/utils";
import { usePathname } from "next/navigation";
import { GiBullseye } from "react-icons/gi";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  IconButton,
} from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";
import { BiMessageDetail } from "react-icons/bi";
import { LuWallet } from "react-icons/lu";

const navSections = [
  {
    title: "NAVIGATION",
    items: [
      { name: "Dashboard", href: "/vendors", icon: HomeIcon },
      {
        name: "Customers Management",
        href: "/vendors/customers-management",
        icon: SlPeople,
      },
      {
        name: "Wallet",
        href: "/vendors/wallet",
        icon: LuWallet,
      },
    ],
  },
  {
    title: "CREDIT SCORE",
    items: [
      {
        name: "Transaction Evaluation",
        href: "/vendors/transactions-history",
        icon: LuFileText,
      },
      {
        name: "Credit Score",
        href: "/vendors/credit-score",
        icon: MdPercent,
      },
    ],
  },
  {
    title: "LOANS",
    items: [
      {
        name: "Loan Management",
        href: "/vendors/loan-management",
        icon: FaBalanceScale,
      },
      {
        name: "Loan Applications",
        href: "/vendors/loan-applications",
        icon: ReceiptPercentIcon,
      },
      {
        name: "Loan Repayments",
        href: "/vendors/loan-repayments",
        icon: MdOutlineSwapHorizontalCircle,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        name: "Messages",
        href: "/vendors/messages",
        icon: BiMessageDetail,
      },
      {
        name: "Audit Logs",
        href: "/vendors/audit-logs",
        icon: GiBullseye,
      },
      {
        name: "Settings",
        href: "/vendors/settings",
        icon: IoSettingsOutline,
      },
    ],
  },
];

const smVariant = { navigation: "drawer", navigationButton: true };
const mdVariant = { navigation: "sidebar", navigationButton: false };

const mustAlwaysBeEnabled = (name: string) =>
  ["Dashboard", "Settings"].includes(name);

const isLinkDisabled = (businessStatus: string, name: string) => {
  const disabledBusinessStatuses = [
    BusinessStatus.PENDING_VERIFICATION,
    BusinessStatus.PENDING_APPROVAL,
    BusinessStatus.REJECTED,
    BusinessStatus.SUSPENDED,
    BusinessStatus.BANNED,
  ];
  return disabledBusinessStatuses.includes(businessStatus as BusinessStatus) &&
    !mustAlwaysBeEnabled(name)
    ? true
    : false;
};

const SideBar = ({ businessStatus }: { businessStatus: string }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const variants = useBreakpointValue({ base: smVariant, md: mdVariant });

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
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
              <SidebarContent
                pathname={pathname}
                businessStatus={businessStatus}
              />
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
      <SidebarContent pathname={pathname} businessStatus={businessStatus} />
    </Box>
  );
};

export default SideBar;

const SidebarContent = ({
  pathname,
  businessStatus,
}: {
  pathname: string;
  businessStatus: string;
}) => (
  <Box className="flex grow flex-col gap-y-5 md:overflow-y-auto bg-white md:px-6 pb-4 pt-8 md:border-r border-gray-200">
    <nav className="flex flex-1 flex-col">
      {navSections.map((section) => (
        <Box key={section.title} mb={6}>
          {/* Section Title */}
          <Text fontSize="xs" fontWeight="medium" letterSpacing="widest" mb={2}>
            {section.title}
          </Text>

          {/* Section Items */}
          <ul role="list" className="-mx-2 space-y-8">
            {section.items.map((item) => {
              const isActive = item.href === pathname;
              const disabled = isLinkDisabled(businessStatus, item.name);
              return (
                <li key={item.name}>
                  <Link
                    href={disabled ? "#" : item.href}
                    className={classNames(
                      isActive
                        ? "bg-primary-50 text-primary-500 p-0.5"
                        : "text-gray-500 px-3",
                      disabled ? "pointer-events-none opacity-50" : "",
                      "group group-hover:bg-primary-50 flex gap-x-3 items-center rounded-md text-sm font-semibold leading-6"
                    )}
                  >
                    <item.icon
                      aria-label={item.name}
                      className={classNames(
                        isActive
                          ? "text-white bg-primary-500 rounded-full p-2 w-10 h-10"
                          : "text-gray-500 h-6 w-6"
                      )}
                    />
                    {item.name}
                    {
                      item.name === "Messages" &&
                      <div className="px-2 py-0 rounded-full bg-red-500 text-[9px] text-white">
                        {0}
                      </div>
                    }
                  </Link>
                </li>
              );
            })}
          </ul>
        </Box>
      ))}
    </nav>
  </Box>
);
