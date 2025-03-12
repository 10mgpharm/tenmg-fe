"use client";
import {
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { Plus, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import { MemberData } from "@/data/mockdata";
import { ColumsMemberFN } from "../tables/memberTable";
import InviteMember from "./InviteMember";
import ConfirmModal from "./ConfirmModal";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession, User } from "@/types";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { ConfirmationModal } from "@/app/(protected)/_components/ConfirmationModal";
import ViewUserModal from "../../users/_components/ViewUserModal";
import Email from "next-auth/providers/email";

interface IFormInput {
  fullName: string;
  email: string;
  role: "admin" | "operator" | "support";
}

const Members = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const {
    onOpen: onOpenRemove,
    onClose: onCloseRemove,
    isOpen: isOpenRemove,
  } = useDisclosure();
  const {
    onOpen: onOpenView,
    isOpen: isOpenView,
    onClose: onCloseView,
  } = useDisclosure();
  const {
    onOpen: onOpenSuspend,
    isOpen: isOpenSuspend,
    onClose: onCloseSuspend,
  } = useDisclosure();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [allMembersData, setAllMembersData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [memberId, setMemberId] = useState<number>();
  const [userId, setUserId] = useState<number>();
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
  const [actionType, setActionType] = useState<any | null>(null);
  const [userData, setUserData] = useState<any>();

  const session = useSession();
  // const sessionData = session?.data?.user as User;
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const fetchTeamMembers = useCallback(async () => {
    try {
      const response = await requestClient({ token: token }).get(
        "/admin/settings/invite"
      );
      if (response.status === 200) {
        setAllMembersData(response.data.data);
      }
    } catch (error) {
      toast.error(handleServerErrorMessage(error));
    }
  }, [token, setAllMembersData]);

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
          `/admin/settings/invite/${memberId}`
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
        }).patch(`/admin/users/${userId}/status`, {
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

  useEffect(() => {
    if (!token) return;
    fetchTeamMembers();
  }, [fetchTeamMembers, token]);

  const memoizedData = useMemo(() => allMembersData, [allMembersData]);

  const table = useReactTable({
    data: memoizedData,
    columns: ColumsMemberFN(
      handleDeleteModal,
      handleOpenEdituser,
      handleOpenModal
    ),
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
    <div>
      <HStack justify={"space-between"}>
        <Stack>
          <Text>Members</Text>
        </Stack>
        <Flex gap={3}>
          <Button
            onClick={onOpen}
            fontSize={"15px"}
            h={"38px"}
            px={3}
            bg={"blue.700"}
          >
            Invite Members
          </Button>
        </Flex>
      </HStack>
      <div className="mt-5">
        {/* {MemberData?.length === 0 ? ( */}
        {memoizedData?.length === 0 ? (
          <EmptyOrder
            heading={`No Member Yet`}
            content={`You currently have no member added. All members will appear here.`}
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
          </TableContainer>
        )}
      </div>

      {isOpen && (
        <InviteMember
          onClose={onClose}
          isOpen={isOpen}
          token={token}
          fetchTeamMembers={fetchTeamMembers}
          accountType="admin"
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

      <ConfirmModal
        isOpen={isOpenRemove}
        onClose={onCloseRemove}
        handleRequest={confirmDelete}
      />

      <ViewUserModal isOpen={isOpenView} onClose={onCloseView} id={userId} />

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

export default Members;
