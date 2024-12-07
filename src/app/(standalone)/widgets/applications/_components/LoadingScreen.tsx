import { Flex, Spinner, Text } from "@chakra-ui/react";
import React from "react";

const LoadingScreen = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={10}
      paddingY="120px"
    >
      <Spinner
        thickness="28px"
        speed="0.65s"
        emptyColor="gray.200"
        size="xl"
        sx={{
          borderColor: "error.500",
          borderRightColor: "primary.500",
          borderBottomColor: "success.500",
          borderLeftColor: "warning.400",
          borderRadius: "50%",
          width: "8rem",
          height: "8rem",
        }}
      />

      <Text fontSize="lg">Processing your request...</Text>
    </Flex>
  );
};

export default LoadingScreen;
