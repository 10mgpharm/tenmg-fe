import { HStack, Stack, Text } from "@chakra-ui/react";
import LoanManagement from "./_components/LoanManagement";

const Page = () => {
  return (
    <div className="p-8">
      <HStack justify={"space-between"}>
        <Text fontSize={"1.3rem"} fontWeight={700} color={"gray.900"}>
          Loan Management
        </Text>
      </HStack>
      <Stack>
        <LoanManagement />
      </Stack>
    </div>
  );
};

export default Page;
