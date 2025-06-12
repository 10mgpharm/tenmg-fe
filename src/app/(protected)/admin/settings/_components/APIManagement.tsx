"use client";
import { useState, useEffect } from "react";
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
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { APIData } from "@/data/mockdata";
import { ColumsAPIFN } from "../tables/apiTable";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import requestClient from "@/lib/requestClient";

const APIManagement = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  console.log("sessionData", sessionData);


  useEffect(() => {
    console.log("use effect");
    const fetchApiManagementData = async () => {
      try {
        const response = await requestClient({
          token: sessionData?.user?.token,
        }).get("/admin/dashboard");

        console.log("res", response);
      } catch (e) {
        console.log(e)
      }
    }
    if (sessionData) fetchApiManagementData();
  }, [sessionData])

  // Fn: to revoke api
  const revokeApi = (apiId: string) => { };

  const table = useReactTable({
    data: APIData,
    columns: ColumsAPIFN(revokeApi),
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

    </div>
  );
};

export default APIManagement;

// {APIData?.length === 0 ? (
//       <EmptyOrder
//         heading={`No API Yet`}
//         content={`You currently have no API yet. All APIs will appear here.`}
//       />
//     ) : (
//       <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
//         <Table>
//           <Thead bg={"#F2F4F7"}>
//             {table?.getHeaderGroups()?.map((headerGroup) => (
//               <Tr key={headerGroup.id}>
//                 {headerGroup.headers?.map((header) => (
//                   <Th textTransform={"initial"} px="0px" key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                   </Th>
//                 ))}
//               </Tr>
//             ))}
//           </Thead>
//           <Tbody bg={"white"} color="#606060" fontSize={"14px"}>
//             {table?.getRowModel()?.rows?.map((row) => (
//               <Tr key={row.id}>
//                 {row.getVisibleCells()?.map((cell) => (
//                   <Td key={cell.id} px="0px">
//                     {flexRender(
//                       cell.column.columnDef.cell,
//                       cell.getContext()
//                     )}
//                   </Td>
//                 ))}
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>
//         {/* <HStack mt={5} justify={"space-between"}>
//               <Flex alignItems={"center"} gap={2}>
//                   <FaChevronLeft className='text-gray-500' />
//                   <Text className='text-gray-500'>Prev</Text>
//               </Flex>
//               {
//                   data?.length > 10 ? <Pagination />
//                   :  <span className="bg-primary-50 py-2 px-4 rounded-md text-primary-600 cursor-pointer">1</span>
//               }
//               <Flex alignItems={"center"} gap={2}>
//                   <Text className='text-gray-500'>Next</Text>
//                   <FaChevronRight className='text-gray-500' />
//               </Flex>
//           </HStack> */}
//       </TableContainer>
//     )}