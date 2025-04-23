"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Cog6ToothIcon,
  HomeIcon,
  ReceiptPercentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "@/utils";
import { BsCart2 } from "react-icons/bs";
import { RiPercentLine } from "react-icons/ri";
import { FiShoppingBag } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { BiMessageDetail } from "react-icons/bi";
import { redirect, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LuUsers, LuWallet } from "react-icons/lu";
import { FaBalanceScale } from "react-icons/fa";
import { GiSpanner } from "react-icons/gi";
import { MdMonitor, MdOutlineSwapHorizontalCircle } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon, current: true },
  { name: "Orders", href: "/admin/orders", icon: BsCart2, current: false },
  {
    name: "Products",
    href: "/admin/products",
    icon: FiShoppingBag,
    current: false,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: LuUsers,
    current: false,
  },
  {
    name: "Document Approval",
    href: "/admin/document-approval",
    icon: IoDocumentTextOutline,
    current: false,
  },
  { name: "Insight", href: "/admin/insight", icon: LuUsers, current: false },
  { name: "Wallets", href: "/admin/wallet", icon: LuWallet, current: false },
  {
    name: "Discount Code",
    href: "/admin/discount-code",
    icon: RiPercentLine,
    current: false,
  },
  {
    name: "Loan Management",
    href: "/admin/loan-management",
    icon: FaBalanceScale,
    current: false,
  },
  {
    name: "Loan Application",
    href: "/admin/loan-application",
    icon: ReceiptPercentIcon,
    current: false,
  },
  {
    name: "Loan Repayment",
    href: "/admin/loan-repayment",
    icon: MdOutlineSwapHorizontalCircle,
    current: false,
  },
  {
    name: "Messages",
    href: "/admin/messages",
    icon: BiMessageDetail,
    current: false,
  },
  {
    name: "Audit Log",
    href: "/admin/audit-logs",
    icon: MdMonitor,
    current: false,
  },
  {
    name: "System Setup",
    href: "/admin/system-setup",
    icon: GiSpanner,
    current: false,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Cog6ToothIcon,
    current: false,
  },
];

const SideBar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const pathname = usePathname();
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const [count, setCount] = useState(0);
  const fetchingMessageCount = useCallback(async () => {
    try {
      const res = await requestClient({ token: token }).get(
        `/account/messages/unread-count`
      )
      setCount(res.data?.data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchingMessageCount();
  }, [token]);

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button
                  type="button"
                  // onClick={() => setSidebarOpen(false)}
                  onClick={onClose}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-white"
                  />
                </button>
              </div>
            </TransitionChild>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-6">
                      {navigation.map((item, i) => {
                        const isActive = (href: string) => {
                          if (href === "/admin") return pathname === href; // Exact match for Dashboard
                          return pathname.startsWith(href); // Allow dynamic routes
                        };
                        return (
                          <li key={i}>
                            <a
                              href={item.href}
                              className={classNames(
                                isActive(item.href)
                                  ? "bg-indigo-700 text-white"
                                  : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  isActive(item.href)
                                    ? "text-white"
                                    : "text-indigo-200 group-hover:text-white",
                                  "h-6 w-6 shrink-0"
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
                  </li>
                  <li className="mt-auto">
                    <a
                      href="#"
                      className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                    >
                      <Cog6ToothIcon
                        aria-hidden="true"
                        className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                      />
                      Settings
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <div className="hidden lg:mt-[98px] lg:fixed lg:z-50 lg:flex lg:w-72 lg:flex-col h-[calc(100vh-98px)]">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 pt-8">
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-8">
                  {navigation.map((item, i) => {
                    const isActive = (href: string) => {
                      if (href === "/admin") return pathname === href; // Exact match for Dashboard
                      return pathname.startsWith(href); // Allow dynamic routes
                    };
                    return (
                      <li key={i}>
                        <a
                          href={item.href}
                          className={classNames(
                            isActive(item.href)
                              ? "bg-primary-50 text-primary-500 p-0.5"
                              : "text-gray-500 px-3",
                            "group group-hover:bg-primary-50 flex gap-x-3 items-center rounded-md text-sm font-semibold leading-6"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              isActive(item.href)
                                ? "text-white bg-primary-500 rounded-full p-2 w-10 h-10"
                                : "text-gray-500 h-6 w-6",
                              "shrink-0"
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
              </li>
              <li className="mt-auto">
                <button
                  onClick={async () => {
                    await signOut();
                    redirect("/");
                  }}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-red-500 hover:bg-red-50"
                >
                  <CiLogout
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 text-red-500"
                  />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
