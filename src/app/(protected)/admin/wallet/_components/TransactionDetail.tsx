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

const TransactionDetails = ({
  isOpen,
  onClose,
  selectedRow,
  type,
  orderId,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  orderId?: any;
  selectedRow?: any;
}) => {
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
                  {type === "loan-wallet"
                    ? selectedRow?.business?.name ?? "N/A"
                    : selectedRow?.name ?? "N/A"}
                </Text>
              </div>
            </Stack>
          )}
          <Stack gap={4} mt={4} px={3} py={5} rounded={"md"} className="border">
            {type === "transaction" ||
            type === "loan-wallet" ||
            type === "supplier-wallet" ? (
              <Flex justify={"space-between"}>
                <Text>Transaction Type</Text>
                <Tag
                  colorScheme={
                    selectedRow?.txnType === "CREDIT" ||
                    selectedRow?.type === "CREDIT"
                      ? "green"
                      : selectedRow?.txnType === "DEBIT" ||
                        selectedRow?.type === "DEBIT"
                      ? "red"
                      : "orange"
                  }
                  fontWeight={500}
                >
                  {type === "transaction" || type === "supplier-wallet"
                    ? selectedRow?.status
                    : selectedRow?.type}
                </Tag>
              </Flex>
            ) : (
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
                  {selectedRow?.status === "CREDIT"
                    ? "PAID"
                    : selectedRow?.status === "DEBIT"
                    ? "NOT PAID"
                    : selectedRow?.order?.status === "PROCESSING"
                    ? "PENDING"
                    : selectedRow?.order?.status}
                </Tag>
              </Flex>
            )}
            {type !== "sup_payout" && (
              <Flex justify={"space-between"}>
                <Text>Transaction Description</Text>
                <Text fontWeight={500}>
                  {selectedRow?.txnGroup === "DEBIT_ON_ORDER_CANCELLATION" ||
                  selectedRow?.txnGroup ===
                    "DEBIT_COMMISSION_ON_ORDER_CANCELLATION"
                    ? "Order Cancelled"
                    : selectedRow?.txnGroup === "CREDIT_ON_ORDER_COMPLETION"
                    ? "Order Completed"
                    : selectedRow?.txnGroup ===
                      "CREDIT_COMMISSION_ON_ORDER_COMPLETION"
                    ? "Commission On Order Completed"
                    : selectedRow?.txnGroup === "WITHDRAW_TO_BANK"
                    ? "Withdraw"
                    : selectedRow?.transactionGroup === "payout"
                    ? "Payout"
                    : selectedRow?.transactionGroup === "repayment_interest"
                    ? "Payment Interest"
                    : selectedRow?.transactionGroup === "loan_interest"
                    ? "Loan Interest"
                    : selectedRow?.transactionGroup === "loan_disbursement"
                    ? "Loan Disbursement"
                    : selectedRow?.description}
                </Text>
              </Flex>
            )}
            {orderId && (
              <Flex justify={"space-between"}>
                <Text>OrderID</Text>
                <Text fontWeight={500}>
                  {/* {type === "sup_payout" ? (selectedRow?.id ?? "N/A") : type === "loan-wallet" ? (selectedRow?.identifier ?? "N/A") : (selectedRow?.order?.identifier ?? "N/A")} */}
                  {orderId}
                </Text>
              </Flex>
            )}
            {/* <Flex justify={"space-between"}>
              <Text>Tenmg Commission</Text>
              <Text fontWeight={500}>
                ₦{selectedRow?.tenmgCommission ?? "0.00"}
              </Text>
            </Flex> */}
          </Stack>
        </DrawerBody>
        <DrawerFooter p={0}>
          <Image src={shape} alt="" />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TransactionDetails;
