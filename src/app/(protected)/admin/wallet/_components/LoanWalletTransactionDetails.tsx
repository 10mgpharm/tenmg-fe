import { convertDateWithTime } from "@/utils/formatDate";
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

const LoanWalletTransactionDetails = ({
  isOpen,
  onClose,
  selectedRow,
  type,
  detailsType,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  selectedRow?: any;
  detailsType: "credit" | "repayment";
}) => {
  console.log(type, selectedRow);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader className="capitalize">Transaction Details</DrawerHeader>
        <DrawerBody>
          <Text color={"gray.900"} fontWeight={600} fontSize={"1.4rem"}>
            ₦
            {type === "sup_payout"
              ? Number(selectedRow?.actualPrice)?.toLocaleString()
              : Number(selectedRow?.amount)?.toLocaleString()}
          </Text>
          <Text fontSize={"13px"} color={"gray.500"}>
            {convertDateWithTime(selectedRow?.createdAt)}
          </Text>
          {type !== "sup_payout" && (
            <Stack mt={5}>
              <Text fontSize={"14px"} color={"gray.500"}>
                Details
              </Text>
              <div className="border p-2 rounded-md">
                <Text>
                  {detailsType === "credit"
                    ? selectedRow?.business?.name
                    : selectedRow?.description}
                </Text>
              </div>
            </Stack>
          )}
          <Stack gap={4} mt={4} px={3} py={5} rounded={"md"} className="border">
            <Flex justify={"space-between"}>
              <Text>Status</Text>
              <Tag
                colorScheme={
                  selectedRow?.txnType === "CREDIT" ||
                  selectedRow?.status === "success"
                    ? "green"
                    : selectedRow?.txnType === "DEBIT"
                    ? "red"
                    : "orange"
                }
                fontWeight={500}
              >
                {selectedRow?.status}
              </Tag>
            </Flex>

            <Flex justify={"space-between"}>
              <Text>Transaction Type</Text>
              <Tag
                colorScheme={
                  selectedRow?.type === "CREDIT"
                    ? "green"
                    : selectedRow?.type === "DEBIT"
                    ? "red"
                    : "orange"
                }
                fontWeight={500}
              >
                {selectedRow?.type}
              </Tag>
            </Flex>
            <Flex justify={"space-between"}>
              <Text>Transaction ID</Text>
              <Text fontWeight={500}>
                {type === "sup_payout"
                  ? selectedRow?.id ?? "N/A"
                  : type === "loan-wallet"
                  ? selectedRow?.identifier ?? "N/A"
                  : selectedRow?.order?.identifier ?? "N/A"}
              </Text>
            </Flex>
            {detailsType === "credit" && (
              <Flex justify={"space-between"}>
                <Text>Tenmg Commission</Text>
                <Text fontWeight={500}>
                  ₦{selectedRow?.tenmgCommission ?? "0.00"}
                </Text>
              </Flex>
            )}
          </Stack>
        </DrawerBody>
        <DrawerFooter p={0}>
          <Image src={shape} alt="" />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default LoanWalletTransactionDetails;
