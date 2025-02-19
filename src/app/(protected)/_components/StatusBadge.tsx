import { Badge, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface StatusBadgeProps {
  status: string;
  bgColor: string;
  color: string;
  isDot?: boolean;
}

const StatusBadge = ({ status, bgColor, color, isDot }: StatusBadgeProps) => {
  return (
    <Badge
      bgColor={bgColor}
      px={2}
      py={1}
      rounded="2xl"
      textTransform="none"
      fontWeight="medium"
    >
      <Flex gap={2} alignItems="center" borderRadius="lg">
        {!isDot && <Badge bgColor={color} p={1} rounded="lg" />}
        <Text color={color} fontSize="xs">
          {status}
        </Text>
      </Flex>
    </Badge>
  );
};

export default StatusBadge;
