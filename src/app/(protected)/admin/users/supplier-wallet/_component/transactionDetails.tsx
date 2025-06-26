import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Stack,
  Flex,
  Tag,
} from "@chakra-ui/react";

import shape from "@public/assets/images/Rectangle 43.svg";
import Image from "next/image";

const SupplierWalletTransactionDetails = ({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader className="capitalize">Transaction Details</DrawerHeader>
        <DrawerBody>
          <Text color={"gray.900"} fontWeight={600} fontSize={"1.4rem"}>
            ₦1500.00
          </Text>
          <Text fontSize={"13px"} color={"gray.500"}>
            18 June 2025, 7:58 AM
          </Text>

          <Stack mt={5}>
            <Text fontSize={"14px"} color={"gray.500"}>
              Details
            </Text>
            <div className="border p-2 rounded-md">
              <Text>Transaction</Text>
            </div>
          </Stack>

          <Stack gap={4} mt={4} px={3} py={5} rounded={"md"} className="border">
            <Flex justify={"space-between"}>
              <Text>Transaction Type</Text>
              <Tag
                colorScheme={
                  data?.txnType === "CREDIT" || data?.type === "CREDIT"
                    ? "green"
                    : data?.txnType === "DEBIT" || data?.type === "DEBIT"
                    ? "red"
                    : "orange"
                }
                fontWeight={500}
              >
                Debit
              </Tag>
            </Flex>

            <Flex justify={"space-between"}>
              <Text>Status</Text>
              <Tag
                colorScheme={
                  data?.txnType === "CREDIT" || data?.status === "success"
                    ? "green"
                    : data?.txnType === "DEBIT"
                    ? "red"
                    : "orange"
                }
                fontWeight={500}
              >
                Pending
              </Tag>
            </Flex>

            <Flex justify={"space-between"}>
              <Text>Transaction Description</Text>
              <Text fontWeight={500}>Withdrawal</Text>
            </Flex>

            <Flex justify={"space-between"}>
              <Text>Transaction ID</Text>
              <Text fontWeight={500}>TTH-20250618-075849-XBWU</Text>
            </Flex>
          </Stack>
        </DrawerBody>
        <DrawerFooter p={0}>
          <Image src={shape} alt="" />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SupplierWalletTransactionDetails;
