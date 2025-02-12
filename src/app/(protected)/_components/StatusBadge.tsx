import { Badge, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface StatusBadgeProps {
  status: string;
  bgColor: string;
  color: string;
}

const StatusBadge = ({ status, bgColor, color }: StatusBadgeProps) => {
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
        <Badge bgColor={color} p={1} rounded="lg" />
        <Text color={color} fontSize="xs">
          {status}
        </Text>
      </Flex>
    </Badge>
  );
};

export default StatusBadge;
