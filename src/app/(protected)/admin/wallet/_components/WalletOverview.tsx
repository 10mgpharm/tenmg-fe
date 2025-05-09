import { cn } from "@/lib/utils";
import { classNames } from "@/utils";
import Image from "next/image";

interface OverviewProps {
  title: string;
  value: string;
  fromColor: string;
  toColor: string;
  image: string;
  pendingBg?: string;
  pendingText?: string;
  hasPendingBalance: boolean;
  pendingBalance?: string;
}
const WalletOverview = ({
  title,
  value,
  fromColor,
  toColor,
  image,
  pendingBg,
  pendingText,
  hasPendingBalance,
  pendingBalance,
}: OverviewProps) => {
  return (
    <div
      className={classNames(
        `bg-gradient-to-r ${fromColor} ${toColor} rounded-lg relative`
      )}
    >
      <div className={cn(hasPendingBalance ? "mb-10": "mb-0", "flex items-center justify-between py-8 sm:py-12 lg:py-14 px-6 relative")}>
        <div className="">
          <p className="text-white text-[15px] lg:text-lg font-medium mb-1">
            {title}
          </p>
          <p className="font-bold text-white text-[18px] sm:text-[20px] lg:text-3xl">
            {value}
          </p>
          {
            hasPendingBalance &&
            <div className="absolute bottom-0 left-6">
              <div className={classNames(`${pendingBg} rounded-md p-1 w-100 pl-2.5`)}>
                <p className={classNames(`${pendingText} font-medium text-xs`)}>Pending Balance</p>
                <p className={classNames(`${pendingText} text-xs font-medium`)}>₦{pendingBalance}</p>
              </div>
            </div>
          }
        </div>
      </div>
      <div className="absolute top-3 inset-x-0 mx-auto">
        <Image src={image} alt="" className="mx-auto" />
      </div>
    </div>
  );
};

export default WalletOverview;
