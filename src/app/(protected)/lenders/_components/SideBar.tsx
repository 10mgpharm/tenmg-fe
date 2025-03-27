"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Cog6ToothIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "@/utils";
import { BsGraphUpArrow } from "react-icons/bs";
import { FiShoppingBag } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { redirect, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { BusinessStatus } from "@/constants";
import { LuFileText } from 'react-icons/lu'
import { BiMessageDetail } from 'react-icons/bi'

const navigation = [
  { name: 'Dashboard', href: '/lenders', icon: HomeIcon, current: true },
  { name: 'Loan Application', href: '/lenders/loan-application', icon: LuFileText, current: false },
  { name: 'Transaction History', href: '/lenders/transaction-history', icon: FiShoppingBag, current: false },
  { name: 'Loan Portfolio', href: '/lenders/loan-portfolio', icon: BsGraphUpArrow, current: false },
  { name: 'Messages', href: '/lenders/messages', icon: BiMessageDetail, current: false },
  { name: 'Settings', href: '/lenders/settings', icon: Cog6ToothIcon, current: false },
]

const mustAlwaysBeEnabled = (name: string) =>
  ["Dashboard", "Settings"].includes(name);

const isLinkDisabled = (businessStatus: string, name: string) => {
  const disabledBusinessStatuses = [
    BusinessStatus.PENDING_VERIFICATION,
    BusinessStatus.PENDING_APPROVAL,
    BusinessStatus.REJECTED,
    BusinessStatus.LICENSE_EXPIRED,
    BusinessStatus.SUSPENDED,
    BusinessStatus.BANNED,
  ];
  return disabledBusinessStatuses.includes(businessStatus as BusinessStatus) &&
    !mustAlwaysBeEnabled(name)
    ? true
    : false;
};

const SideBar = ({ businessStatus }: { businessStatus: string }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
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
                  onClick={() => setSidebarOpen(false)}
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
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-6">
                      {navigation.map((item) => {
                        const isActive = pathname.includes(item.href);
                        const disabled = isLinkDisabled(
                          businessStatus,
                          item.name
                        );
                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                isActive
                                  ? "bg-indigo-700 text-white"
                                  : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                                disabled
                                  ? "pointer-events-none opacity-50"
                                  : "",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  isActive
                                    ? "text-white"
                                    : "text-indigo-200 group-hover:text-white",
                                  "h-6 w-6 shrink-0"
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
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 pt-8">
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-8">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const disabled = isLinkDisabled(businessStatus, item.name);
                    // const isActive = pathname.includes(item.href);
                    // let isActive = new RegExp(`^${item.href.replace(/\d+/g, '\\d+')}.*$`).test(pathname);

                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            isActive
                              ? "bg-primary-50 text-primary-500 p-0.5"
                              : "text-gray-500 px-3",
                            disabled ? "pointer-events-none opacity-50" : "",
                            "group group-hover:bg-primary-50 flex gap-x-3 items-center rounded-md text-sm font-semibold leading-6"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              isActive
                                ? "text-white bg-primary-500 rounded-full p-2 w-10 h-10"
                                : "text-gray-500 h-6 w-6",
                              "shrink-0"
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
              </li>
              <li className="mt-auto">
                <button
                  onClick={async () => {
                    await signOut();
                    redirect("/");
                  }}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm w-full font-semibold leading-6 text-red-500 hover:bg-red-50"
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
