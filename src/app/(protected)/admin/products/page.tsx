"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CiFilter, CiSearch } from "react-icons/ci"
import { IoListOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { 
    Flex, 
    Spinner, 
    Table, 
    TableContainer, 
    Tbody, 
    Td, 
    Th, 
    Thead, 
    Tr, 
    useDisclosure
} from "@chakra-ui/react";
import { 
    ColumnOrderState, 
    RowSelectionState, 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from "@tanstack/react-table";

import { PRODUCTVIEW } from "@/app/globalTypes";
import { classNames } from "@/utils";
import Link from "next/link";
import EmptyOrder from "../../suppliers/orders/components/EmptyOrder";
import Pagination from "../../suppliers/components/Pagination";
import GridList from "../../suppliers/products/components/GridList";
import DeleteModal from "../../suppliers/products/components/DeleteModal";
import RestockModal from "../../suppliers/products/components/RestockModal";
import DeactiveModal from "../../suppliers/products/components/DeactiveModal";
import FilterDrawer from "../../suppliers/products/components/FilterDrawer";
import { productData } from "@/data/mockdata";
import { ColumsProductFN } from "./components/table";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession, ProductResponseData } from "@/types";

const Page = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [loading, setLoading] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    
    const [currentView, setCurrentView] = useState<PRODUCTVIEW>(PRODUCTVIEW.LIST)
    const [products, setProducts] = useState<ProductResponseData>();

    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isOpen: isOpenRestock, onClose: onCloseRestock, onOpen: onOpenRestock } = useDisclosure();
    const { isOpen: isOpenDeactivate, onClose: onCloseDeactivate, onOpen: onOpenDeactivate } = useDisclosure();
    const { isOpen: isOpenFilter, onClose: onCloseFilter, onOpen: onOpenFilter } = useDisclosure();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
        const response = await requestClient({ token: token }).get(
            `/admin/settings/products`
        );
        if (response.status === 200) {
            setProducts(response.data.data);
        }
        setLoading(false);
        } catch (error) {
        console.error(error);
        setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if(!token) return;
        fetchProducts();
    },[fetchProducts, token]);

    const memoizedData = useMemo(() => products?.data, [products?.data]);

    const table = useReactTable({
        data: memoizedData,
        columns: ColumsProductFN(onOpen, onOpenRestock, onOpenDeactivate),
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

    console.log(products);
    
  return (
    <div className="p-8">
        <div className="flex justify-between">
            <h3 className="font-semibold text-2xl">Products</h3>
            <div className="mb-4 flex items-center gap-3">
                <div className="border border-gray-300 rounded-md flex items-center gap-3 px-3 py-2 w-[300px]">
                    <CiSearch className="w-5 h-5 text-gray-700" />
                    <input 
                    type="text" 
                    placeholder="Search for a product" 
                    className="outline-none flex-1 placeholder:text-gray-400 bg-transparent" 
                    />
                </div>
                <div onClick={onOpenFilter} className="border cursor-pointer border-gray-300 py-2 px-3 rounded-md flex items-center gap-2">
                    <CiFilter className="w-5 h-5 text-gray-700" />
                    <p className="text-gray-500 font-medium">Filter</p>
                </div>
                <Link 
                href={'/admin/products/new'} 
                className="bg-primary-500 text-white p-2 px-5 rounded-md">
                    Add Product
                </Link>
                <div className="flex items-center gap-2">
                    <div 
                    className={
                        classNames(
                        currentView === PRODUCTVIEW.LIST ? 
                        "bg-primary-50 rounded-md border border-primary-500" 
                        : "", 
                        "cursor-pointer p-2")
                    }
                    onClick={() => setCurrentView(PRODUCTVIEW.LIST)}
                    >
                        <IoListOutline 
                        className={classNames(currentView === PRODUCTVIEW.LIST ?
                        "text-primary-500" : 
                        "text-gray-600", 
                        " w-5 h-5")} 
                        />
                    </div>
                    <div className={
                        classNames(
                        currentView === PRODUCTVIEW.GRID ? 
                        "bg-primary-50 rounded-md border border-primary-500" 
                        : "", 
                        "cursor-pointer p-2")
                    } 
                    onClick={() => setCurrentView(PRODUCTVIEW.GRID)}>
                        <RxDashboard 
                        className={classNames(currentView === PRODUCTVIEW.GRID ? 
                            "text-primary-500" 
                            : "text-gray-600", 
                            " w-5 h-5")}
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className="">
        {
            loading ? (
                <Flex justify="center" align="center" height="200px">
                  <Spinner size="xl" />
                </Flex>
            ) :
            products?.data?.length === 0 
            ? <EmptyOrder 
                heading={`No Product Yet`} 
                content={`You currently have no product. All products will appear here.`}
            /> : 
            products?.data?.length > 0 && (
            currentView === PRODUCTVIEW.LIST ? (
                <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
                    <Table>
                        <Thead bg={"#F2F4F7"}>
                        {table?.getHeaderGroups()?.map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                            {/* <Th textTransform={"initial"} px="0px">
                                <Checkbox
                                _checked={{
                                    "& .chakra-checkbox__control": {
                                    background: "#1A70B8",
                                    // borderColor: "#D0D5DD",
                                    borderRadius: 5,
                                    },
                                }}
                                marginLeft={5}
                                isChecked={table.getIsAllRowsSelected()}
                                onChange={table.getToggleAllRowsSelectedHandler()}
                                />
                            </Th> */}
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
                        {products?.data && table?.getRowModel()?.rows?.map((row) => (
                            <Tr key={row.id}>
                            {/* <Td px="0px">
                                <Checkbox
                                _checked={{
                                    "& .chakra-checkbox__control": {
                                    background: "#1A70B8",
                                    // borderColor: "#D0D5DD",
                                    borderRadius: 5,
                                    },
                                }}
                                marginLeft={5}
                                isChecked={row.getIsSelected()}
                                onChange={row.getToggleSelectedHandler()}
                                />
                            </Td> */}
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
                    {/* <Pagination />  */}
                </TableContainer>
            )
            : <GridList data={productData}/>)
        }
        </div>
        <DeleteModal isOpen={isOpen} onClose={onClose}/>
        <RestockModal isOpen={isOpenRestock} onClose={onCloseRestock}/>
        <DeactiveModal isOpen={isOpenDeactivate} onClose={onCloseDeactivate}/>
        <FilterDrawer isOpen={isOpenFilter} onClose={onCloseFilter} />
    </div>
  )
}

export default Page