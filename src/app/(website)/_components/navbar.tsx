"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const click = () => setNav(!nav);
  const close = () => setNav(false);
  return (
    <div>
      <nav className="bg-white shadow-sm border-b-2 ">
        <div className="max-w-7xl mx-auto px-2 sm:px-0 flex items-center w-full justify-between py-4">
          <div className="px-3 mt-2 flex justify-between items-center w-full lg:w-auto">
            <div className="flex gap-2 items-center">
              <Image
                src="/assets/images/applogo.png"
                alt="10mg Health"
                width={40}
                height={40}
              />
              <span className="ml-2 mt-2 md:text-xl text-sm font-semibold text-gray-800">
                10mg Health
              </span>
            </div>
            <button className="lg:hidden block text-black" onClick={click}>
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="40"
                height="40"
                viewBox="0 0 30 30"
              >
                <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"></path>
              </svg>
            </button>
          </div>
          <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center space-x-6 ">
            <Link href="#home" className="text-black">
              Home
            </Link>
            <Link href="#API" className="text-black">
              API
            </Link>
            <Link href="#FAQs" className="text-black">
              FAQs
            </Link>
            <Link href="#Lender" className="text-black">
              Lender
            </Link>
          </div>

          <div className="items-end space-x-4 sm:flex hidden">
            <Link href="/auth/signup">
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                Sign Up
              </button>
            </Link>
          </div>
        </div>

        {/* mobile view */}
        <div
          className={
            nav
              ? "md:hidden flex left-0 top-0 h-full bg-black z-20 w-full absolute"
              : ""
          }
        >
          <div
            className={
              nav
                ? "fixed top-0 left-0 w-[72%] h-full bg-white text-black transition-all duration-300"
                : "fixed top-0 left-[100%] w-[72%] h-full bg-white text-black transition-all duration-300"
            }
          >
            <div className="p-4 relative h-full">
              <div onClick={close} className="cursor-pointer">
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </div>
              <div className="flex flex-col space-y-6 text-black mt-8">
                <Link href="#home" className="text-black">
                  Home
                </Link>
                <Link href="#API" className="text-black">
                  API
                </Link>
                <Link href="#FAQs" className="text-black">
                  FAQs
                </Link>
                <Link href="#Lender" className="text-black">
                  Lender
                </Link>
              </div>

              <div className="absolute left-0 right-0 w-full bottom-0 p-4">
                <Link href="/auth/signup">
                  <button className="w-full rounded-lg py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
