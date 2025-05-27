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

const LoanTransactionDetails = ({
  isOpen,
  onClose,
  selectedRow,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  selectedRow?: any;
}) => {
  console.log(selectedRow, "seuejn");
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader className="capitalize">Transaction Details</DrawerHeader>
        <DrawerBody>
          <Text color={"gray.900"} fontWeight={600} fontSize={"1.4rem"}>
            ₦{Number(selectedRow?.amount)?.toLocaleString()}
          </Text>
          <Text fontSize={"13px"} color={"gray.500"}>
            {selectedRow?.createdAt}
          </Text>
          {type !== "sup_payout" && (
            <Stack mt={5}>
              <Text fontSize={"14px"} color={"gray.500"}>
                Details
              </Text>
              <div className="border p-2 rounded-md">
                <Text>{selectedRow?.description ?? "N/A"}</Text>
              </div>
            </Stack>
          )}
          <Stack gap={4} mt={4} px={3} py={5} rounded={"md"} className="border">
            <Flex justify={"space-between"}>
              <Text>Status</Text>
              <Tag
                colorScheme={
                  selectedRow?.status === "success"
                    ? "green"
                    : selectedRow?.status === "failed"
                    ? "red"
                    : "orange"
                }
                fontWeight={500}
              >
                {selectedRow?.status ?? "PENDING"}
              </Tag>
            </Flex>
            <Flex justify={"space-between"}>
              <Text>Wallet debited</Text>
              <Text fontWeight={500}>Admin</Text>
            </Flex>
            <Flex justify={"space-between"}>
              <Text>Transaction Type</Text>
              <Tag
                fontWeight={500}
                colorScheme={
                  selectedRow?.type === "CREDIT"
                    ? "green"
                    : selectedRow?.type === "DEBIT"
                    ? "red"
                    : "orange"
                }
              >
                {selectedRow?.type}
              </Tag>
            </Flex>
            <Flex justify={"space-between"}>
              <Text>Transaction ID</Text>
              <Text fontWeight={500}>{selectedRow?.identifier}</Text>
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

export default LoanTransactionDetails;
