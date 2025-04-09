import Image from "next/image";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { classNames } from "@/utils";
import { Button } from "@chakra-ui/react";

interface OverviewCardProps {
  title: string;
  value: string;
  fromColor: string;
  toColor: string;
  image?: string;
  icon?: any;
  toggleable?: boolean;
  isHidden?: boolean;
  onToggleVisibility?: () => void;
  isInvestment?: boolean;
  loanAmount?: string;
  onInvestmentClick?: () => void;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  fromColor,
  toColor,
  image,
  icon,
  toggleable = false,
  isHidden = false,
  isInvestment = false,
  loanAmount = "₦0.00",
  onInvestmentClick,
  onToggleVisibility,
}) => {
  const fromClass = fromColor.startsWith("from-")
    ? fromColor
    : `from-${fromColor}`;
  const toClass = toColor.startsWith("to-") ? toColor : `to-${toColor}`;

  return (
    <div
      className={classNames(
        `bg-gradient-to-r ${fromClass} ${toClass} rounded-xl relative overflow-hidden`
      )}
    >
      {isInvestment && (
        <Button
          position="absolute"
          top="4"
          right="4"
          size="xs"
          colorScheme="whiteAlpha"
          color="white"
          borderColor="white"
          variant="outline"
          rightIcon={<ArrowRight size={16} />}
          zIndex="30"
          _hover={{
            bg: "whiteAlpha.200",
          }}
          onClick={onInvestmentClick}
        >
          View my earnings
        </Button>
      )}

      <div className="flex items-center justify-between py-14 md:py-16 px-6 relative z-20">
        <div className="">
          <p className="text-white text-base mb-1 flex items-center gap-2">
            {title}
            {toggleable && (
              <button
                onClick={onToggleVisibility}
                className="focus:outline-none"
                aria-label={isHidden ? "Show value" : "Hide value"}
              >
                {isHidden ? (
                  <EyeOff size={18} className="text-white" />
                ) : (
                  <Eye size={18} className="text-white" />
                )}
              </button>
            )}
          </p>
          <p className="font-medium text-white text-2xl">{value}</p>
        </div>
        {icon && <Image src={icon} alt="" width={48} height={48} />}
      </div>

      {isInvestment && (
        <div className="absolute bottom-2 inset-x-0 mx-auto z-10 left-6">
          <div className=" bg-white bg-opacity-20 rounded-md p-1 w-3/5">
            <p className="text-white text-xs">Amount on Loan</p>
            <p className="text-white text-xs font-medium">{loanAmount}</p>
          </div>
        </div>
      )}

      {image && (
        <div className="absolute top-3 inset-x-0 mx-auto right-0 z-10">
          <Image
            src={image}
            alt={`${title} background`}
            className="mx-auto"
            width={160}
            height={160}
          />
        </div>
      )}
    </div>
  );
};

export default OverviewCard;
