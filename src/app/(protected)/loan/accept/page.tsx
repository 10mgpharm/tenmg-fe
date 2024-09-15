import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import React from "react";
import { TbCurrencyNaira } from "react-icons/tb";

const LoanAccept = () => {
  return (
    <VStack spacing={10}>
      <Center color="white">
        <Box>This is the Center</Box>
      </Center>
      <Flex alignItems="flex-end" justifyContent="center">
        <TbCurrencyNaira size="24px" />

        <Text fontSize={64} lineHeight={6}>
          50,000
        </Text>
      </Flex>

      <Box
        bgColor="warning.100"
        border="1px solid var(--tenmg-colors-warning-400)"
        p={4}
        borderRadius="md"
        my={6}
      >
        <VStack direction="column" spacing={4} textAlign="center">
          <Text fontSize="md" fontWeight="bold">
            Loan Period: 3 months
          </Text>
          <Text fontSize="md" fontWeight="bold">
            Interest Rate: 25%
          </Text>
          <Text fontSize="md" fontWeight="bold">
            Capital: ₦50,000.00
          </Text>

          <Text fontSize="md" fontWeight="bold">
            Interest Per Month: ₦15,000.00
          </Text>
          <Text fontSize="md" fontWeight="bold">
            Total Monthly Repayment: ₦15,000.00
          </Text>
        </VStack>
      </Box>

      <HStack>
        <Button size="lg" w="full" type="submit">
          Accept Offer
        </Button>
        <Button size="lg" w="full" type="submit">
          Decline Offer
        </Button>
      </HStack>
    </VStack>
  );
};

export default LoanAccept;
