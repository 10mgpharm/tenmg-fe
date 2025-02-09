import Image from 'next/image';
import React from 'react'

const Herosection = () => {
  return (
    <div>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-0 flex items-center w-full justify-between py-4">
            <div className="flex items-start">
              <Image
                src="/assets/images/applogo.png"
                alt="10mg Health"
                width={40}
                height={40}
              />
              <span className="ml-2 mt-2 text-xl font-semibold text-gray-800">
                10mg Health
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#home" className="text-gray-700 hover:text-blue-600">
                Home
              </a>
              <a href="#api" className="text-gray-700 hover:text-blue-600">
                API
              </a>
              <a href="#faqs" className="text-gray-700 hover:text-blue-600">
                FAQs
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600">
                About Us
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sign up
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-grow">
          <div className="relative w-full min-h-[600px] bg-[#fefffc] flex flex-col justify-center items-center py-10">
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
                <button className="sm:w-auto px-6 py-3 bg-white text-[#344054] rounded-lg border border-gray-400">
                  Demo
                </button>
                <button className="sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className="bg-blue-900 py-12">
        <div className="text-center text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Simple Steps to Finance and Grow.
          </h2>
          <p className="text-sm">
            Unlock growth opportunities by connecting with trusted partners and
            financing solutions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Herosection;
