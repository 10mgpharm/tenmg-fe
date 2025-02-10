import Image from "next/image";
import React from "react";

const Financepage = () => {
  return (
    <div>
      {/* Finance Section */}
      <div className="flex flex-col md:w-[90%] w-full justify-center items-center mx-auto h-full md:gap-8 gap-4 p-4 md:p-0">
        {/* Card 1 */}
        <div className="flex flex-col md:flex-row items-center md:h-[640px] w-full">
          <div className="bg-[#BFD6FA] p-6 rounded-l-lg shadow-md md:w-1/2 w-full h-full justify-center flex-col flex items-start max-w-[700px]">
            <div className="md:w-[540px] w-full space-y-4 justify-center mx-auto flex-col flex h-full ">
              <h4 className="text-[#5E19B3] text-sm font-semibold ">
                FOR STOREFRONT
              </h4>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Affordable Medicines at Your Fingertips
              </h3>
              <p className="text-[#363F52] mb-4">
                Shop for trusted, high-quality medications from verified
                vendors. Browse, compare, and purchase with ease—all in one
                place.
              </p>
              <a
                href="#"
                className="text-[#2467E3] font-semibold hover:underline pt-6"
              >
                Go to Storefront →
              </a>
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
        <div className="flex flex-col md:flex-row items-center md:h-[802px] w-full gap-6">
          <div className="h-full md:w-[40%] w-full">
            <Image
              src="/assets/images/FinanceImg2.png"
              alt="Reliable Financing"
              width={500}
              height={500}
              quality={100}
              className="rounded-lg w-full h-full"
            />
          </div>
          <div className="bg-[#E5CEFF] p-6 rounded-lg shadow-md md:w-[60%] w-full h-full justify-center flex-col flex items-start ">
            <h4 className="text-[#5E19B3] text-sm font-semibold mb-2">
              FOR SUPPLIERS
            </h4>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Reliable Financing for Seamless Operations
            </h3>
            <p className="text-[#363F52] mb-4">
              10MG Credit ensures you never run out of resources. Instant access
              to funds to meet your operational demands.
            </p>
            <a href="#" className="text-[#2467E3]font-semibold hover:underline">
              Sign Up as a Supplier →
            </a>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col md:flex-row items-center md:h-[640px] w-full">
          <div className="bg-[#F0F8E5] p-6 rounded-l-lg shadow-md md:w-1/2 w-full h-full justify-center flex-col flex items-start max-w-[700px]">
            <h4 className="text-[#5E19B3] text-sm font-semibold mb-2">
              FOR STOREFRONT
            </h4>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Affordable Medicines at Your Fingertips
            </h3>
            <p className="text-[#363F52] mb-4">
              Shop for trusted, high-quality medications from verified vendors.
              Browse, compare, and purchase with ease—all in one place.
            </p>
            <a
              href="#"
              className="text-[#2467E3] font-semibold hover:underline"
            >
              Go to Storefront →
            </a>
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
        <div className="flex flex-col md:flex-row items-center md:h-[802px] w-full gap-6">
          <div className="h-full md:w-[40%] w-full">
            <Image
              src="/assets/images/FinanceImg1.png"
              alt="Affordable Medicines"
              width={500}
              height={500}
              quality={100}
              className="rounded-lg w-full h-full"
            />
          </div>
          <div className="bg-[#F4D8C1] p-6 rounded-l-lg shadow-md md:w-[60%] w-full h-full justify-center flex-col flex items-start">
            <h4 className="text-[#5E19B3] text-sm font-semibold mb-2">
              FOR STOREFRONT
            </h4>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Affordable Medicines at Your Fingertips
            </h3>
            <p className="text-[#363F52] mb-4">
              Shop for trusted, high-quality medications from verified vendors.
              Browse, compare, and purchase with ease—all in one place.
            </p>
            <a
              href="#"
              className="text-[#2467E3] font-semibold hover:underline"
            >
              Go to Storefront →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financepage;
