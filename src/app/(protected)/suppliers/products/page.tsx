"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CiFilter } from "react-icons/ci"
import { IoListOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import EmptyOrder from "../orders/_components/EmptyOrder";
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
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getFilteredRowModel, 
    getSortedRowModel, 
    useReactTable 
} from "@tanstack/react-table";

import Link from "next/link";
import { ColumsProductFN } from "./_components/table";
import { PRODUCTVIEW } from "@/app/globalTypes";
import GridList from "./_components/GridList";
import { classNames } from "@/utils";
import DeleteModal from "./_components/DeleteModal";
import RestockModal from "./_components/RestockModal";
import Pagination from "../_components/Pagination";
import ModalWrapper from "../_components/ModalWrapper";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { 
    MedicationResponseData, 
    NextAuthUserSession, 
    ProductDataProps, 
    ProductResponseData 
} from "@/types";
import { useDebouncedValue } from "@/utils/debounce";
import { IFilterInput } from "../../vendors/customers-management/page";
import FilterDrawer from "./_components/FilterDrawer";
import SearchInput from "../../vendors/_components/SearchInput";

const Products = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const [loading, setLoading] = useState<boolean>(false); 
    const [pageCount, setPageCount] = useState<number>(1);
    const [sorting, setSorting] = useState<SortingState>([]);

    const [status, setStatus] = useState<string>("");
    const [brandQuery, setBrandQuery] = useState("");
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [brandFilter, setBrandFilter] = useState<string>("");
    const [brands, setBrands] = useState<MedicationResponseData>();
    const [inventoryQuery, setInventoryQuery] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [products, setProducts] = useState<ProductResponseData>();
    const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
    const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
    const [currentView, setCurrentView] = useState<PRODUCTVIEW>(PRODUCTVIEW.LIST);
    const [selectedProduct, setSelectedProduct] = useState<ProductDataProps>();

    const debouncedSearch = useDebouncedValue(globalFilter, 500);
    const debouncedBrandSearch = useDebouncedValue(brandFilter, 500);

    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isOpen: isOpenRestock, onClose: onCloseRestock, onOpen: onOpenRestock } = useDisclosure();
    const { isOpen: isOpenActivate, onClose: onCloseActivate, onOpen: onOpenActivate } = useDisclosure();
    const { isOpen: isOpenDeactivate, onClose: onCloseDeactivate, onOpen: onOpenDeactivate } = useDisclosure();
    const { isOpen: isOpenFilter, onClose: onCloseFilter, onOpen: onOpenFilter } = useDisclosure();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        let query = `/supplier/products?page=${pageCount}`;
        if (debouncedSearch) {
            query += `&search=${debouncedSearch}`;
        }
        if(inventoryQuery) {
            query += `&inventory=${inventoryQuery}`
        }
        if(brandQuery) {
            query += `&brand=${brandQuery}`
        }
        if (createdAtStart) {
            query += `&fromDate=${createdAtStart.toISOString().split("T")[0]}`;
        }
        if (createdAtEnd) {
            query += `&toDate=${createdAtEnd.toISOString().split("T")[0]}`;
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
    }, [token, pageCount, debouncedSearch, createdAtStart, createdAtEnd, inventoryQuery, brandQuery]);

    const fetchingBrands = useCallback(async() => {
        if(!brandFilter) return;
        try {
            const response = await requestClient({ token: token }).get(
                `/supplier/brands?search=${debouncedBrandSearch}`
            );
            if(response.status === 200){
                setBrands(response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    },[token, debouncedBrandSearch, brandFilter]);

    useEffect(() => {
        if(!token) return;
        fetchProducts();
    },[fetchProducts, token]);

    useEffect(() => {
        if(!token) return;
        fetchingBrands();
    }, [fetchingBrands, token])

    const memoizedData = useMemo(() => products?.data, [products?.data]);

    const table = useReactTable({
        data: memoizedData || [],
        columns: ColumsProductFN(
            onOpen, 
            onOpenRestock, 
            onOpenDeactivate, 
            onOpenActivate, 
            setSelectedProduct
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
        setBrandQuery(filters.brand);
        setInventoryQuery(filters.inventory)
    };

    const clearFilters = () => {
        setCreatedAtStart(null);
        setCreatedAtEnd(null);
        setStatus("");
        setBrandQuery("")
        setBrandFilter("");
        setInventoryQuery("")
        setGlobalFilter("");
        setSelectedBrand("");
    };

    const filterOptions = [
        { option: "Active", value: "active" },
        { option: "Suspended", value: "inactive" },
    ];

  return (
    <div className="p-8">
        <div className="flex justify-between">
            <div className="mb-5">
                <h3 className="font-semibold text-2xl">
                    Products
                    {/* <span className="font-light text-gray-600">(10/10)</span> */}
                </h3>
                <div className="flex items-center gap-3 mt-5">
                    <SearchInput
                        placeholder="Search for a Product"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                    <div onClick={onOpenFilter} className="border cursor-pointer border-gray-300 px-3 py-2 rounded-md flex items-center gap-2">
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
                <Link 
                href={'/suppliers/products/add-product'} 
                className="bg-primary-500 text-white p-2 px-5 rounded-md">
                    Add Product
                </Link>
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
                    {memoizedData?.length > 0 && table?.getHeaderGroups()?.map((headerGroup) => (
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
                    {(memoizedData?.length > 0) && table?.getRowModel()?.rows?.map((row) => (
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
            : <GridList 
            data={memoizedData}
            routing="/suppliers/products"
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            fetchProducts={fetchProducts}
            type="supplier"
            />
        }
        </div>
        <DeleteModal 
        isOpen={isOpen} 
        onClose={onClose}
        />
        <RestockModal 
        isOpen={isOpenRestock} 
        onClose={onCloseRestock} 
        product={selectedProduct}
        fetchProducts={fetchProducts}
        type="supplier"
        />
        <ModalWrapper
        isOpen={isOpenDeactivate} 
        onClose={onCloseDeactivate}
        title="Deactivate Product"
        >
            <div className="mb-8">
                <p className='leading-6 text-gray-500 mt-2'>
                You are about to deactivate Global Pentazocine, once deactivated, this product will appear in your public shop.
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
        <FilterDrawer 
            brands={brands}
            isOpen={isOpenFilter} 
            onClose={onCloseFilter} 
            applyFilters={applyFilters}
            clearFilters={clearFilters}
            filterOptions={filterOptions}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
        />
    </div>
  )
}

export default Products