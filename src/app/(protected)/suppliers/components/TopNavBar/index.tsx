'use client'

import Image from "next/image"
import { 
  Menu, 
  MenuButton, 
  MenuItem, 
  MenuItems 
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { BellIcon } from "@heroicons/react/24/outline";

import avatar from '@/assets/Images/Avatar.svg';
import Logo from '@/assets/Images/appLogo.svg';
import { signOut, useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { Tag } from "@chakra-ui/react";

const TopNavBar = () => {
  const session = useSession();
  const data = session.data as NextAuthUserSession;

  const renderBusinessType = (businessType: string) => {
    switch (businessType) {
      case 'VENDOR':
        return (
          <Tag size='sm' variant='solid' colorScheme='red'>
            {businessType?.toLocaleLowerCase()}
          </Tag>
        )
      case 'SUPPLIER':
        return (
          <Tag size='sm' variant='solid' colorScheme='green'>
            {businessType?.toLocaleLowerCase()}
          </Tag>
        )
      case 'ADMIN':
        return (
          <Tag size='sm' variant='solid' colorScheme='blue'>
            {businessType?.toLocaleLowerCase()}
          </Tag>
        )
      default:
        return (
          <Tag size='sm' variant='solid' colorScheme='red'>
            {businessType?.toLocaleLowerCase()}
          </Tag>
        )
    }
  }

  return (
    <div className="lg:fixed w-full bg-white z-50">
      <div className="flex justify-between shadow-sm">
        <div className="flex items-center gap-36">
          <div className="flex h-16 shrink-0 items-center my-4 ml-12">
            <Image src={Logo} alt=''/>
          </div>
          <div className="">
            <h4 className="text-gray-700 font-semibold">Good Afternoon, {data?.user.name}</h4>
            <p className="text-gray-400 text-sm">Monday, 20th May, 5:25pm</p>
          </div>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* <Badge content="1" color="danger"> */}
            <button type="button" className="-m-2.5 p-2.5 text-primary-600 rounded-full bg-primary-50 hover:text-gray-500">
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          {/* </Badge> */}
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              <Image src={avatar} alt=''/>
              <span className="hidden lg:flex lg:items-center">
                <div className="text-left ml-4">
                  <div className="flex gap-2">
                    <span aria-hidden="true" className="text-sm font-semibold leading-6 text-gray-900">
                        {data?.user.name}
                    </span>
                    {renderBusinessType(data?.user?.entityType)}
                  </div>
                  <p className="text-gray-600 text-sm">{data?.user?.businessName}</p>
                </div>
                <ChevronDownIcon aria-hidden="true" className="ml-4 h-6 w-6 text-gray-600" />
              </span>
            </MenuButton>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <MenuItem>
                <a
                  href={'#'}
                  className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                >
                  View Profile
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href={'#'}
                  className="block px-3 py-1 text-sm leading-6 text-red-600 data-[focus]:bg-red-50"
                  onClick={() => signOut()}
                >
                  Log out
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
      {/* <Divider /> */}
    </div>
  )
}

export default TopNavBar;