'use client';

import { Flex, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface Props {
  message?: string;
  children?: React.ReactNode;
  onLoadingComplete?: boolean;
}
const LoadingScreen = ({ message = 'Processing your request...', children, onLoadingComplete = false }: Props) => {

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (onLoadingComplete) {
      setIsLoading(!onLoadingComplete);
    }
  }, [onLoadingComplete])

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={10}
      paddingY="120px"
    >
      {isLoading && <Spinner
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
      />}

      <Text fontSize="lg">{message}</Text>

      {children}
    </Flex>
  );
};

export default LoadingScreen;
