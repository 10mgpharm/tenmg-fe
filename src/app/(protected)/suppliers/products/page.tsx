"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CiFilter, CiSearch } from "react-icons/ci"
import { IoListOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import EmptyOrder from "../orders/components/EmptyOrder";
import { 
    Checkbox,
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

import { ColumsProductFN } from "./components/table";
import { PRODUCTVIEW } from "@/app/globalTypes";
import GridList from "./components/GridList";
import { classNames } from "@/utils";
import DeleteModal from "./components/DeleteModal";
import RestockModal from "./components/RestockModal";
import DeactiveModal from "./components/DeactiveModal";
import Link from "next/link";
import FilterDrawer from "./components/FilterDrawer";
import Pagination from "../components/Pagination";
import { productData2 } from "@/data/mockdata";
import ModalWrapper from "../components/ModalWrapper";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession, ProductResponseData } from "@/types";

const Products = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const [loading, setLoading] = useState<boolean>(false); 
    const [pageCount, setPageCount] = useState<number>(1);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const [products, setProducts] = useState<ProductResponseData>();
    const [currentView, setCurrentView] = useState<PRODUCTVIEW>(PRODUCTVIEW.LIST)

    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isOpen: isOpenRestock, onClose: onCloseRestock, onOpen: onOpenRestock } = useDisclosure();
    const { isOpen: isOpenActivate, onClose: onCloseActivate, onOpen: onOpenActivate } = useDisclosure();
    const { isOpen: isOpenDeactivate, onClose: onCloseDeactivate, onOpen: onOpenDeactivate } = useDisclosure();
    const { isOpen: isOpenFilter, onClose: onCloseFilter, onOpen: onOpenFilter } = useDisclosure();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
        const response = await requestClient({ token: token }).get(
            `/supplier/products`
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
        data: memoizedData || [],
        columns: ColumsProductFN(onOpen, onOpenRestock, onOpenDeactivate, onOpenActivate),
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
    <div className="p-8">
        <div className="flex justify-between">
            <div className="mb-5">
                <h3 className="font-semibold text-2xl">
                    Products
                    {/* <span className="font-light text-gray-600">(10/10)</span> */}
                </h3>
                <div className="flex items-center gap-3 mt-5">
                    <div className="border border-gray-300 rounded-md flex items-center gap-3 p-3 w-[350px]">
                        <CiSearch className="w-5 h-5" />
                        <input 
                        type="text" 
                        placeholder="Search for a product" 
                        className="outline-none flex-1 placeholder:text-gray-400 bg-transparent" 
                        />
                    </div>
                    <div onClick={onOpenFilter} className="border cursor-pointer border-gray-300 p-3 rounded-md flex items-center gap-2">
                        <CiFilter className="w-5 h-5" />
                        <p className="text-gray-500 font-medium">Filter</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
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
                <Link href={'/suppliers/products/new'} className="bg-primary-500 text-white p-2 px-5 rounded-md">Add Product</Link>
            </div>
        </div>
        <div className="">
        {
            loading ? (
                <Flex justify="center" align="center" height="200px">
                  <Spinner size="xl" />
                </Flex>
            ) :
            memoizedData?.length === 0 
            ? <EmptyOrder 
            heading={`No Product Yet`} 
            content={`You currently have no product. All products will appear here.`}
            /> : 
            currentView === PRODUCTVIEW.LIST ?
            <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
                <Table>
                    <Thead bg={"#F2F4F7"}>
                    {table?.getHeaderGroups()?.map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                        <Th textTransform={"initial"} px="0px">
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
                        </Th>
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
                        <Td px="0px">
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
                        </Td>
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
                <Pagination meta={products?.meta} setPageCount={setPageCount}/>
            </TableContainer>
            : <GridList data={productData2}/>
        }
        </div>
        <DeleteModal isOpen={isOpen} onClose={onClose}/>
        <RestockModal isOpen={isOpenRestock} onClose={onCloseRestock}/>
        <ModalWrapper
        isOpen={isOpenDeactivate} 
        onClose={onCloseDeactivate}
        title="Deactivate Product"
        >
            <div className="mb-8">
                <p className='leading-6 text-gray-500 mt-2'>
                You are about to deactivate Global Pentazocine, once deactivated, this product will not appear in your public shop.
                There is no fee for reactivating a product.
                </p>
                <div className="flex flex-col gap-3 mt-8">
                    <button className='bg-primary-600 text-white p-3 rounded-md'>
                        Deactivate
                    </button>
                    <button className='cursor-pointer mt-2' onClick={onCloseDeactivate}>Cancel</button>
                </div>
            </div>
        </ModalWrapper>
        <ModalWrapper
        isOpen={isOpenActivate} 
        onClose={onCloseActivate}
        title="Activate Product"
        >
            <div className="mb-8">
                <p className='leading-6 text-gray-500 mt-2'>
                You are about to activate Global Pentazocine, once activated, this product will not appear in your public shop.
                There is no fee for activating a product.
                </p>
                <div className="flex flex-col gap-3 mt-8">
                    <button className='bg-primary-600 text-white p-3 rounded-md'>
                        Activate
                    </button>
                    <button className='cursor-pointer mt-2' onClick={onCloseActivate}>Cancel</button>
                </div>
            </div>
        </ModalWrapper>
        <FilterDrawer isOpen={isOpenFilter} onClose={onCloseFilter} />
    </div>
  )
}

export default Products