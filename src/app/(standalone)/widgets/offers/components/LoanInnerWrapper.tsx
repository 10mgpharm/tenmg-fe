import { Box, Center, Heading, Text, VStack } from "@chakra-ui/react";
import React from "react";

interface InnerProps {
  headerIcon: React.ReactNode;
  heading: string;
  text?: string;
}

const LoanInnerWrapper = ({ headerIcon, heading, text }: InnerProps) => {
  return (
    <VStack spacing={10}>
      <Center mb={3}>{headerIcon}</Center>
      <Box>
        <Heading
          as="h3"
          fontSize="xl"
          fontWeight="medium"
          textAlign="center"
          color="gray.900"
          mb={2}
        >
          {heading}
        </Heading>

        <Text textAlign="center" fontSize="sm">
          {text}
        </Text>
      </Box>
    </VStack>
  );
};

export default LoanInnerWrapper;
