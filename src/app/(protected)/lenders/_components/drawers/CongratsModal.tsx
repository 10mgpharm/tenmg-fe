import React from "react";
import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";

import SuccessIcon from "@public/assets/images/money-success.png";
import StatusBadge from "@/app/(protected)/_components/StatusBadge";
import { formatAmount } from "@/utils/formatAmount";
import { formatAmountString } from "@/utils";
import OperationLayout from "../OperationLayout";

const CongratsModal = ({
  isOpen,
  onClose,
  status,
  amount,
  isWithdraw,
}: {
  status?: string;
  amount?: number;
  isOpen: boolean;
  onClose: () => void;
  isWithdraw: boolean;
}) => { 
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <OperationLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Congratulations"
      description="Your funds have been successfully deposited into your account."
    >
      <Box>
        <Stack spacing={4} align="center">
          <Image src={SuccessIcon.src} alt="Success" width={200} height={200} />
        </Stack>
        <Text
          color={isWithdraw ? "red.500" : "green.500"}
          fontSize="4xl"
          fontWeight={700}
          mb={2}
        >
          {isWithdraw ? "-" : "+"} ₦
          {formatAmountString(amount) || "9,000"}
        </Text>
        <Text fontSize="sm" color="gray.600" fontWeight={400}>
          {formattedDate}, {formattedTime}
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
              <StatusBadge
                status="Completed"
                bgColor="green.50"
                color="green.500"
              />
            </Text>
          </Flex>

          <Flex justifyContent="space-between" alignItems="center">
            <Text>Wallet Credit</Text>
            <Text color="gray.500">Self</Text>
          </Flex>

          <Flex justify="space-between" alignItems="center">
            <Text fontWeight="semibold">Transaction Type</Text>
            <Text>DEPOSIT</Text>
          </Flex>

          <Flex justify="space-between" alignItems="center">
            <Text fontWeight="semibold">Amount</Text>
            <Text>₦{formatAmountString(amount) || "9,000"}</Text>
          </Flex>

          <Flex justify="space-between" alignItems="center">
            <Text fontWeight="semibold">Remark</Text>
            <Text>Funds deposit via Fincra</Text>
          </Flex>
        </Stack>
      </Box>
    </OperationLayout>
  );
};

export default CongratsModal;
