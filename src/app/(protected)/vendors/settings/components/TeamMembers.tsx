import {
  Button,
  Flex,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EmptyOrder from "@/app/(protected)/suppliers/orders/components/EmptyOrder";
import { MemberData } from "@/data/mockdata";
import { ColumnsMemberFN } from "./table";
import Pagination from "@/app/(protected)/suppliers/components/Pagination";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import InviteMember from "@/app/(protected)/admin/settings/components/InviteMember";
import requestClient from "@/lib/requestClient";
import { handleServerErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import { SubmitHandler } from "react-hook-form";

interface IFormInput {
  fullName: string;
  email: string;
  role: "admin" | "operator" | "support";
}

const Members = ({
  allMembersData,
  fetchTeamMembers,
  token,
}: {
  allMembersData: [];
  fetchTeamMembers: () => void;
  token: string
}) => {

  const { onOpen, onClose, isOpen } = useDisclosure();
  const { onOpen: onOpenRemove } = useDisclosure();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const table = useReactTable({
    data: allMembersData,
    columns: ColumnsMemberFN(onOpenRemove),
    onSortingChange: setSorting,
    state: {
      sorting,
      columnOrder,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setIsLoading(true);
      const response = await requestClient({token: token}).post(
        "/vendor/settings/invite",
        data
      );
      if (response.status === 200) {
        toast.success(response?.data?.message);
        fetchTeamMembers();
        onClose();
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(handleServerErrorMessage(error));
    }
  };

  return (
    <div>
      <HStack justify="flex-end">
        <Button onClick={onOpen} fontSize="15px" h="38px" px={3}>
          <Plus className="w-5 h-auto mr-1" /> Add Team Member
        </Button>
      </HStack>
      <div className="mt-5">
        {allMembersData?.length === 0 ? (
          <EmptyOrder />
        ) : (
          <TableContainer border="1px solid #F9FAFB" borderRadius="10px">
            <Table>
              <Thead bg="blue.50">
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers?.map((header) => (
                      <Th textTransform="initial" px="12px" key={header.id}>
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
              <Tbody bg="white" color="#606060" fontSize="14px">
                {table?.getRowModel()?.rows?.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells()?.map((cell) => (
                      <Td key={cell.id} px="12px">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
                <Tr>
                  <Td py={4} w="full" colSpan={5}>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Button
                        variant="outline"
                        color="gray.500"
                        leftIcon={<FaArrowLeft />}
                      >
                        Previous
                      </Button>
                      <Pagination />
                      <Button
                        variant="outline"
                        color="gray.500"
                        rightIcon={<FaArrowRight />}
                      >
                        Next
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </div>
      <InviteMember
        onClose={onClose}
        isOpen={isOpen}
        accountType="vendor"
        isLoading={isLoading}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default Members;
