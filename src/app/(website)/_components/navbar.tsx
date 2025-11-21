"use client";
import config from "@/lib/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const route = useRouter();

  const click = () => setNav(!nav);
  const close = () => setNav(false);

  return (
    <div>
      <nav className="bg-white shadow-sm border-b-2 ">
        <div className="max-w-7xl mx-auto px-2 sm:px-0 flex items-center w-full justify-between py-4">
          <div className="px-3 mt-2 flex justify-between items-center w-full lg:w-auto">
            <Link href={"/"} className="flex gap-2 items-center">
             <Image src={'/assets/images/10mg logo.svg'} alt=""    width={150}
                height={150} />
            </Link>

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
          <div className="max-w-7xl mx-auto hidden lg:flex justify-between items-center space-x-6">
            <Link href="/home" className="text-black hover:text-blue-700">
              Home
            </Link>
            <Link href={config.apiDocUrl} target="_blank" className="text-black hover:text-blue-700">
              API
            </Link>
            <Link href="/faq" className="text-black hover:text-blue-700">
              FAQs
            </Link>
            <Link
              href="/auth/signup/lender"
              className="text-black hover:text-blue-700"
            >
              Lender
            </Link>
          </div>

          <div className="items-end space-x-4 lg:flex hidden">
            <Link href="/auth/signin">
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
          </div>
        </div>

        {/* mobile view */}
        <div
          className={
            nav
              ? "lg:hidden flex left-0 top-0 h-full bg-black z-20 w-full absolute"
              : ""
          }
        >
          <div
            className={
              nav
                ? "fixed top-0 right-0 w-[72%] h-full bg-white text-black transition-all duration-300"
                : "fixed top-0 -right-[100%] w-[72%] h-full bg-white text-black transition-all duration-300"
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
                <p
                  onClick={() => {
                    click();
                    route.push("/#home");
                  }}
                  className="text-black cursor-pointer"
                >
                  Home
                </p>
                <p
                  onClick={() => {
                    click();
                    route.push("/#API");
                  }}
                  className="text-black cursor-pointer"
                >
                  API
                </p>
                <p
                  onClick={() => {
                    click();
                    route.push("/faq");
                  }}
                  className="text-black cursor-pointer"
                >
                  FAQs
                </p>
                <p
                  onClick={() => {
                    click();
                    route.push("/auth/signup/lender");
                  }}
                  className="text-black  cursor-pointer"
                >
                  Lender
                </p>
              </div>

              <div className="absolute left-0 right-0 w-full bottom-0 p-4">
                <button
                  className="w-full rounded-lg cursor-pointer py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  onClick={() => {
                    click();
                    route.push("/auth/signin");
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
