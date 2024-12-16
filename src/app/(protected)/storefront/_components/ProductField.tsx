import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import StoreProductCardComponent from "./StoreProductCardComponent";
import Link from "next/link";



const ProductsField = ({ category }: any) => {

  console.log("category", category);
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
        <Text fontSize="lg" className="capitalize">{category?.name}</Text>
        <Button variant="link" color="white" _hover={{ textDecoration: 'underline' }}>
          <Link href={`/storefront/${category?.name}`}>
            SEE ALL
          </Link>
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
        {category?.products?.map((product, index) => (
          <StoreProductCardComponent key={index} product={product} />
        ))}
      </Flex>
    </Box>
  );
};

export default ProductsField;
