"use client";
import {
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { Loader, Plus, Search } from "lucide-react";
import { useState } from "react";
import { NextAuthUserSession } from "@/types";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import { ShippingFeeDataType } from "../page";
import AddNewFee from "./AddNewFee";

const ShippingFeeTable = ({
  setShippingFeeData,
  shippingFeeData,
}: {
  setShippingFeeData: (value: ShippingFeeDataType) => void;
  shippingFeeData: ShippingFeeDataType;
}) => {
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;
  const [isLoading, setIsLoading] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const data = shippingFeeData.locations ?? [];

  // const handleDelete = async () => {
  //   try {
  //     // delete function
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.error(error);
  //     toast.error(handleServerErrorMessage(error));
  //   }
  // };

  return (
    <Stack flex={1} className="mt-10">
      <Flex justify={"space-between"}>
        <InputGroup size="md" width={"20rem"} shadow={"sm"}>
          <InputLeftElement pl={1}>
            <Icon as={Search} className="w-5 h-5" />
          </InputLeftElement>
          <Input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            pl={10}
            placeholder={`Search by location`}
          />
        </InputGroup>
        <Button
          h="38px"
          onClick={onOpen}
          bg={"primary.500"}
          className="flex items-center gap-2"
        >
          <Plus size={20} /> Add
        </Button>
      </Flex>
      {isLoading ? (
        <Loader />
      ) : data?.length === 0 ? (
        <EmptyOrder
          heading={`No custome fee set Yet`}
          content={`You currently have not set your custom fees for different locaton.`}
        />
      ) : (
        <Stack minH={"500px"} mt={5}>
          <TableContainer rounded={"md"}>
            <Table
              variant="simple"
              border={"1px solid #EAECF0"}
              shadow={"sm"}
              rounded={"md"}
            >
              <Thead bg={"#E8F1F8"}>
                <Tr color={"primary.500"} roundedTop={"md"}>
                  <Th>Country</Th>
                  <Th>State</Th>
                  <Th>City</Th>
                  <Th>Address</Th>
                  <Th>Amount</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((item, key) => (
                  <Tr key={key}>
                    <Td py={1} lineHeight={3} fontSize={"14px"}>
                      {item.country}
                    </Td>
                    <Td py={1} lineHeight={3} fontSize={"14px"}>
                      {item.state}
                    </Td>
                    <Td py={1} lineHeight={3} fontSize={"13px"}>
                      {item.city}
                    </Td>
                    <Td py={1} lineHeight={3} fontSize={"14px"}>
                      {item.address}
                    </Td>
                    <Td py={1} lineHeight={3} fontSize={"14px"}>
                      ₦{item.amount}
                    </Td>
                    <Td py={1} lineHeight={3} fontSize={"14px"}>
                      <Flex gap={2}>
                        <Button
                          fontSize={"14px"}
                          cursor={"pointer"}
                          variant={"unstyled"}
                          color={"gray.500"}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="unstyled"
                          fontSize={"14px"}
                          color={"red.600"}
                          cursor={"pointer"}
                        >
                          Delete
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination meta={{}} setPageCount={setPageCount} />
          </TableContainer>
        </Stack>
      )}

      <AddNewFee
        open={isOpen}
        onClose={onClose}
        setIsOpen={onOpen}
        setShippingFeeData={setShippingFeeData}
        shippingFeeData={shippingFeeData}
      />
    </Stack>
  );
};

export default ShippingFeeTable;
