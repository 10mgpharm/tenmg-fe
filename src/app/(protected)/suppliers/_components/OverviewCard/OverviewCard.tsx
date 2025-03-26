import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { classNames } from "@/utils";

interface OverviewCardProps {
  title: string;
  value: string;
  fromColor: string;
  toColor: string;
  image?: string;
  toggleable?: boolean;
  isHidden?: boolean;
  onToggleVisibility?: () => void;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  fromColor,
  toColor,
  image,
  toggleable = false,
  isHidden = false,
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
      <div className="flex items-center justify-between py-6 md:py-12 px-6 relative z-20">
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
      </div>

      {image && (
        <div className="absolute top-3 inset-x-0 mx-auto right-0 z-10">
          <Image src={image} alt={`${title} background`} className="mx-auto" />
        </div>
      )}
    </div>
  );
};

export default OverviewCard;
