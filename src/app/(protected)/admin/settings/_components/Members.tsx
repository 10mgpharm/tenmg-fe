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
    useDisclosure
} from "@chakra-ui/react"
import { Plus, Search } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { 
    ColumnOrderState, 
    RowSelectionState, 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from '@tanstack/react-table';
import EmptyOrder from '@/app/(protected)/suppliers/orders/_components/EmptyOrder';
import { MemberData } from "@/data/mockdata";
import { ColumsMemberFN } from "../tables/memberTable";
import InviteMember from "./InviteMember";
import CreateRole from "./CreateRole";
import ConfirmModal from "./ConfirmModal";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession, User } from "@/types";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

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
        isOpen: isOpenRemove 
    } = useDisclosure();
    const {
        onOpen: onOpenView,
        isOpen: isOpenView,
        onClose: onCloseView,
      } = useDisclosure();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [allMembersData, setAllMembersData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userId, setUserId] = useState<number>();
    const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
    const [actionType, setActionType] = useState<any | null>(null);

    const session = useSession();
    // const sessionData = session?.data?.user as User;
    const sessionToken = session?.data as NextAuthUserSession;
    const token = sessionToken?.user?.token;

    const fetchTeamMembers = useCallback(async () => {
        try {
        const response = await requestClient({ token: token }).get(
            "/admin/settings/invite/team-members"
        );
        if (response.status === 200) {
            setAllMembersData(response.data.data);
        }
        } catch (error) {
            toast.error(handleServerErrorMessage(error));
        }
    }, [token]);

    const handleDeleteModal = useCallback(
        (id: any) => {
          const numericId = Number(id);
          setUserId(numericId);
          onOpenRemove();
        },
        [onOpenRemove]
      );
    
      const confirmDelete = useCallback(async () => {
        if (userId !== undefined) {
          if (!token || !userId) return;
          setIsLoadingAction(true);
          try {
            const response = await requestClient({ token }).delete(
              `admin/users/${userId}`
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
      }, [userId, token, onCloseRemove, fetchTeamMembers]);
    
      const handleViewModal = useCallback(
        (id: number) => {
          setUserId(id);
          onOpenView();
        },
        [onOpenView]
      );
    
      const handleOpenModal = useCallback(
        (id: number, action: any) => {
          setUserId(id);
          setActionType(action);
          onOpen();
        },
        [onOpen]
      );


    useEffect(() => {
        if(!token) return;
        fetchTeamMembers();
    }, [fetchTeamMembers, token]);

    const memoizedData = useMemo(() => allMembersData, [allMembersData]);

    const table = useReactTable({
        data: memoizedData,
        columns: ColumsMemberFN(onOpenRemove,    handleDeleteModal,
            
            handleOpenModal),
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

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
          setIsLoading(true);
          const response = await requestClient({token: token}).post(
            "/admin/settings/invite",
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
        <HStack justify={"space-between"}>
            <Stack>
                <Text>Members</Text>
                <InputGroup>
                    <InputLeftElement>
                        <Search className="w-5 h-auto text-gray-500"/>
                    </InputLeftElement>
                    <Input type='text' placeholder='search members'outline={"none"} pl={10}/>
                </InputGroup>
            </Stack>
            <Flex gap={3}>
                <Button onClick={onOpen} fontSize={"15px"} h={"38px"} px={3} bg={"blue.700"}>Invite Members</Button>
            </Flex>
        </HStack>
        <div className="mt-5">
        {
            MemberData?.length === 0 
            ? <EmptyOrder 
            heading={`No Member Yet`} 
            content={`You currently have no member added. All members will appear here.`} 
            /> : 
            <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
                <Table>
                    <Thead bg={"#F2F4F7"}>
                    {table?.getHeaderGroups()?.map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                        {headerGroup.headers?.map((header) => (
                            <Th
                            textTransform={"initial"}
                            px="0px"
                            key={header.id}
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
                    </Tbody>
                </Table>
            </TableContainer>
        }
        </div>
        <InviteMember onClose={onClose} isOpen={isOpen} onSubmit={onSubmit} isLoading={isLoading} token={token} accountType="admin" />
        <ConfirmModal isOpen={isOpenRemove} onClose={onCloseRemove}  handleRequest={confirmDelete}/>
    </div>
  )
}

export default Members