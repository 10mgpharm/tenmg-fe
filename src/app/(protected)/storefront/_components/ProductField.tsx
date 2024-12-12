import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import StoreProductCardComponent from "./StoreProductCardComponent";

const ProductsField = ({ title }: { title?: string }) => {
  return (
    <Box className="">
      <Flex
        justifyContent="space-between"
        py={4}
        bgColor="success.500"
        className="px-6 md:px-20 max-w-screen-2xl mx-auto"
        color="white"
        mb={8}
      >
        <Text fontSize="lg">{title}</Text>
        <Button variant="link" color="white" _hover={{ textDecoration: 'underline' }}>
          SEE ALL
        </Button>
      </Flex>

      <Flex
        overflowX="auto"
        gap={6}
        className="px-6 md:px-20 max-w-screen-2xl mx-auto"
        py={2}
        mb={8}
        sx={{
          '::-webkit-scrollbar': {
            display: 'none'
          },
          '-ms-overflow-style': 'none', 
          'scrollbar-width': 'none'     
        }}
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <StoreProductCardComponent key={index} />
        ))}
      </Flex>
    </Box>
  );
};

export default ProductsField;
