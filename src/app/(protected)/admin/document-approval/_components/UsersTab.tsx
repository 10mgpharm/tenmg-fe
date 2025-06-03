"use client";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import {
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
import {
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { ColumnsAllFN } from "./table";
import {
  AdminApprovals,
  AdminApprovalsProps,
  NextAuthUserSession,
} from "@/types";
import { FaSpinner } from "react-icons/fa6";
import RequestDrawer from "./RequestDrawer";
import { ColumnsVendorFN } from "./VendorTable";
import { ColumnsPharmFN } from "./PharmacyTable";
import { ColumnsSupplierFN } from "./SupplierTable";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { useSession } from "next-auth/react";
import DeleteModal from "./DeleteModal";
import EmptyRequest from "./EmptyRequest";

interface UsersTabProps {
  data: AdminApprovalsProps;
  type: string;
  isLoading: boolean;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  setPageCount: Dispatch<SetStateAction<number>>;
  pageCount: number;
  fetchTeamUser: (reqType: string, page: number) => void;
}

const UsersTab = ({
  data,
  type,
  isLoading,
  setPageCount,
  pageCount,
  fetchTeamUser,
  globalFilter,
  setGlobalFilter,
}: UsersTabProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [approvalData, setApprovalData] = useState<AdminApprovals>();
  const [requestId, setRequestId] = useState<number>();
  const [isApprovingLoading, setIsApprovalLoading] = useState<boolean>(false);
  const [isLoadingDecline, setIsLoadingDecline] = useState<boolean>(false);

  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: onOpenDelete,
    isOpen: isOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const records = useMemo(() => data?.data || [], [data?.data]);

  const handleData = (id: number) => {
    setRequestId(id);
    const selected = records.find((item) => item.id === id);
    if (selected) {
      setApprovalData(selected);
      onOpen();
    }
  };

  const handleAcceptRequest = async (id: number) => {
    if (!token) return;
    try {
      setIsApprovalLoading(true);
      const response = await requestClient({ token }).patch(
        `admin/business/licenses/${id}/status`,
        {
          status: "APPROVED",
          comment: "Approved by admin",
        }
      );
      setIsApprovalLoading(false);
      if (response.status === 200) {
        toast.success(response.data.message);
        // fetchTeamUser(type, pageCount);
        fetchTeamUser("", pageCount);
        fetchTeamUser("Supplier", pageCount);
        fetchTeamUser("Vendor", pageCount);
        fetchTeamUser("Pharmacy", pageCount);
        fetchTeamUser("Lender", pageCount);
      }
    } catch (error) {
      setIsApprovalLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const handleCommentDeleteRequest = async (comment: string) => {
    if (!token || !requestId) return;
    setIsLoadingDecline(true);
    try {
      const response = await requestClient({ token }).patch(
        `admin/business/licenses/${requestId}/status`,
        {
          status: "REJECTED",
          comment: comment,
        }
      );
      setIsLoadingDecline(false);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchTeamUser("", pageCount);
        fetchTeamUser("Supplier", pageCount);
        fetchTeamUser("Vendor", pageCount);
        fetchTeamUser("Pharmacy", pageCount);
        fetchTeamUser("Lender", pageCount);
        onCloseDelete();
        if (onClose) onClose();
      }
    } catch (error) {
      setIsLoadingDecline(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const handleAccept = (id: string) => {
    const numericId = Number(id);
    handleAcceptRequest(numericId);
    onClose();
  };

  const handleDecline = (id) => {
    const numericId = Number(id);
    setRequestId(numericId);
    onOpenDelete();
  };

  const renderedColumn =
    type === "Vendor"
      ? ColumnsVendorFN(handleData, handleAcceptRequest, handleDecline)
      : type === "Pharmacy"
      ? ColumnsPharmFN(handleData, handleAcceptRequest, handleDecline)
      : type === "Supplier"
      ? ColumnsSupplierFN(handleData, handleAcceptRequest, handleDecline)
      : ColumnsAllFN(handleData, handleAcceptRequest, handleDecline);

  const table = useReactTable({
    data: records,
    columns: renderedColumn,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnVisibility,
      columnOrder,
      rowSelection,
      globalFilter,
    },
    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      {isLoading ? (
        <Stack mt={"10rem"}>
          <FaSpinner className="animate-spin w-6 h-6 mx-auto" />
        </Stack>
      ) : !records ? (
        <EmptyRequest
          heading={
            globalFilter ? "No Result Found" : `No New Approval Request Yet`
          }
          content={
            globalFilter
              ? "We couldn't find any results. Try changing your filters or search keywords."
              : `No recent request yet, all document request would appear here!`
          }
        />
      ) : (
        <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
          <Table>
            <Thead bg={"blue.50"}>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th textTransform={"initial"} px="6px" key={header.id}>
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
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id} px="6px">
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
          <Pagination meta={data?.meta} setPageCount={setPageCount} />
        </TableContainer>
      )}

      <RequestDrawer
        isOpen={isOpen}
        onClose={onClose}
        onAccept={handleAccept}
        onDecline={handleDecline}
        requestId={requestId?.toString() || ""}
        data={approvalData}
      />

      <DeleteModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        isLoadingDecline={isLoadingDecline}
        handleCommentDeleteRequest={handleCommentDeleteRequest}
      />
    </div>
  );
};

export default UsersTab;
