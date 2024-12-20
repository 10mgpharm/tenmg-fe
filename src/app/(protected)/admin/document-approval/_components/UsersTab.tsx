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
  ColumnDef,
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

const UsersTab = ({
  data,
  type,
  isLoading,
  setPageCount,
  pageCount,
  fetchTeamUser,
}: {
  data: AdminApprovalsProps;
  type: string;
  isLoading: boolean;
  setPageCount: Dispatch<SetStateAction<number>>;
  pageCount: number;
  fetchTeamUser: any;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [approvalData, setApprovalData] = useState<AdminApprovals>();
  const [requestId, setRequestId] = useState<number>();
  const [isApprovingLoading, setIsApprovalLoading] = useState<boolean>(false);

  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: onOpenDelete,
    isOpen: isOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const records = useMemo(() => data?.data, [data?.data]);

  const handleData = (id: number) => {
    setRequestId(id);
    setApprovalData(data?.data.find((item) => item.id === id));
    onOpen();
  };

  const handleAcceptRequest = async (id: number) => {
    try {
      setIsApprovalLoading(true);

      const response = await requestClient({ token: token }).patch(
        `admin/business/licenses/${id}/status`,
        {
          status: "APPROVED",
          comment: "testing",
        }
      );

      setIsApprovalLoading(false);

      if (response.status === 200) {
        toast.success(response.data.message);
        fetchTeamUser();
      }
    } catch (error) {
      setIsApprovalLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const handleCommentDeleteRequest = async () => {
    try {
      setIsApprovalLoading(true);

      const response = await requestClient({ token: token }).patch(
        `admin/business/licenses/${requestId}/status`,
        {
          status: "REJECTED",
          comment: "testing",
        }
      );

      setIsApprovalLoading(false);

      if (response.status === 200) {
        toast.success(response.data.message);
        fetchTeamUser();
      }
    } catch (error) {
      setIsApprovalLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const handleDeleteRequest = () => {
    onOpenDelete();
  };

  const handleAccept = (id: string) => {
    console.log("Accepted request ID:", id);
  };

  const handleDecline = (id: string) => {
    // Implement decline logic
    console.log("Declined request ID:", id);
  };

  const renderedColumn =
    type === "Vendor"
      ? ColumnsVendorFN(handleData, handleAcceptRequest, handleDeleteRequest)
      : type === "Pharmacy"
      ? ColumnsPharmFN(handleData, handleAcceptRequest, handleDeleteRequest)
      : type === "Supplier"
      ? ColumnsSupplierFN(handleData, handleAcceptRequest, handleDeleteRequest)
      : ColumnsAllFN(handleData, handleAcceptRequest, handleDeleteRequest);

  const table = useReactTable({
    data: records,
    columns: renderedColumn,
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
    <div className="">
      {isLoading ? (
        <Stack mt={"10rem"}>
          <FaSpinner className="animate-spin w-6 h-6 mx-auto" />
        </Stack>
      ) : records?.length === 0 ? (
        <EmptyOrder
          heading={`No New Approval Request Yet`}
          content={`No recent request yet, all document request would appear here!`}
        />
      ) : (
        <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
          <Table>
            <Thead bg={"#F2F4F7"}>
              {table?.getHeaderGroups()?.map((headerGroup, index) => (
                <Tr key={index}>
                  {headerGroup.headers?.map((header, index) => (
                    <Th textTransform={"initial"} px="6px" key={index}>
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
              {records &&
                table?.getRowModel()?.rows?.map((row, index) => (
                  <Tr key={index}>
                    {row.getVisibleCells()?.map((cell, index) => (
                      <Td key={index} px="6px">
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
        requestId="1"
        data={approvalData}
      />
      <DeleteModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        handleCommentDeleteRequest={handleCommentDeleteRequest}
      />
    </div>
  );
};

export default UsersTab;
