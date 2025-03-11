"use client";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import {
    Button,
  FormControl,
  FormLabel,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
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
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { MemberDataProp, NextAuthUserSession } from "@/types";
import { FaSpinner } from "react-icons/fa6";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { useSession } from "next-auth/react";
import requestClient from "@/lib/requestClient";
import { ColumsLenderFN } from "./tableLender";
import { ActionType } from "@/constants";
import { ConfirmationModal } from "@/app/(protected)/_components/ConfirmationModal";
import ViewUserModal from "./ViewUserModal";
import DeleteModal from "@/app/(protected)/_components/DeleteModal";

const LenderTab = ({
  data,
  isLoading,
  setPageCount,
  pageCount,
  globalFilter,
  setGlobalFilter,
  fetchTeamUser,
}: {
  data: MemberDataProp;
  isLoading: boolean;
  setPageCount: Dispatch<SetStateAction<number>>;
  pageCount: number;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  fetchTeamUser: (type: string, pageCount: number) => void;
}) => {
  const [userId, setUserId] = useState<number>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
      onOpen: onOpenDelete,
      isOpen: isOpenDelete,
      onClose: onCloseDelete,
  } = useDisclosure();

  const {
    onOpen: onOpenView,
    isOpen: isOpenView,
    onClose: onCloseView,
  } = useDisclosure();

  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const handleDeleteModal = useCallback(
    (id: any) => {
    const numericId = Number(id);
    setUserId(numericId);
    onOpenDelete();
    },
    [onOpenDelete]
  );

  const handleOpenModal = useCallback(
    (id: number, action: ActionType) => {
      setUserId(id);
      setActionType(action);
      onOpen();
    },
    [onOpen]
  );

  const handleViewModal = useCallback(
    (id: number) => {
      setUserId(id);
      onOpenView();
    },
    [onOpenView]
  );

  const handleStatusToggle = useCallback(
    async (actionType: ActionType) => {
      if (!token || !userId) return;
      setIsLoadingAction(true);
      try {
        const response = await requestClient({
          token: token,
        }).patch(`/admin/users/${userId}/status`, {
          status: actionType?.toUpperCase(),
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          fetchTeamUser("lender", 1);
        }
      } catch (error) {
        const errorMessage = handleServerErrorMessage(error);
        toast.error(errorMessage);
      } finally {
        setIsLoadingAction(false);
        onClose();
      }
    },
    [token, userId, fetchTeamUser, onClose]
  );

  const records = useMemo(() => data?.data, [data?.data]);

  const renderedColumn = useMemo(
    () =>
      ColumsLenderFN(
      handleDeleteModal,
      pageCount,
      15,
      handleViewModal,
      handleOpenModal
    ),
    [handleDeleteModal, pageCount]
  );

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

  const handleRemove = async () => {
    setIsLoadingAction(true);
    try {
      const response = await requestClient({ token }).delete(
      `admin/users/${userId}`
      );

      if (response.status === 200) {
      toast.success(response.data.message);
      onCloseDelete();
      fetchTeamUser("lender", 1);
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoadingAction(false);
    }
  }

  return (
    <div className="">
      {isLoading ? (
        <Stack mt={"10rem"}>
          <FaSpinner className="animate-spin w-6 h-6 mx-auto" />
        </Stack>
      ) : records?.length === 0 ? (
        <EmptyOrder
          heading={`No User Yet`}
          content={`You currently have no user. All users will appear here.`}
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

  <ConfirmationModal
    isOpen={isOpen}
    onClose={onClose}
    title={"User"}
    actionType={actionType}
    onConfirm={() => handleStatusToggle(actionType)}
  />
  <ViewUserModal
    isOpen={isOpenView}
    onClose={onCloseView}
    id={userId}
  />
  <DeleteModal
    isOpen={isOpenDelete}
    onClose={onCloseDelete}
    title={"User"}
    handleRequest={handleRemove}
    isLoading={isLoadingAction}
  />
  </div>
  );
};

export default LenderTab;
