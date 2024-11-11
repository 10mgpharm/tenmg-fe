"use client";
import { CiFilter } from "react-icons/ci"
import SearchInput from "../components/SearchInput"
import { 
  Button, 
  Flex, 
  Link, 
  Spinner, 
  Table, 
  TableContainer, 
  Tbody, 
  Td, 
  Th, 
  Thead, 
  Tr, 
  useDisclosure 
} from "@chakra-ui/react"
import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyResult from "../components/EmptyResult";
import { useSession } from "next-auth/react";
import { LoanData, NextAuthUserSession } from "@/types";
import { useDebouncedValue } from "@/utils/debounce";
import requestClient from "@/lib/requestClient";
import CreateLoan from "./components/CreateLoan";
import { 
  flexRender, 
  getCoreRowModel, 
  getFilteredRowModel, 
  useReactTable 
} from "@tanstack/react-table";
import Pagination from "../../suppliers/components/Pagination";
import { ColumnsLoanApplicationFN } from "./components/table";

const LoanApplication = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [loanApplication, setLoanApplication] = useState<LoanData[]>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const [pageCount, setPageCount] = useState<number>(1);
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchLoanApplication = useCallback(async () => {
    setLoading(true);
    let query = `/vendor/loan-applications?page=${pageCount}`;

    if (debouncedSearch) {
      query += `&search=${debouncedSearch}`;
    }
    if (status) {
      query += `&status=${status}`;
    }
    if (createdAtStart) {
      query += `&createdAtStart=${createdAtStart.toISOString().split("T")[0]}`;
    }
    if (createdAtEnd) {
      query += `&createdAtEnd=${createdAtEnd.toISOString().split("T")[0]}`;
    }

    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setLoanApplication(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, pageCount, debouncedSearch, status, createdAtStart, createdAtEnd]);

  const tableData = useMemo(
    () => loanApplication,
    [loanApplication]
  );

  useEffect(() => {
    if(!token) return;
    fetchLoanApplication();
  }, [fetchLoanApplication, token]);

  const table = useReactTable({
    data: tableData ? tableData : [],
    columns: ColumnsLoanApplicationFN(),
    state: {
      globalFilter,
    },
    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-8">
      <h3 className="font-semibold text-2xl">Loan Application</h3>
      <div className="flex justify-between">
        <div className="mb-5">
          <div className="flex items-center gap-3 mt-5">
            <SearchInput
              placeholder="Search for a loan"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <div
              onClick={onOpenFilter}
              className="border cursor-pointer border-gray-300 p-3 rounded-md flex items-center gap-2"
            >
              <CiFilter className="w-5 h-5" />
              <p className="text-gray-500 font-medium">Filter</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" color="primary.500" as={Link} href={"/vendors/customers-management/new"}>
            Send Application Link
          </Button>
          <Button onClick={onOpen}>
            Create Application
          </Button>
        </div>
      </div>
      <div className="">
        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : tableData && tableData?.length === 0 ? (
          <EmptyResult
            heading={`Nothing to show here yet`}
            content={`You don’t have any customer yet. When you do, they’ll appear here.`}
          />
        ) : (
          <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
          <Table>
            <Thead bg={"blue.50"}>
              {tableData && table?.getHeaderGroups()?.map((headerGroup) => (
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
              {tableData?.length && table?.getRowModel()?.rows?.map((row) => (
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
                  <Pagination meta={tableData} setPageCount={setPageCount} />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        )
      }
      </div>
      <CreateLoan 
      isOpen={isOpen} 
      onClose={onClose}
      fetchLoanApplication={fetchLoanApplication}
      />
    </div>
  )
}

export default LoanApplication