import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";
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
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const TransactionDetails = ({
  isOpen,
  onClose,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  type?: string;
}) => {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    let query = `/admin/wallet/transactions/${userId}`;

    try {
      const response = await requestClient({ token: token }).get(query);

      if (response.status === 200) {
        setData(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [token, userId]);

  useEffect(() => {
    if (!userId) return;
    fetchData();
  }, [fetchData, userId]);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader className="capitalize">Transaction Details</DrawerHeader>
        <DrawerBody>
          <Text color={"gray.900"} fontWeight={600} fontSize={"1.4rem"}>
            ₦9000
          </Text>
          <Text fontSize={"13px"} color={"gray.500"}>
            Tue, 10 Sept 2024, 19:40
          </Text>
          <Stack mt={5}>
            <Text fontSize={"14px"} color={"gray.500"}>
              Details
            </Text>
            <div className="border p-2 rounded-md">
              <Text>Chudi Victor Ahmed</Text>
            </div>
          </Stack>
          <Stack gap={4} mt={4} px={3} py={5} rounded={"md"} className="border">
            <Flex justify={"space-between"}>
              <Text>Status</Text>
              <Tag colorScheme={"green"} fontWeight={500}>
                Completed
              </Tag>
            </Flex>
            <Flex justify={"space-between"}>
              <Text>Wallet debited</Text>
              <Text fontWeight={500}>Admin</Text>
            </Flex>
            <Flex justify={"space-between"}>
              <Text>Transaction Type</Text>
              <Text fontWeight={500}>NIP OUTWARD TRANSFER</Text>
            </Flex>
            <Flex justify={"space-between"}>
              <Text>SessionID</Text>
              <Text fontWeight={500}>00001324019929464</Text>
            </Flex>
            <Flex justify={"space-between"}>
              <Text>Remark</Text>
              <Text fontWeight={500}>00001324019929464</Text>
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
