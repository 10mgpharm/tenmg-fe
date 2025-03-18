import React from "react";
import OverviewCard from "../../suppliers/_components/OverviewCard/OverviewCard";

const OverviewCards = ({ overviewData }) => {
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
