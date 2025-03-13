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
import { useCallback, useState } from "react";
import {
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ColumnsMemberFN } from "./table";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import InviteMember from "@/app/(protected)/admin/settings/_components/InviteMember";
import requestClient from "@/lib/requestClient";
import { handleServerErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import { SubmitHandler } from "react-hook-form";
import DeleteModal from "../../_components/DeleteModal";
import EmptyResult from "../../_components/EmptyResult";
import ConfirmModal from "@/app/(protected)/admin/settings/_components/ConfirmModal";
import { ConfirmationModal } from "@/app/(protected)/_components/ConfirmationModal";

interface IFormInput {
  fullName: string;
  email: string;
  role: "admin" | "operator" | "support";
}

const TeamMembers = ({
  allMembersData,
  fetchTeamMembers,
  token,
}: {
  allMembersData: [];
  fetchTeamMembers: () => void;
  token: string;
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const {
    onOpen: onOpenRemove,
    onClose: onCloseRemove,
    isOpen: isOpenRemove,
  } = useDisclosure();
  const {
    onOpen: onOpenSuspend,
    isOpen: isOpenSuspend,
    onClose: onCloseSuspend,
  } = useDisclosure();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [memberId, setMemberId] = useState<number>();
  const [userId, setUserId] = useState<number>();
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
  const [actionType, setActionType] = useState<any | null>(null);
  const [userData, setUserData] = useState<any>();

  const handleDeleteModal = useCallback(
    (id: any) => {
      const numericId = Number(id);
      setMemberId(numericId);
      onOpenRemove();
    },
    [onOpenRemove]
  );

  const confirmDelete = useCallback(async () => {
    if (memberId !== undefined) {
      if (!token || !memberId) return;
      setIsLoadingAction(true);
      try {
        const response = await requestClient({ token }).delete(
          `/vendor/settings/invite/${memberId}`
        );

        if (response.status === 200) {
          toast.success(response.data.message);
          onCloseRemove();
          fetchTeamMembers();
        }
      } catch (error) {
        const errorMessage = handleServerErrorMessage(error);
        toast.error(errorMessage);
      } finally {
        setIsLoadingAction(false);
      }
    }
  }, [memberId, token, onCloseRemove, fetchTeamMembers]);

  const handleStatusToggle = useCallback(
    async (actionType) => {
      if (!token || !userId) return;
      setIsLoadingAction(true);
      try {
        const response = await requestClient({
          token: token,
        }).patch(`/vendor/settings/users/${userId}/status`, {
          status: actionType?.toUpperCase(),
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          fetchTeamMembers();
        }
      } catch (error) {
        const errorMessage = handleServerErrorMessage(error);
        toast.error(errorMessage);
      } finally {
        setIsLoadingAction(false);
        onCloseSuspend();
      }
    },
    [token, userId, fetchTeamMembers, onCloseSuspend]
  );

  const handleOpenModal = useCallback(
    (usersId: number, action: any) => {
      setUserId(usersId);
      setActionType(action);
      onOpenSuspend();
    },
    [onOpenSuspend]
  );

  // handle open Edit user modal
  const handleOpenEdituser = (userData: any | null) => {
    setUserId(userData?.user?.id);
    setUserData(userData);
    setActionType("edit");
    onOpen();
  };

  const table = useReactTable({
    data: allMembersData,
    columns: ColumnsMemberFN(
      handleDeleteModal,
      handleOpenEdituser,
      handleOpenModal
    ),
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

  return (
    <div>
      <HStack justify="flex-end">
        <Button onClick={onOpen} fontSize="15px" h="38px" px={3}>
          <Plus className="w-5 h-auto mr-1" /> Add Team Member
        </Button>
      </HStack>
      <div className="mt-5">
        {allMembersData?.length === 0 ? (
          <EmptyResult
            heading={`No Member Yet`}
            content={`You currently have no member added. All members will appear here.`}
          />
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
                  {/* <Td py={4} w="full" colSpan={5}>
                    {allMembersData && allMembersData.length > 6 && (
                      <Pagination/>
                    )}
                  </Td> */}
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </div>

      {isOpen && (
        <InviteMember
          onClose={onClose}
          isOpen={isOpen}
          accountType="vendor"
          fetchTeamMembers={fetchTeamMembers}
          token={token}
          editing={actionType === "edit"}
          userId={userId}
          setActionType={setActionType}
          userData={{
            email: userData?.email ?? "",
            fullName: userData?.fullName ?? "",
            role: userData?.role ?? null,
          }}
          setUserData={setUserData}
        />
      )}

      {/* <DeleteModal onClose={onCloseRemove} isOpen={isOpenRemove} title="Team Member" /> */}

      <ConfirmModal
        isOpen={isOpenRemove}
        onClose={onCloseRemove}
        handleRequest={confirmDelete}
      />

      <ConfirmationModal
        isOpen={isOpenSuspend}
        onClose={onCloseSuspend}
        title={"User"}
        actionType={actionType}
        onConfirm={() => handleStatusToggle(actionType)}
      />
    </div>
  );
};

export default TeamMembers;
