"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ColumnsFN } from "../../_components/trnascationtable";
import requestClient from "@/lib/requestClient"; // Adjust path as needed
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import ManualPagination from "../../../_components/ManualPagination";

const ITEMS_PER_PAGE = 10;

const TransactionRecord = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await requestClient({ token }).post(
        "vendor/txn_history/view",
        {
          transactionHistoryId: parseInt(params.id, 10),
        }
      );

      if (response.status === 200 && response.data.data) {
        setData(response.data.data);
      } else {
        setError("Failed to load data. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError("An unexpected error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && params.id) {
      fetchData();
    }
  }, [token, params.id]);

  const columns = useMemo(() => ColumnsFN(), []);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  const table = useReactTable({
    data: currentData || [],
    columns,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE) || 1;

  const meta = {
    currentPage,
    first: `?page=1`,
    last: `?page=${totalPages}`,
    prev: currentPage > 1 ? `?page=${currentPage - 1}` : null,
    next: currentPage < totalPages ? `?page=${currentPage + 1}` : null,
    links: [
      {
        url: currentPage > 1 ? `?page=${currentPage - 1}` : null,
        label: "Previous",
        active: false,
      },
      ...Array.from({ length: totalPages }, (_, i) => ({
        label: (i + 1).toString(),
        url: `?page=${i + 1}`,
        active: currentPage === i + 1,
      })),
      {
        url: currentPage < totalPages ? `?page=${currentPage + 1}` : null,
        label: "Next",
        active: false,
      },
    ],
  };

  return (
    <div className="p-8">
      <Flex
        cursor={"pointer"}
        onClick={() => router.back()}
        align={"center"}
        gap={2}
      >
        <ArrowLeft className="w-5 h-auto text-gray-500" />
        <Text fontSize={"14px"} color={"gray.600"}>
          Back
        </Text>
      </Flex>

      {loading && (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      )}

      {error && !loading && (
        <Center mt={10}>
          <Text color="red.500">{error}</Text>
        </Center>
      )}

      {!loading && !error && data.length > 0 && (
        <>
          <TableContainer
            border={"1px solid #F9FAFB"}
            borderRadius={"10px"}
            mt={5}
          >
            <Table>
              <Thead bg={"blue.50"}>
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers?.map((header) => (
                      <Th
                        textTransform={"initial"}
                        px="0px"
                        key={header.id}
                        color={"primary.500"}
                        fontWeight={"500"}
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
                <Tr>
                  <Td py={4} w="full" colSpan={columns.length}>
                    <ManualPagination
                      meta={meta}
                      setPageCount={setCurrentPage}
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}

      {!loading && !error && data.length === 0 && (
        <Center mt={10}>
          <Text>No transaction records found.</Text>
        </Center>
      )}
    </div>
  );
};

export default TransactionRecord;
