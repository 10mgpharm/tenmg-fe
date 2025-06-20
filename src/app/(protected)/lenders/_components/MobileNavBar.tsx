"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Home from "@public/icons/home-icon.png";
import Coins from "@public/icons/coins-icon.png";
import Note from "@public/icons/note-icon.png";
import Settings from "@public/icons/settings-icon.png";
import { usePathname } from "next/navigation";

export default function MobileNavBar() {
  const pathname = usePathname();
  const navItems =
    [
      { href: "/lenders", label: "Home", icon: Home },
      { href: "/lenders/transaction-history", label: "Transaction", icon: Note },
      { href: "/lenders/loan-portfolio", label: "Loans", icon: Coins },
      { href: "/lenders/settings", label: "Settings", icon: Settings },
    ];

  return (
    <nav className="fixed bottom-[-2px] w-full bg-white border-t border-gray-200 flex justify-around items-center py-2 md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center text-xs ${isActive ? "text-blue-500" : "text-gray-400"
              }`}
          >
            <div className="mb-2">
              <Image src={item.icon} alt={item.label} width={24} height={24} />
            </div>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
