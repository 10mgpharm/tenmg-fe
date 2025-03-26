import { classNames } from "@/utils";
import { Flex, Select, Text } from "@chakra-ui/react";
import React from "react";

const TimeLineSelector = ({ selectedTimeLine, setSelectedTimeLine }) => {
  const timeLines = [
    { id: 1, timeline: "12 months" },
    { id: 2, timeline: "30 days" },
    { id: 3, timeline: "7 days" },
    { id: 4, timeline: "24 hours" },
  ];

  return (
    <>
      <div className="hidden max-md:block">
        <Select
          placeholder="Select date"
          className="w-[200px]"
          onChange={(e) => setSelectedTimeLine(e.target.value)}
        >
          {timeLines.map((i) => (
            <option value={i.timeline} key={i.id}>
              {i.timeline}
            </option>
          ))}
        </Select>
      </div>

      <Flex
        className="border rounded-md w-fit "
        display={["none", "none", "flex"]}
      >
        {timeLines?.map((item) => (
          <Text
            onClick={() => setSelectedTimeLine(item.timeline)}
            key={item.id}
            p={3}
            cursor={"pointer"}
            className={classNames(
              selectedTimeLine === item.timeline
                ? "bg-gray-200 text-gray-900 text-[15px]  "
                : "white text-gray-500  text-[15px]   "
            )}
          >
            {item.timeline}
          </Text>
        ))}
      </Flex>
    </>
  );
};

export default TimeLineSelector;
