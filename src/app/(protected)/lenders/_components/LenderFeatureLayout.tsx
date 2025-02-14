import { Box, Stack, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface LenderFeatureLayoutProps {
  title: string;
  children: ReactNode;
}

const LenderFeatureLayout = ({ title, children }: LenderFeatureLayoutProps) => {
  return (
    <Stack borderRadius="lg" p={6} borderWidth="1px" bg={"white"} spacing={6}>
      <Text fontSize="lg" fontWeight="medium">
        {title}
      </Text>

      {children}
    </Stack>
  );
};

export default LenderFeatureLayout;
