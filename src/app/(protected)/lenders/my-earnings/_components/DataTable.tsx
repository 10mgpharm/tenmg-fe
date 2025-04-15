import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { MyEarningsColumn } from "./column";
import Pagination from "../../_components/Pagination";
import EmptyResult from "@/app/(protected)/vendors/_components/EmptyResult";
import shape from "@public/assets/images/Rectangle 43.svg";

type DataTableProps = {
  data: any;
  loading: boolean;
  pageCount: number;
  setPageCount: Dispatch<SetStateAction<number>>;
};

const DataTable = ({
  data: myEarningsData,
  loading,
  pageCount,
  setPageCount,
}: DataTableProps) => {
  const [selectedUserId, setSelectedUserId] = useState<null | string>(null);

  const {
    isOpen: isOpenDetails,
    onClose: onCloseDetials,
    onOpen: onOpenDetails,
  } = useDisclosure();

  const memoizedData = useMemo(() => myEarningsData, [myEarningsData]);

  const table = useReactTable({
    data: memoizedData,
    columns: MyEarningsColumn(onOpenDetails, setSelectedUserId),

    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Spinner size="md" />
      </Flex>
    );
  }

  return (
    <div>
      {myEarningsData?.length === 0 ? (
        <EmptyResult heading={`Nothing to show here`} content={``} />
      ) : (
        myEarningsData?.length > 0 && (
          <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
            <Table>
              <Thead bg="blue.50">
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers?.map((header) => (
                      <Th
                        textTransform={"initial"}
                        px="0px"
                        key={header.id}
                        color="primary.500"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody bg={"white"} color="#606060" fontSize={"14px"}>
                {table?.getRowModel()?.rows?.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells()?.map((cell) => (
                      <Td key={cell.id} px="0px">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Pagination
            //   meta={meta}
            //   setPageCount={setPageCount}
            />
          </TableContainer>
        )
      )}

      {/* product details modal */}
      <Drawer
        isOpen={isOpenDetails}
        placement="right"
        onClose={() => {
          onCloseDetials();
        }}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader className="capitalize">Interest Details</DrawerHeader>
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
            <Stack
              gap={4}
              mt={4}
              px={3}
              py={5}
              rounded={"md"}
              className="border"
            >
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
    </div>
  );
};

export default DataTable;
