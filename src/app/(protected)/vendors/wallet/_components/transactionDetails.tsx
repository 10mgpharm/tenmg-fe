import { cn } from "@/lib/utils";
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
            ₦{data?.amount}
          </Text>
          <Text fontSize={"13px"} color={"gray.500"}>
            {convertDateWithTime(data?.createdAt)}
          </Text>
          <Stack mt={5}>
            <Text fontSize={"14px"} color={"gray.500"}>
              Details
            </Text>
            <div className="border p-2 rounded-md">
              <Text>{data?.customer?.name}</Text>
            </div>
          </Stack>
          <Stack gap={4} mt={4} px={3} py={5} rounded={"md"} className="border">
            <Flex justify={"space-between"}>
              <Text>Status</Text>
              <Tag
                colorScheme={data?.status ? "green" : "orange"}
                fontWeight={500}
              >
                {data?.status.toUpperCase()}
              </Tag>
            </Flex>
            <Flex justify={"space-between"}>
              <Text>Business Type</Text>
              <Text fontWeight={500}>{data?.businessId?.type}</Text>
            </Flex>
            <Flex justify={"space-between"}>
              <Text>Transaction Type</Text>
              <Text
                fontWeight={500}
                className={cn(
                  data?.type === "CREDIT" ? "text-green-500" : "text-red-500"
                )}
              >
                {data?.type}
              </Text>
            </Flex>
            <Flex justify={"space-between"}>
              <Text>Identifier</Text>
              <Text fontWeight={500}>{data?.identifier}</Text>
            </Flex>
            <Flex justify={"space-between"}>
              <Text>Description</Text>
              <Text fontWeight={400}>{data?.description}</Text>
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

export default TransactionDetails;
