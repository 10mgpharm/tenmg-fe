import React from "react";
import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";

import SuccessIcon from "@public/assets/images/money-failed.png";
import StatusBadge from "@/app/(protected)/_components/StatusBadge";

const FailedModal = ({ amount }: { amount: number }) => {
  return (
    <Box>
      <Stack spacing={4} align="center">
        <Image src={SuccessIcon.src} alt="Failed" width={200} height={200} />
      </Stack>
      <Text color="red.500" fontSize="4xl" fontWeight={700} mb={2}>
        ${amount}
      </Text>

      <Stack
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        fontSize="sm"
        fontWeight={500}
        p={4}
        color="gray.600"
        spacing={4}
        mt={6}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Text>Status</Text>
          <Text fontWeight={700} color="gray.900">
            <StatusBadge status="Failed" bgColor="red.50" color="red.500" />
          </Text>
        </Flex>

        <Flex justifyContent="space-between" alignItems="center">
          <Text>Wallet Credit</Text>

          <Text color="gray.500">Self</Text>
        </Flex>

        <Flex justify="space-between" alignItems="center">
          <Text fontWeight="semibold">Transaction Type</Text>
          <Text>NIP OUTWARD TRANSFER</Text>
        </Flex>

        <Flex justify="space-between" alignItems="center">
          <Text fontWeight="semibold">SessionID</Text>
          <Text>00001324019929464</Text>
        </Flex>

        <Flex justify="space-between" alignItems="center">
          <Text fontWeight="semibold">Remark</Text>
          <Text>00001324019929464</Text>
        </Flex>
      </Stack>
    </Box>
  );
};

export default FailedModal;
