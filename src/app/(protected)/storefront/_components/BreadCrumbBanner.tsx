import Link from "next/link";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

type BreadcrumbItem = {
  text: string;
  link: string;
};

type BreadcrumbProps = {
  breadCrumbsData: BreadcrumbItem[];
};

const BreadCrumbBanner: React.FC<BreadcrumbProps> = ({ breadCrumbsData }) => {
  return (
    <div className="w-full px-8 py-8 bg-primary-500 text-white">
      <div className="flex items-center">
        {breadCrumbsData.map((item, index) =>
          index === breadCrumbsData.length - 1 ? (
            <p key={index} className="font-semibold">
              {item.text}
            </p>
          ) : (
            <div key={index} className="flex items-center gap-1 mx-1">
              <Link href={item.link} className="font-semibold">
                {item.text}
              </Link>
              <MdKeyboardArrowRight className="w-5 h-5" />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BreadCrumbBanner;
