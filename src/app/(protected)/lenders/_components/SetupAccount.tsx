import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

const SetupAccount = () => {

  const router = useRouter();


  return (
    <Box
      bg="gray.200"
      p={6}
      borderRadius="lg"
      boxShadow="md"
      mb={6}
      display={{ base: "block", md: "none" }}
    >
      <Flex alignItems="center" gap={2}>
        <Box>
          <Text
            as="h3"
            fontSize="sm"
            fontWeight={600}
            mb={2}
            color="primary.600"
          >
            Setup your Account
          </Text>
          <Text fontSize="xs" color="gray.600" mb={4}>
            Complete your account setup and explore <span className="text-[#25282E] font-bold">10MG Credit</span>{" "}
            unbelievable features
          </Text>
        </Box>
        <Box>
          <Button colorScheme="primary.500" fontSize="xs" size="sm" onClick={() => router.push("/lenders/settings/license-upload")}>
            Complete Setup
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default SetupAccount;
