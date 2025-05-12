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
        `bg-gradient-to-r ${fromColor} ${toColor} rounded-lg relative overflow-hidden w-full`
      )}
    >
      <div className="flex items-center justify-between py-8 sm:py-12  lg:py-14 px-6 relative w-full">
        <div className="w-full">
          <p className="text-white text-[15px] lg:text-lg font-medium mb-1">
            {title}
          </p>
          <div className="flex items-center justify-between w-full ">

            <p className="font-bold text-white text-[18px] sm:text-[20px] lg:text-3xl">
              {value}
            </p>

            {(func && func_btn) &&
              <Button size={"xs"} className="relative top-6 z-20" disabled={(func && func_btn) && (parseInt(value) <= 0)} style={{ backgroundColor: "#000000" }} onClick={func}>Withdraw Funds</Button>
            }
          </div>

        </div>
      </div>
      <div className="absolute top-3 inset-x-0 mx-auto">
        <Image src={image} alt="" className="mx-auto" />
      </div>
    </div>
  );
};
