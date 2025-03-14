"use client";

import { Button } from "@chakra-ui/react";
import Image from "next/image";

const NotFound = () => {
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

        <div className="flex-1">
          <p className="text-primary-400 font-semibold text-[16px] max-md:text-center">
            404 error
          </p>

          <h1 className="text-gray-900 text-[40px] font-[600] pt-[10px] leading-[45px] max-md:text-center max-md:text-[25px] max-md:leading-[30px]">
            Page not found...
          </h1>

          <p className="text-gray-500 text-[16px] pt-[20px] max-md:pt-[10px] max-md:text-center">
            {
              "Sorry, the page you are looking for doesn't exist or has been moved."
            }
          </p>
          <div className="flex max-md:justify-center">
            <Button className="mt-[30px]" onClick={() => window.history.back()}>
              Go back
            </Button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center h-fit  md:min-h-screen  ">
          <Image
            src={"/assets/images/404-image.png"}
            height={800}
            width={800}
            alt="404-image"
            className="w-fit h-[300px] max-md:h-fit max-md:max-h-[200px]"
          />
        </div>
      </div>
    </>
  );
};

export default NotFound;
