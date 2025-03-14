import { 
    ColumnOrderState, 
    RowSelectionState, 
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable 
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { ColumsDiscountFN } from "./table";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
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
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import { DiscountDataType, DiscountResponseData, NextAuthUserSession } from "@/types";
import ModalWrapper from "@/app/(protected)/suppliers/_components/ModalWrapper";
import requestClient from "@/lib/requestClient";
import { handleServerErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import DeleteModal from "@/app/(protected)/_components/DeleteModal";

interface DiscountTableProp {
    data: DiscountResponseData;
    type: string;
    pageCount: number;
    loading: boolean;
    fetchDiscounts: () => void;
    setPageCount: Dispatch<SetStateAction<number>>;
    fetchDiscountCount: () => void;
}

const PAGESIZE = 10;

const DiscountTable = (
    {data, pageCount, setPageCount, type, loading, fetchDiscounts, fetchDiscountCount}
    : DiscountTableProp
) => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [selectedDiscount, setSelectedDiscount] = useState<DiscountDataType>();
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const memoizedData = useMemo(() => data?.data, [data?.data]);

    const { isOpen: isOpenActivate, onClose: onCloseActivate, onOpen: onOpenActivate } = useDisclosure();
    const { isOpen: isOpenDeactivate, onClose: onCloseDeactivate, onOpen: onOpenDeactivate } = useDisclosure();
    const { isOpen: isOpenDelete, onClose: onCloseDelete, onOpen: onOpenDelete } = useDisclosure();

    const table = useReactTable({
        data: memoizedData,
        columns: ColumsDiscountFN(
            pageCount, 
            PAGESIZE, 
            setSelectedDiscount, 
            onOpenDeactivate, 
            onOpenActivate, 
            onOpenDelete
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

    const changeDiscountStatus = async(type: string) => {
        if(!selectedDiscount) return;
        setIsLoading(true);
        let formdata: any ;
        if(type === "deactivate"){
            formdata = {"status": "INACTIVE"};
        }else{
            formdata = {"status": "ACTIVE"};
        }
        try {
            const response = await requestClient({token: token}).patch(
                `/admin/discounts/${selectedDiscount?.id}`,
                formdata
            )
            if (response.status === 200) {
                toast.success(response.data.message);
                fetchDiscounts();
                fetchDiscountCount();
                setIsLoading(false);
                onCloseDeactivate();
                onCloseActivate();
            }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error(handleServerErrorMessage(error));
        }
    }

    const handleDiscountDelete = async() => {
        if(!selectedDiscount) return;
        setIsLoading(true);
        try {
            const response = await requestClient({token: token}).delete(
                `/admin/discounts/${selectedDiscount?.id}`,
            )
            if (response.status === 200) {
                toast.success(response.data.message);
                fetchDiscounts();
                setIsLoading(false);
                onCloseDelete();
            }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error(handleServerErrorMessage(error));
        }
    }

    const metaData = {
        "links" : data?.links
    }

    return (
    <div>
    {
        loading ? 
        <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
        </Flex>: 
        data?.data?.length === 0 
        ? <EmptyOrder 
        heading={`Nothing to show here`} 
        content={`All ${type} results would appear hear.`} 
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
                {data?.data && table?.getRowModel()?.rows?.map((row) => (
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
            <Pagination
                meta={metaData}
                setPageCount={setPageCount}
            />
        </TableContainer>
    }
    <DeleteModal 
        title="Discount"
        isOpen={isOpenDelete} 
        onClose={onCloseDelete}
        isLoading={isLoading}
        handleRequest={handleDiscountDelete}
    />
    <ModalWrapper
        isOpen={isOpenDeactivate} 
        onClose={onCloseDeactivate}
        title="Deactivate Discount"
        >
            <div className="mb-8">
                <p className='leading-6 text-gray-500 mt-2'>
                You are about to deactivate the discount
                <span className="font-semibold text-gray-700 ml-1 capitalize">{selectedDiscount?.couponCode}</span>
                , once deactivated, this discount will not reflect in applied products.
                There is no fee for deactivating a discount.
                </p>
                <div className="flex flex-col gap-3 mt-8">
                    <Button 
                    isLoading={isLoading}
                    loadingText={"Submitting..."}
                    onClick={() => changeDiscountStatus("deactivate")} 
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
        title="Activate Discount"
        >
            <div className="mb-8">
                <p className='leading-6 text-gray-500 mt-2'>
                You are about to activate the discount
                <span className="font-semibold text-gray-700 ml-1 capitalize">{selectedDiscount?.couponCode}</span>
                , once deactivated, this discount will reflect in applied products.
                There is no fee for activating a discount.
                </p>
                <div className="flex flex-col gap-3 mt-8">
                    <Button 
                    isLoading={isLoading}
                    loadingText={"Submitting..."}
                    onClick={() => changeDiscountStatus("activate")} 
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
    </div>
  )
}

export default DiscountTable