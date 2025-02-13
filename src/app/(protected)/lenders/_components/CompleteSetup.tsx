import { convertLetterCase } from "@/utils";
import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import StatusBadge from "../../_components/StatusBadge";

interface CompleteSetupProps {
  title: string;
  description: string;
  status: "completed" | "pending";
}

const CompleteSetup = ({ title, description, status }: CompleteSetupProps) => {
  const statusView = {
    completed: (
      <StatusBadge status="Completed" bgColor="green.50" color="green.500" />
    ),
    pending: (
      <StatusBadge status="Pending" bgColor="warning.50" color="warning.600" />
    ),
  };

  const statusFilter = statusView[status] ?? null;

  return (
    <Box borderRadius="lg" p={4} borderWidth="1px">
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Text color="gray.800" fontSize="sm">{title}</Text>
          <Text color="gray.500" fontSize="xs">{description}</Text>
        </Box>

        <Box>{statusFilter}</Box>
      </Flex>
    </Box>
  );
};

export default CompleteSetup;
