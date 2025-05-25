"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { IoListOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import {
    Button,
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
import { classNames, handleServerErrorMessage, toQueryString } from "@/utils";
import Link from "next/link";
import EmptyOrder from "../../suppliers/orders/_components/EmptyOrder";
import GridList from "../../suppliers/products/_components/GridList";
import DeleteModal from "../../suppliers/products/_components/DeleteModal";
import RestockModal from "../../suppliers/products/_components/RestockModal";
import FilterDrawer from "../../suppliers/products/_components/FilterDrawer";
import { ColumsProductFN } from "./_components/table";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import {
    MedicationResponseData,
    NextAuthUserSession,
    ProductDataProps,
    ProductResponseData
} from "@/types";
import ModalWrapper from "../../suppliers/_components/ModalWrapper";
import { useDebouncedValue } from "@/utils/debounce";
import SearchInput from "../../vendors/_components/SearchInput";
import { toast } from "react-toastify";
import Pagination from "./_components/Pagination";
import { useForm } from "react-hook-form";

interface IFilterInput {
    toDate?: Date | null;
    fromDate?: Date | null;
    status?: string[];
    inventory?: string[];
    category?: string[];
    brand?: string[];
}

const Page = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [pageCount, setPageCount] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    const [status, setStatus] = useState<string[]>([]);
    const [brandQuery, setBrandQuery] = useState<string[]>([]);
    const [brandFilter, setBrandFilter] = useState<string>("");
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [brands, setBrands] = useState<MedicationResponseData>();
    const [category, setCategory] = useState<MedicationResponseData>();
    const [products, setProducts] = useState<ProductResponseData>();
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [categoryQuery, setCategoryQuery] = useState<string[]>([]);
    const [inventoryQuery, setInventoryQuery] = useState<string[]>([]);
    const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
    const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
    const [currentView, setCurrentView] = useState<PRODUCTVIEW>(PRODUCTVIEW.LIST);
    const [selectedProduct, setSelectedProduct] = useState<ProductDataProps>();

    const debouncedSearch = useDebouncedValue(globalFilter, 500);
    const debouncedBrandSearch = useDebouncedValue(brandFilter, 500);
    const debouncedCategorySearch = useDebouncedValue(categoryFilter, 500);

    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isOpen: isOpenFlag, onClose: onCloseFlag, onOpen: onOpenFlag } = useDisclosure();
    const { isOpen: isOpenUnFlag, onClose: onCloseUnFlag, onOpen: onOpenUnFlag } = useDisclosure();
    const { isOpen: isOpenFilter, onClose: onCloseFilter, onOpen: onOpenFilter } = useDisclosure();
    const { isOpen: isOpenRestock, onClose: onCloseRestock, onOpen: onOpenRestock } = useDisclosure();
    const { isOpen: isOpenActivate, onClose: onCloseActivate, onOpen: onOpenActivate } = useDisclosure();
    const { isOpen: isOpenDeactivate, onClose: onCloseDeactivate, onOpen: onOpenDeactivate } = useDisclosure();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        let query = `/admin/settings/products/search?page=${pageCount}`;
        const params = {
            search: debouncedSearch ?? "",
            inventory: inventoryQuery ?? [""],
            category: categoryQuery ?? [""],
            status: status ?? [""],
            brand: brandQuery ?? [],
            variation: "",
            medicationType: [],
            fromDate: createdAtStart ? new Date(createdAtStart).toLocaleDateString('en-CA') : "",
            toDate: createdAtEnd ? new Date(createdAtEnd).toLocaleDateString('en-CA') : "",
        };

        const queryString = toQueryString(params)

        try {
            const response = await requestClient({ token: token }).get(`${query}&${queryString}`);
            if (response.status === 200) {
                if (response.data.data?.currentPage > response.data.data?.lastPage) {
                    setPageCount(products?.currentPage - 1)
                }
                setProducts(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [pageCount, debouncedSearch, inventoryQuery, categoryQuery, status, brandQuery, createdAtStart, createdAtEnd, token]);

    const fetchingBrands = useCallback(async () => {
        if (!brandFilter) return;
        try {
            const response = await requestClient({ token: token }).get(
                `/admin/settings/brands?search=${debouncedBrandSearch}`
            );
            if (response.status === 200) {
                setBrands(response.data.data);
            }
        } catch (error) {
            console.error(error)
        }
    }, [token, debouncedBrandSearch, brandFilter]);

    const fetchingCategory = useCallback(async () => {
        if (!categoryFilter) return;
        try {
            const response = await requestClient({ token: token }).get(
                `/admin/settings/categories?search=${debouncedCategorySearch}`
            );
            if (response.status === 200) {
                setCategory(response.data.data);
            }
        } catch (error) {
            console.error(error)
        }
    }, [token, debouncedCategorySearch, categoryFilter]);

    useEffect(() => {
        if (!token) return;
        fetchingBrands();
        fetchProducts();
        fetchingCategory();
    }, [fetchingBrands, fetchingCategory, fetchProducts, token]);

    const memoizedData = useMemo(() => products?.data, [products?.data]);

    const table = useReactTable({
        data: memoizedData,
        columns: ColumsProductFN(
            onOpen,
            onOpenFlag,
            onOpenUnFlag,
            onOpenRestock,
            onOpenDeactivate,
            onOpenActivate,
            pageCount,
            10,
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

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
        setValue,
        getValues,
        trigger,
        watch
    } = useForm<IFilterInput>({
        mode: "onChange",
        defaultValues: {
            inventory: [],
            status: [],
            brand: [],
            toDate: null,
            fromDate: null
        }
    });

    const applyFilters = (filters: IFilterInput) => {
        setPageCount(1);
        setCreatedAtStart(filters.fromDate);
        setCreatedAtEnd(filters.toDate);
        setStatus(filters.status);
        setBrandQuery(filters.brand);
        setCategoryQuery(filters.category);
        setInventoryQuery(filters.inventory)
    };

    const clearFilters = () => {
        setCreatedAtStart(null);
        setCreatedAtEnd(null);
        setStatus([]);
        setBrandQuery([])
        setBrandFilter("");
        setInventoryQuery([])
        setCategoryQuery([]);
        setCategoryFilter("");
        setGlobalFilter("");
    };

    const filterOptions = [
        { option: "Active", value: "active" },
        { option: "Suspended", value: "inactive" },
    ];

    const handleProductDeactivate = async (type: string) => {
        if (!selectedProduct) return;
        setError(false);
        setIsLoading(true);
        const formdata = new FormData();
        if (type === "deactivate") {
            formdata.append("status", "INACTIVE");
        } else if (type === "activate") {
            formdata.append("status", "ACTIVE");
        } else if (type === "flagged" && comment !== "") {
            formdata.append("status", "FLAGGED");
            formdata.append("statusComment", comment);
        }
        try {
            const response = await requestClient({ token: token }).post(
                `/admin/settings/products/${selectedProduct?.id}`,
                formdata
            )
            if (response.status === 200) {
                toast.success(response.data.message);
                fetchProducts();
                setComment("");
                setIsLoading(false);
                onCloseFlag();
                onCloseUnFlag();
                onCloseDeactivate();
                onCloseActivate();
            }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error(handleServerErrorMessage(error));
        }
    }
    const handleProductDelete = async () => {
        if (!selectedProduct) return;
        setIsLoading(true);
        try {
            const response = await requestClient({ token: token }).delete(
                `/admin/settings/products/${selectedProduct?.id}`,
            )
            if (response.status === 200) {
                toast.success(response.data.message);
                await fetchProducts();
                setIsLoading(false);
                onClose();
            }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error(handleServerErrorMessage(error));
        }
    }

    if (loading) {
        return (
            <Flex justify="center" align="center" height="200px">
                <Spinner size="xl" />
            </Flex>
        )
    }

    return (
        <div className="p-8">
            <div className="flex justify-between flex-wrap">
                <h3 className="font-semibold text-2xl">Products</h3>
                <div className="mb-4 flex items-center gap-3">
                    <SearchInput
                        placeholder="Search for a Product"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                    <div
                        onClick={onOpenFilter}
                        className="border cursor-pointer border-gray-300 py-2 px-3 rounded-md flex items-center gap-2">
                        <CiFilter className="w-5 h-5 text-gray-700" />
                        <p className="text-gray-500 font-medium">Filter</p>
                    </div>
                    <Link
                        href={'/admin/products/add-product'}
                        className="bg-primary-500 text-white p-2 px-5 rounded-md min-w-max">
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
                    memoizedData?.length === 0
                        ? <EmptyOrder
                            heading={`No Product Found`}
                            content={globalFilter ? "All products will appear here." : "You currently have no product for this search. All products will appear here."}
                        /> :
                        memoizedData?.length > 0 && (
                            currentView === PRODUCTVIEW.LIST ? (
                                <TableContainer 
                                sx={{
                                    "&::-webkit-scrollbar": {
                                       display: "none"
                                    },
                                }}
                                border={"1px solid #F9FAFB"} 
                                borderRadius={"10px"}>
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
                                            {products?.data && table?.getRowModel()?.rows?.map((row) => (
                                                <Tr key={row.id}>
                                                    {row.getVisibleCells()?.map((cell) => (
                                                        <Td key={cell.id} className="text-ellipsis overflow-hidden">
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
                                    <Pagination
                                        links={products?.links}
                                        prevPageUrl={products?.prevPageUrl}
                                        nextPageUrl={products?.nextPageUrl}
                                        firstPageUrl={products?.firstPageUrl}
                                        lastPageUrl={products?.lastPageUrl}
                                        setPageCount={setPageCount}
                                        currentPage={products?.currentPage}
                                    />
                                </TableContainer>
                            )
                                : <GridList
                                    product={products}
                                    routing="/admin/products"
                                    selectedProduct={selectedProduct}
                                    setSelectedProduct={setSelectedProduct}
                                    fetchProducts={fetchProducts}
                                    type="admin"
                                    isLoading={isLoading}
                                    onOpen={onOpen}
                                    onOpenFlag={onOpenFlag}
                                    onOpenUnflag={onOpenUnFlag}
                                    onOpenActivate={onOpenActivate}
                                    onOpenDeactivate={onOpenDeactivate}
                                    deleteFn={handleProductDelete}
                                    setPageCount={setPageCount}
                                />)
                }
            </div>
            <DeleteModal
                isOpen={isOpen}
                onClose={onClose}
                deleteFn={handleProductDelete}
                isLoading={isLoading}
            />
            <RestockModal
                isOpen={isOpenRestock}
                onClose={onCloseRestock}
                product={selectedProduct}
                fetchProducts={fetchProducts}
                type="admin"
            />
            <FilterDrawer
                brands={brands}
                category={category}
                isOpen={isOpenFilter}
                onClose={onCloseFilter}
                brandFilter={brandFilter}
                applyFilters={applyFilters}
                clearFilters={clearFilters}
                filterOptions={filterOptions}
                setBrandFilter={setBrandFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                handleSubmit={handleSubmit}
                control={control}
                reset={reset}
                setValue={setValue}
                getValues={getValues}
                trigger={trigger}
                watch={watch}
            />
            <ModalWrapper
                isOpen={isOpenDeactivate}
                onClose={onCloseDeactivate}
                title="Deactivate Product"
            >
                <div className="mb-8">
                    <p className='leading-6 text-gray-500 mt-2'>
                        You are about to deactivate
                        <span className="font-semibold text-gray-700 ml-1 capitalize">{selectedProduct?.name}</span>
                        , once deactivated, this product will not appear in your public shop.
                        There is no fee for deactivating a product.
                    </p>
                    <div className="flex flex-col gap-3 mt-8">
                        <Button
                            isLoading={isLoading}
                            loadingText={"Submitting..."}
                            onClick={() => handleProductDeactivate("deactivate")}
                            className='bg-primary-600 text-white p-3 rounded-md'>
                            Deactivate
                        </Button>
                        <Button
                            variant={"outline"}
                            className='cursor-pointer mt-2'
                            onClick={onCloseDeactivate}>
                            Cancel
                        </Button>
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
                        You are about to activate
                        <span className="font-semibold text-gray-700 ml-1 capitalize">{selectedProduct?.name}</span>
                        , this product will appear in your public shop.
                        There is no fee for activating a product.
                    </p>
                    <div className="flex flex-col gap-3 mt-8">
                        <Button
                            isLoading={isLoading}
                            loadingText={"Submitting..."}
                            onClick={() => handleProductDeactivate("activate")}
                            className='bg-primary-600 text-white p-3 rounded-md'>
                            Activate
                        </Button>
                        <Button
                            variant={"outline"}
                            className='cursor-pointer mt-2'
                            onClick={onCloseActivate}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </ModalWrapper>
            <ModalWrapper
                isOpen={isOpenFlag}
                onClose={onCloseFlag}
                title="Flag Product"
            >
                <div className="mb-8">
                    <p className='leading-6 text-gray-500 mt-2'>
                        You are about to flag
                        <span className="font-semibold text-gray-700 ml-1 capitalize">{selectedProduct?.name}</span>
                        , this product will appear not in your public shop.
                    </p>
                    <div className="my-5">
                        <textarea
                            onChange={(e) => setComment(e.target.value)}
                            required
                            className="w-full border rounded-md placeholder:text-gray-400 p-2"
                            placeholder="Enter reason"></textarea>
                        {
                            error && <span className="text-sm text-red-500 mt-1">Reason is required</span>
                        }
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button
                            isLoading={isLoading}
                            loadingText={"Submitting..."}
                            onClick={() => {
                                if (comment === "") {
                                    return setError(true)
                                } else {
                                    handleProductDeactivate("flagged")
                                }
                            }}
                            className='bg-primary-600 text-white p-3 rounded-md'>
                            Proceed
                        </Button>
                        <Button
                            variant={"outline"}
                            className='cursor-pointer'
                            onClick={onCloseFlag}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </ModalWrapper>
            <ModalWrapper
                isOpen={isOpenUnFlag}
                onClose={onCloseUnFlag}
                title="Unflag Product"
            >
                <div className="mb-8">
                    <p className='leading-6 text-gray-500 mt-2'>
                        You are about to unflag
                        <span className="font-semibold text-gray-700 ml-1 capitalize">{selectedProduct?.name}</span>
                        , this product will appear in your public shop.
                    </p>
                    <div className="flex flex-col gap-2 mt-5">
                        <Button
                            isLoading={isLoading}
                            loadingText={"Submitting..."}
                            onClick={() => handleProductDeactivate("activate")}
                            className='bg-primary-600 text-white p-3 rounded-md'>
                            Proceed
                        </Button>
                        <Button
                            variant={"outline"}
                            className='cursor-pointer'
                            onClick={onCloseUnFlag}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    )
}

export default Page