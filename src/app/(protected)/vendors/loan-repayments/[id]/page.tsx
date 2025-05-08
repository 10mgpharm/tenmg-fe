"use client";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import { repaymentData } from "@/data/mockdata";
import {
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Divider,
  Flex,
  Progress,
  Stack,
  Text,
  ThemeProvider,
  extendTheme,
  chakra,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ColumsRepaymentFN } from "@/app/(protected)/admin/loan-repayment/_components/column";

const theme = extendTheme({
  components: {
    Progress: {
      baseStyle: {
        track: {
          borderRadius: "10px",
        },
        filledTrack: {
          bg: "#F89422",
          track: {
            borderRadius: "0px",
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
          },
        },
      },
    },
  },
});

const Page = () => {
  const router = useRouter();
  const onOpen = () => {};
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pageCount, setPageCount] = useState(1);
  // const memoizedData = useMemo(() => data, [data]);

  const table = useReactTable({
    data: repaymentData,
    columns: ColumsRepaymentFN(onOpen, pageCount),
    onSortingChange: setSorting,
    state: {
      sorting,
      columnVisibility,
      columnOrder,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <div className="p-8">
      <Flex cursor={"pointer"} gap={2} onClick={() => router.back()}>
        <ArrowLeft className="w-5 h-auto text-gray-600" />
        <Text>Back</Text>
      </Flex>
      <Stack mt={4} gap={0.5}>
        <Text fontSize={"1.2rem"} fontWeight={600}>
          Jude&apos;s Loan Information
        </Text>
        <Text fontSize={"15px"} color={"gray.600"}>
          At a glance summary of Jude’s Loan.
        </Text>
      </Stack>
      <Stack mt={4} className="p-5 rounded-md border bg-white">
        <Flex justify={"space-between"} mb={3}>
          <Stack>
            <Text fontSize={"15px"} color={"gray.500"}>
              Loan Amount
            </Text>
            <Text fontWeight={500} fontSize={"1.2rem"}>
              ₦ 123,849,900
            </Text>
          </Stack>
          <Stack>
            <Text fontSize={"15px"} color={"gray.500"}>
              Loan Interest
            </Text>
            <Text fontWeight={500} fontSize={"1.2rem"}>
              ₦ 123,849,900
            </Text>
          </Stack>
          <Stack>
            <Text fontSize={"15px"} color={"gray.500"}>
              Total Repayment
            </Text>
            <Text fontWeight={500} fontSize={"1.2rem"}>
              ₦ 123,849,900
            </Text>
          </Stack>
          <Stack>
            <Text fontSize={"15px"} color={"gray.500"}>
              Duration
            </Text>
            <Text fontWeight={500} fontSize={"1.2rem"}>
              1 year
            </Text>
          </Stack>
          <Stack>
            <Text fontSize={"15px"} color={"gray.500"}>
              Start Date
            </Text>
            <Text fontWeight={500} fontSize={"1.2rem"}>
              1st of July, 2023
            </Text>
          </Stack>
          <Stack>
            <Text fontSize={"15px"} color={"gray.500"}>
              End Date
            </Text>
            <Text fontWeight={500} fontSize={"1.2rem"}>
              1st of July, 2023
            </Text>
          </Stack>
        </Flex>
        <Divider />
        <Stack mt={3} maxW={"60%"}>
          <Text fontWeight={600} fontSize={"1rem"} mb={2}>
            Status
          </Text>
          <ThemeProvider theme={theme}>
            <Progress h={"34px"} value={70} pos={"relative"}>
              <chakra.span className="text-white text-center text-sm absolute top-2 inset-x-0">
                Repayment in Progress - 75% Complete
              </chakra.span>
            </Progress>
          </ThemeProvider>
        </Stack>
      </Stack>
      <Stack mt={6}>
        <Text fontWeight={600} fontSize={"1.2rem"} mb={2}>
          Repayment History
        </Text>
        <div className="">
          {repaymentData?.length === 0 ? (
            <EmptyOrder
              heading={`No repayment history Yet`}
              content={`You currently have no repayment history. All repayment history will appear here.`}
            />
          ) : (
            <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
              <Table>
                <Thead bg={"#F2F4F7"}>
                  {table?.getHeaderGroups()?.map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers?.map((header) => (
                        <Th textTransform={"initial"} px="0px" key={header.id}>
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
              {/* <HStack mt={5} justify={"space-between"}>
                        <Flex alignItems={"center"} gap={2}>
                            <FaChevronLeft className='text-gray-500' />
                            <Text className='text-gray-500'>Prev</Text>
                        </Flex>
                        {
                            LoanData?.length > 10 ? <Pagination />
                            :  <span className="bg-primary-50 py-2 px-4 rounded-md text-primary-600 cursor-pointer">1</span>
                        }
                        <Flex alignItems={"center"} gap={2}>
                            <Text className='text-gray-500'>Next</Text>
                            <FaChevronRight className='text-gray-500' />
                        </Flex>
                    </HStack> */}
            </TableContainer>
          )}
        </div>
      </Stack>
    </div>
  );
};

export default Page;
