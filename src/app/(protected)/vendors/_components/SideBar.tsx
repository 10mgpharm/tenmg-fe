"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import requestClient from "@/lib/requestClient";

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

const SideBar = ({
  businessStatus,
  isOpen,
  onClose,
}: {
  businessStatus: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const pathname = usePathname();

  const [count, setCount] = useState(0);

  return (
    <>
      {/* Mobile Sidebar */}
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 pt-8">
              <nav className="flex flex-1 flex-col">
                {navSections.map((section) => (
                  <Box key={section.title} mb={6}>
                    <Text
                      fontSize="xs"
                      fontWeight="medium"
                      letterSpacing="widest"
                      mb={2}
                    >
                      {section.title}
                    </Text>
                    <ul role="list" className="-mx-2 space-y-8">
                      {section.items.map((item) => {
                        const isActive = item.href === pathname;
                        return (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                isActive
                                  ? "bg-primary-50 text-primary-500 p-0.5"
                                  : "text-gray-500 px-3",
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
                              {item.name === "Messages" && (
                                <div className="px-2 py-0 rounded-full bg-red-500 text-[9px] text-white">
                                  {count}
                                </div>
                              )}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </Box>
                ))}
                <li className="mt-auto">
                  <button
                    onClick={async () => {
                      await signOut();
                      redirect("/");
                    }}
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-red-500 hover:bg-red-50"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-6 w-6 shrink-0 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7"
                      />
                    </svg>
                    Logout
                  </button>
                </li>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Sidebar */}
      <Box
        display={{ base: "none", lg: "flex" }}
        mt={{ lg: "98px" }}
        position="fixed"
        zIndex={50}
        w="72"
        h="calc(100vh - 98px)"
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 pt-8 border-r border-gray-200 w-full">
          <nav className="flex flex-1 flex-col">
            {navSections.map((section) => (
              <Box key={section.title} mb={6}>
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  letterSpacing="widest"
                  mb={2}
                >
                  {section.title}
                </Text>
                <ul role="list" className="-mx-2 space-y-8">
                  {section.items.map((item) => {
                    const isActive = item.href === pathname;
                    return (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            isActive
                              ? "bg-primary-50 text-primary-500 p-0.5"
                              : "text-gray-500 px-3",
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
                          {item.name === "Messages" && (
                            <div className="px-2 py-0 rounded-full bg-red-500 text-[9px] text-white">
                              {count}
                            </div>
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </Box>
            ))}
            <li className="mt-auto">
              <button
                onClick={async () => {
                  await signOut();
                  redirect("/");
                }}
                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-red-500 hover:bg-red-50"
              >
                <svg
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                  />
                </svg>
                Logout
              </button>
            </li>
          </nav>
        </div>
      </Box>
    </>
  );
};

export default SideBar;
