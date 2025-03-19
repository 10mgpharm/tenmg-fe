import { classNames } from "@/utils";
import Image from "next/image";

const OverviewCard = ({
  title,
  value,
  fromColor,
  toColor,
  image,
}: {
  title: string;
  value: string;
  fromColor: string;
  toColor: string;
  image: string;
}) => {
  return (
    <div
      className={classNames(
        `bg-gradient-to-r ${fromColor} ${toColor} rounded-lg relative`
      )}
    >
      <div className="flex items-center justify-between py-8 sm:py-12  lg:py-14 px-6">
        <div className="">
          <p className="text-white text-[15px] lg:text-lg font-medium mb-1">
            {title}
          </p>
          <p className="font-bold text-white text-[18px] sm:text-[20px] lg:text-3xl">
            {value}
          </p>
        </div>
      </div>
      <div className="absolute top-3 inset-x-0 mx-auto">
        <Image src={image} alt="" className="mx-auto" />
      </div>
    </div>
  );
};

export default OverviewCard;
