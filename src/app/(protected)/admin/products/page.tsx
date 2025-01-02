"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CiFilter } from "react-icons/ci"
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
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getFilteredRowModel, 
    getSortedRowModel, 
    useReactTable 
} from "@tanstack/react-table";

import { PRODUCTVIEW } from "@/app/globalTypes";
import { classNames } from "@/utils";
import Link from "next/link";
import EmptyOrder from "../../suppliers/orders/_components/EmptyOrder";
import Pagination from "../../suppliers/_components/Pagination";
import GridList from "../../suppliers/products/_components/GridList";
import DeleteModal from "../../suppliers/products/_components/DeleteModal";
import RestockModal from "../../suppliers/products/_components/RestockModal";
import FilterDrawer from "../../suppliers/products/_components/FilterDrawer";
import { ColumsProductFN } from "./_components/table";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession, ProductResponseData } from "@/types";
import ModalWrapper from "../../suppliers/_components/ModalWrapper";
import { useDebouncedValue } from "@/utils/debounce";
import SearchInput from "../../vendors/_components/SearchInput";
import { IFilterInput } from "../../vendors/customers-management/page";

const Page = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [pageCount, setPageCount] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    
    const [status, setStatus] = useState<string>("");
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [products, setProducts] = useState<ProductResponseData>();
    const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
    const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
    const [currentView, setCurrentView] = useState<PRODUCTVIEW>(PRODUCTVIEW.LIST)

    const debouncedSearch = useDebouncedValue(globalFilter, 500);

    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isOpen: isOpenFilter, onClose: onCloseFilter, onOpen: onOpenFilter } = useDisclosure();
    const { isOpen: isOpenRestock, onClose: onCloseRestock, onOpen: onOpenRestock } = useDisclosure();
    const { isOpen: isOpenActivate, onClose: onCloseActivate, onOpen: onOpenActivate } = useDisclosure();
    const { isOpen: isOpenDeactivate, onClose: onCloseDeactivate, onOpen: onOpenDeactivate } = useDisclosure();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        let query = `/admin/settings/products/search?page=${pageCount}`;
        if (debouncedSearch) {
            query += `&search=${debouncedSearch}`;
        }
        if (createdAtStart) {
            query += `&createdAtStart=${createdAtStart.toISOString().split("T")[0]}`;
        }
        if (createdAtEnd) {
        query += `&createdAtEnd=${createdAtEnd.toISOString().split("T")[0]}`;
        }
        try {
        const response = await requestClient({ token: token }).get(query);
            if (response.status === 200) {
                setProducts(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [token, pageCount, debouncedSearch, createdAtStart, createdAtEnd]);

    useEffect(() => {
        if(!token) return;
        fetchProducts();
    },[fetchProducts, token]);

    const memoizedData = useMemo(() => products?.data, [products?.data]);

    const table = useReactTable({
        data: memoizedData,
        columns: ColumsProductFN(
                    onOpen, 
                    onOpenRestock, 
                    onOpenDeactivate, 
                    onOpenActivate, 
                    pageCount, 
                    15
                ),
        onSortingChange: setSorting,
        state: {
          globalFilter,
        },
        manualFiltering: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const applyFilters = (filters: IFilterInput) => {
        setCreatedAtStart(filters.startDate);
        setCreatedAtEnd(filters.endDate);
        setStatus(filters.status);
    };

    const clearFilters = () => {
        setCreatedAtStart(null);
        setCreatedAtEnd(null);
        setStatus("");
        setGlobalFilter("");
    };

    const filterOptions = [
        { option: "Active", value: "active" },
        { option: "Suspended", value: "inactive" },
    ];
    
  return (
    <div className="p-8">
        <div className="flex justify-between">
            <h3 className="font-semibold text-2xl">Products</h3>
            <div className="mb-4 flex items-center gap-3">
                <SearchInput
                placeholder="Search for a Product"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                />
                <div onClick={onOpenFilter} className="border cursor-pointer border-gray-300 py-2 px-3 rounded-md flex items-center gap-2">
                    <CiFilter className="w-5 h-5 text-gray-700" />
                    <p className="text-gray-500 font-medium">Filter</p>
                </div>
                <Link 
                href={'/admin/products/add-product'} 
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
            memoizedData?.length === 0 
            ? <EmptyOrder 
                heading={`No Product Yet`} 
                content={`You currently have no product. All products will appear here.`}
            /> : 
            memoizedData?.length > 0 && (
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
                    <Pagination meta={products?.meta} setPageCount={setPageCount}/>
                </TableContainer>
            )
            : <GridList 
            data={memoizedData}
            routing="/admin/products"
            />)
        }
        </div>
        <DeleteModal 
            isOpen={isOpen} 
            onClose={onClose}
        />
        <RestockModal 
            isOpen={isOpenRestock} 
            onClose={onCloseRestock}
        />
        <FilterDrawer 
            isOpen={isOpenFilter} 
            onClose={onCloseFilter} 
            applyFilters={applyFilters}
            clearFilters={clearFilters}
            filterOptions={filterOptions}
        />
        <ModalWrapper
        isOpen={isOpenDeactivate} 
        onClose={onCloseDeactivate}
        title="Deactivate Product"
        >
            <div className="mb-8">
                <p className='leading-6 text-gray-500 mt-2'>
                You are about to deactivate Global Pentazocine, once deactivated, this product will not appear in your public shop.
                There is no fee for deactivating a product.
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
    </div>
  )
}

export default Page