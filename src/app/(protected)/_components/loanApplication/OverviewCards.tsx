import React from 'react';
import OverviewCard from '../../suppliers/_components/OverviewCard/OverviewCard';
import totalPattern from '@public/assets/images/bgPattern.svg';
import orderPattern from '@public/assets/images/orderPattern.svg';
import productPattern from '@public/assets/images/productpatterns.svg';

export interface OverviewCardData {
  title: string;
  value: string;
  fromColor: string;
  toColor: string;
  image: any;
}

const overviewData: OverviewCardData[] = [
  {
    title: "Total Loans",
    value: "5,600",
    fromColor: "from-[#53389E]",
    toColor: "to-[#7F56D9]",
    image: totalPattern,
  },
  {
    title: "Total Interests",
    value: "₦2,300",
    fromColor: "from-[#DC6803]",
    toColor: "to-[#DC6803]",
    image: orderPattern,
  },
  {
    title: "Total Amount Disbursed",
    value: "₦50,000",
    fromColor: "from-[#3E4784]",
    toColor: "to-[#3E4784]",
    image: productPattern,
  },
  {
    title: "Total Products",
    value: "50,000",
    fromColor: "from-[#E31B54]",
    toColor: "to-[#E31B54]",
    image: productPattern,
  },
];

const OverviewCards = () => {
  return (
    <div className="grid grid-cols-4 gap-4 mt-5">
      {overviewData.map((card, idx) => (
        <OverviewCard
          key={idx}
          title={card.title}
          value={card.value}
          fromColor={card.fromColor}
          toColor={card.toColor}
          image={card.image}
        />
      ))}
    </div>
  );
};

export default OverviewCards;
