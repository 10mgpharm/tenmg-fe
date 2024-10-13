'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react'
import {
  Cog6ToothIcon,
  HomeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { classNames } from '@/utils'
import { BsCart2 } from "react-icons/bs";
import { RiPercentLine } from "react-icons/ri";
import { FiShoppingBag } from 'react-icons/fi'
import { CiLogout } from 'react-icons/ci'
import { BiMessageDetail } from 'react-icons/bi'
import { redirect, usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LuUsers, LuWallet } from 'react-icons/lu'
import { FaBalanceScale } from 'react-icons/fa'
import { GiSpanner } from "react-icons/gi";
import { MdMonitor } from 'react-icons/md'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon, current: true },
  { name: 'Orders', href: '/admin/orders', icon: BsCart2, current: false },
  { name: 'Products', href: '/admin/products', icon: FiShoppingBag, current: false },
  { name: 'User Management', href: '/admin/users', icon: LuUsers, current: false },
  { name: 'Insight', href: '/admin/insight', icon: LuUsers, current: false },
  { name: 'Wallet', href: '/admin/wallet', icon: LuWallet, current: false },
  { name: 'Discount Code', href: '/admin/discount-code', icon: RiPercentLine, current: false },
  { name: 'Loan Management', href: '/admin/loan-management', icon: FaBalanceScale, current: false },
  { name: 'Message', href: '/admin/messages', icon: BiMessageDetail, current: false },
  { name: 'Audit Log', href: '/admin/audit-logs', icon: MdMonitor, current: false },
  { name: 'System Setup', href: '/admin/system-setup', icon: GiSpanner, current: false },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon, current: false },
]

const SideBar = () => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div>
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
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
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
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
                          const isActive = item.href === pathname;
                          return(
                            <li key={item.name}>
                                <a
                                href={item.href}
                                className={classNames(
                                  isActive
                                  ? 'bg-indigo-700 text-white'
                                  : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                )}
                                >
                                <item.icon
                                  aria-hidden="true"
                                  className={classNames(
                                  isActive ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                                  'h-6 w-6 shrink-0',
                                  )}
                                />
                                {item.name}
                                </a>
                            </li>
                          )})}
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
                  const isActive = item.href === pathname;
                  return(
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          isActive
                          ? 'bg-primary-50 text-primary-500 p-0.5'
                          : 'text-gray-500 px-3',
                          'group group-hover:bg-primary-50 flex gap-x-3 items-center rounded-md text-sm font-semibold leading-6',
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={classNames(
                            isActive ? 'text-white bg-primary-500 rounded-full p-2 w-10 h-10' : 'text-gray-500 h-6 w-6',
                            'shrink-0',
                          )}
                        />
                        {item.name}
                      </a>
                    </li>
                  )})}
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
  )
}

export default SideBar;