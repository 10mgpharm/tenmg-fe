import { classNames } from "@/utils";
import { Flex, Select, Text } from "@chakra-ui/react";
import React from "react";

const TimeLineSelector = ({ selectedTimeLine, setSelectedTimeLine }) => {
  const timeLines = [
    { id: 0, timeline: "All time" },
    { id: 1, timeline: "12 months" },
    { id: 2, timeline: "30 days" },
    { id: 3, timeline: "7 days" },
    { id: 4, timeline: "24 hours" },
  ];

  return (
    <>
      <div className="">
        <Select
          placeholder="Select date"
          className="w-[200px]"
          onChange={(e) => setSelectedTimeLine(e.target.value)}
          defaultValue={"All time"}
          value={selectedTimeLine}
        >
          {timeLines.map((i) => (
            <option value={i.timeline} key={i.id}>
              {i.timeline}
            </option>
          ))}
        </Select>
      </div>
    </>
  );
};

export default TimeLineSelector;
