import Image from "next/image";
import Link from "next/link";
import React from "react";
const Herosection = () => {
  return (
    <div>
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <main className="flex-grow">
          <div className="relative w-full md:min-h-[600px] h-screen bg-[#fefffc] flex flex-col justify-center items-center md:py-10">
            {/* Background Images */}
            <div className="absolute inset-0 w-full h-full z-0">
              <Image
                src="/assets/images/rightImg.png"
                alt="Center Background"
                layout="fill"
                objectFit="cover"
                className="opacity-5"
              />
            </div>
            <div className="absolute bottom-0 left-0 z-0">
              <Image
                src="/assets/images/LeftSide.png"
                alt="Left Bottom Background"
                layout="intrinsic"
                width={500}
                height={500}
                className="opacity-50"
              />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-[865px] mx-auto px-4">
              <h1 className="text-[28px] md:text-[40px] lg:text-[60px] leading-[40px] md:leading-[48px] lg:leading-[72px] font-bold text-gray-800 mb-4">
                Empowering Healthcare Providers with Easy Access to Financing.
              </h1>
              <p className="text-base md:text-lg lg:text-xl max-w-[748px] mx-auto text-gray-600 mb-6">
                10MG connects pharmacies, hospitals, and healthcare vendors with
                fast, secure, and flexible loan solutions, so you can focus on
                saving lives.
              </p>
              <div className="flex justify-center items-center space-x-5 sm:space-x-4">
                <Link
                  href={"/demo"}
                  className="sm:w-auto px-6 py-3 bg-white text-[#344054] rounded-lg border border-gray-400"
                >
                  Demo
                </Link>{" "}
                <div className="items-end space-x-4 sm:flex hidden">
                  <Link href="/auth/signup">
                    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Herosection;
