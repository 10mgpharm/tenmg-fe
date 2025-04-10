import { classNames } from "@/utils";
import { Button } from "@chakra-ui/react";
import Image from "next/image";

export const OverviewCard = ({
  title,
  value,
  fromColor,
  toColor,
  image,
  func,
  func_btn,
}: {
  title: string;
  value: string;
  fromColor: string;
  toColor: string;
  image: string;
  func?: () => void;
  func_btn?: string;
}) => {
  return (
    <div
      className={classNames(
        `bg-gradient-to-r ${fromColor} ${toColor} rounded-lg relative overflow-hidden `
      )}
    >
      <div className="flex items-center justify-between py-8 sm:py-12  lg:py-14 px-6 relative">
        <div className="">
          <p className="text-white text-[15px] lg:text-lg font-medium mb-1">
            {title}
          </p>
          <p className="font-bold text-white text-[18px] sm:text-[20px] lg:text-3xl">
            {value}
          </p>
          {(func && func_btn) && <div className="absolute top-[-15px] right-0">
            <Button size={"xs"} className="absolute top-6 right-3 z-20 " style={{ backgroundColor: "#000000cf" }} onClick={func}>Withdraw Funds</Button>
          </div>}
        </div>
      </div>
      <div className="absolute top-3 inset-x-0 mx-auto">
        <Image src={image} alt="" className="mx-auto" />
      </div>
    </div>
  );
};
