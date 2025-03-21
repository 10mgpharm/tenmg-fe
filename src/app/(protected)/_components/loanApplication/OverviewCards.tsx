import React from "react";
import OverviewCard from "../../suppliers/_components/OverviewCard/OverviewCard";

const OverviewCards = ({ overviewData }) => {
  return (
    <>
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
    </>
  );
};

export default OverviewCards;
