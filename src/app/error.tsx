"use client";

import { Button } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Error = ({ error }) => {
  console.log(error);
  const [showError, setShowError] = useState(false);

  return (
    <>
      <div className="container flex items-center max-md:gap-[50px] h-full min-h-screen max-md:pt-[100px] max-md:pb-[50px]  max-md:flex-col-reverse relative">
        {/* logo */}
        <Image
          src={"/assets/images/10mg logo.svg"}
          width={120}
          height={120}
          alt="logo image"
          className="absolute top-[30px] left-[0px]  "
        />

        <div className="flex-1 ">
          <p className="text-primary-400 font-semibold text-[16px] max-md:text-center">
            500 error
          </p>

          <h1 className="text-gray-900 text-[40px] font-[600] pt-[10px] leading-[45px] max-md:text-center max-md:text-[25px] max-md:leading-[30px]">
            Something went wrong...
          </h1>

          <p className="text-gray-500 text-[16px] pt-[20px] max-md:pt-[10px] max-md:text-center">
            Sorry, there was a problem. Please refresh the page or try again.
          </p>

          {showError && (
            <div className="md:mx-auto p-[10px] bg-gray-100 mt-4 max-md:text-center">
              <code className="text-[15px] font-[400] text-gray-700">
                {error.message}
              </code>
            </div>
          )}

          <div className="flex max-md:justify-center items-center gap-6">
            <Link href={"/"} className="mt-[30px] text-primary-600 ">
              <Button>Go to home page</Button>
            </Link>

            <p
              onClick={() => setShowError(!showError)}
              className="mt-[30px] text-primary-600 hover:underline cursor-pointer "
            >
              {showError ? "Close" : "Vew"} details
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center h-fit  md:min-h-screen   ">
          <Image
            src={"/assets/images/error-image.svg"}
            height={800}
            width={800}
            alt="404-image"
            className="w-fit h-[300px]  max-md:h-fit max-md:max-h-[200px] filter grayscale"
          />
        </div>
      </div>
    </>
  );
};

export default Error;
