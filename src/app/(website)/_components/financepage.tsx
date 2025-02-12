import Image from "next/image";
import React from "react";

const Financepage = () => {
  return (
    <div className="bg-blue-900 py-12">
      <div className="text-center text-white mb-8">
        <h2 className="text-[28px] md:text-[40px] lg:text-[38px] leading-normal md:leading-[1.2] lg:leading-[1.2] font-bold mb-2 ">
          Simple Steps to Finance and Grow.
        </h2>
        <p className="text-base md:text-lg lg:text-xl max-w-[726px] mx-auto">
          10MG Credit is your trusted partner for smarter healthcare financing,
          empowering lenders, vendors, and suppliers with tailored credit
          solutions.
        </p>
      </div>
      {/* Finance Section */}
      <div className="flex flex-col md:w-[90%] w-full justify-center items-center mx-auto h-full md:gap-8 gap-4 p-4 md:p-0">
        {/* Card 1 */}

        <div className="flex flex-col md:flex-row items-center md:h-[640px] w-full">
          <div className="bg-[#F0F8E5] p-6 rounded-l-lg shadow-md md:w-1/2 w-full h-full justify-center flex-col flex items-start max-w-[700px]">
            <h4 className="text-[#5E19B3] text-sm font-semibold mb-2">
              FOR STOREFRONT
            </h4>
            <h3 className="text-[28px] md:text-[40px] lg:text-[50px] leading-normal md:leading-[1.2] lg:leading-[1.2] font-bold text-gray-800 mb-4">
              Affordable Medicines at Your Fingertips
            </h3>
            <p className="text-[#363F52] text-base md:text-lg lg:text-2xl max-w-[748px] mb-4">
              Shop for trusted, high-quality medications from verified vendors.
              Browse, compare, and purchase with ease—all in one place.
            </p>
            <div className="flex item-center gap-2">
              <a
                href="/auth/signin"
                className="text-[#2467E3] font-semibold hover:underline pt-6"
              >
                Go To Storefront
              </a>
              <svg
                className="mt-7"
                width="20"
                height="20"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1.68347"
                  y="1"
                  width="23"
                  height="24"
                  rx="11.5"
                  stroke="#2467E3"
                  stroke-width="2"
                />
                <path
                  d="M14.6444 8.59424L18.8353 12.7851L14.6444 16.9759"
                  stroke="#2467E3"
                  stroke-width="1.69276"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.09753 12.7852H18.7173"
                  stroke="#2467E3"
                  stroke-width="1.69276"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="h-full md:w-1/2 w-full">
            <Image
              src="/assets/images/FinanceImg.png"
              alt="Affordable Medicines"
              width={500}
              height={500}
              quality={100}
              className="rounded-r-lg w-full h-full"
            />
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col md:flex-row items-center md:h-[600px] w-full gap-6">
          <div className="h-full md:w-[40%] w-full">
            <Image
              src="/assets/images/supplier.png"
              alt="Reliable Financing"
              width={500}
              height={500}
              quality={100}
              className="rounded-lg w-full h-full object-cover"
            />
          </div>
          <div className="bg-[#E5CEFF] p-6 rounded-lg shadow-md md:w-[60%] w-full h-full justify-center flex-col flex items-start ">
            <h4 className="text-[#5E19B3] text-sm font-semibold mb-2">
              FOR SUPPLIERS
            </h4>
            <h3 className="text-[28px] md:text-[40px] lg:text-[55px] leading-normal md:leading-[1.2] lg:leading-[1.2] font-bold text-gray-800 mb-4">
              Reliable Financing for Seamless Operations
            </h3>
            <p className="text-[#363F52] text-base md:text-lg lg:text-2xl max-w-[630px] mb-4">
              10MG Credit ensures you never run out of resources. Instant access
              to funds to meet your operational demands.
            </p>
            <div className="flex item-center gap-2">
              <a
                href="/auth/signup"
                className="text-[#2467E3] font-semibold hover:underline pt-6"
              >
                Sign Up As a Supplier
              </a>

              <svg
                className="mt-7"
                width="20"
                height="20"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1.68347"
                  y="1"
                  width="23"
                  height="24"
                  rx="11.5"
                  stroke="#2467E3"
                  stroke-width="2"
                />
                <path
                  d="M14.6444 8.59424L18.8353 12.7851L14.6444 16.9759"
                  stroke="#2467E3"
                  stroke-width="1.69276"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.09753 12.7852H18.7173"
                  stroke="#2467E3"
                  stroke-width="1.69276"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col md:flex-row items-center md:h-[640px] w-full">
          <div className="bg-[#F0F8E5] p-6 rounded-l-lg shadow-md md:w-1/2 w-full h-full justify-center flex-col flex items-start max-w-[700px]">
            <h4 className="text-[#5E19B3] text-sm font-semibold mb-2">
              FOR VENDORS
            </h4>
            <h3 className="text-[28px] md:text-[40px] lg:text-[50px] leading-normal md:leading-[1.2] lg:leading-[1.2] font-bold text-gray-800 mb-4">
              Secure Credit To Expand Your Business
            </h3>
            <p className="text-[#363F52] text-base md:text-lg lg:text-2xl max-w-[748px] mb-4">
              Unlock access to capital for operational growth and inventory
              financing. Simplified loan applications, transparent repayment
              plans.
            </p>
            <div className="flex item-center gap-2">
              <a
                href="/auth/signup/vendor"
                className="text-[#2467E3] font-semibold hover:underline pt-6"
              >
                Sign Up As a Vendor
              </a>
              <svg
                className="mt-7"
                width="20"
                height="20"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1.68347"
                  y="1"
                  width="23"
                  height="24"
                  rx="11.5"
                  stroke="#2467E3"
                  stroke-width="2"
                />
                <path
                  d="M14.6444 8.59424L18.8353 12.7851L14.6444 16.9759"
                  stroke="#2467E3"
                  stroke-width="1.69276"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.09753 12.7852H18.7173"
                  stroke="#2467E3"
                  stroke-width="1.69276"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="h-full md:w-1/2 w-full">
            <Image
              src="/assets/images/FinanceImg3.png"
              alt="Affordable Medicines"
              width={500}
              height={500}
              quality={100}
              className="rounded-r-lg w-full h-full"
            />
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex flex-col md:flex-row items-center md:h-[600px] w-full gap-6">
          <div className="h-full md:w-[40%] w-full">
            <Image
              src="/assets/images/lenders.png"
              alt="Affordable Medicines"
              width={500}
              height={500}
              quality={100}
              className="rounded-lg w-full h-full"
            />
          </div>
          <div className="bg-[#F4D8C1] p-6 rounded-lg shadow-md md:w-[60%] w-full h-full justify-center flex-col flex items-start">
            <h4 className="text-[#5E19B3] text-sm font-semibold mb-2">
              FOR LENDERS
            </h4>
            <h3 className="text-[28px] md:text-[40px] lg:text-[50px] leading-normal md:leading-[1.2] lg:leading-[1.2] font-bold text-gray-800 mb-4">
              Grow Your Returns with Verified Borrowers
            </h3>
            <p className="text-[#363F52] text-base md:text-lg lg:text-2xl max-w-[698px] mb-4">
              Access a pool of trustworthy vendors and suppliers, track
              repayments effortlessly, and watch your investments grow with
              competitive interest rates.
            </p>
            <div className="flex gap-2 items-center">
              <a
                href="/auth/signup/lender"
                className="text-[#2467E3] font-semibold hover:underline pt-6"
              >
                Sign Up As a Lender
              </a>
              <svg
                className="mt-7"
                width="20"
                height="20"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1.68347"
                  y="1"
                  width="23"
                  height="24"
                  rx="11.5"
                  stroke="#2467E3"
                  stroke-width="2"
                />
                <path
                  d="M14.6444 8.59424L18.8353 12.7851L14.6444 16.9759"
                  stroke="#2467E3"
                  stroke-width="1.69276"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.09753 12.7852H18.7173"
                  stroke="#2467E3"
                  stroke-width="1.69276"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financepage;
