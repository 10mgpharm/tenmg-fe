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
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
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

// Props or get params as needed (e.g., from parent or route)
const TransactionRecord = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch data function
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
        // Assuming response.data.data is an array of transactions
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

  // Fetch data on mount or when params.id changes
  useEffect(() => {
    if (token && params.id) {
      fetchData();
    }
  }, [token, params.id]);

  const columns = useMemo(() => ColumnsFN(), []);

  const table = useReactTable({
    data: data || [],
    columns,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

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

      {/* Loading State */}
      {loading && (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      )}

      {/* Error State */}
      {error && !loading && (
        <Center mt={10}>
          <Text color="red.500">{error}</Text>
        </Center>
      )}

      {/* Table Display */}
      {!loading && !error && data.length > 0 && (
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
                <Td py={4} w="full" colSpan={6}>
                  {/* Pagination component if needed 
                      <Pagination meta={tableData} setPageCount={setPageCount} />
                  */}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {/* No Data State */}
      {!loading && !error && data.length === 0 && (
        <Center mt={10}>
          <Text>No transaction records found.</Text>
        </Center>
      )}
    </div>
  );
};

export default TransactionRecord;
