"use client";
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from '@tanstack/react-table';
import { 
    Button, 
    Flex, 
    FormControl, 
    FormLabel, 
    Select, 
    Spinner, 
    Table, 
    TableContainer, 
    Tbody, 
    Td, 
    Textarea, 
    Th, 
    Thead, 
    Tr, 
    useDisclosure 
} from '@chakra-ui/react';
import { ColumsOrderFN } from './table';
import { NextAuthUserSession, OrderData, OrderResponseData } from '@/types';
import Pagination from '@/app/(protected)/suppliers/_components/Pagination';
import ModalWrapper from '@/app/(protected)/suppliers/_components/ModalWrapper';
import EmptyOrder from '@/app/(protected)/suppliers/orders/_components/EmptyOrder';
import requestClient from '@/lib/requestClient';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { handleServerErrorMessage } from '@/utils';

interface OrderPageProp {
    orders: OrderResponseData;
    type: string;
    fetchOrders: () => void;
    loading: boolean;
    pageCount: number;
    globalFilter: string;
    setPageCount: Dispatch<SetStateAction<number>>
}

const OrderPage = ({orders, type, loading, pageCount, setPageCount, globalFilter, fetchOrders}: OrderPageProp) => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const [comment, setComment] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderData>();

    const{  isOpen: isOpenship, onClose: onCloseShip, onOpen: onOpenShip } = useDisclosure();
    const{  isOpen: isOpenComplete, onClose: onCloseComplete, onOpen: onOpenComplete } = useDisclosure();
    const{  isOpen: isOpenRefunded, onClose: onCloseRefunded, onOpen: onOpenRefunded } = useDisclosure();
    const { isOpen: isOpenProcess, onClose: onCloseProcess, onOpen: onOpenProcess } = useDisclosure();
    const { isOpen: isOpenCancelled, onClose: onCloseCancelled, onOpen: onOpenCancelled } = useDisclosure();

    const memoizedData = useMemo(() => orders?.data, [orders?.data]);

    const table = useReactTable({
        data: memoizedData,
        columns: ColumsOrderFN(
            pageCount, 
            20, 
            type, 
            onOpenShip,
            onOpenProcess, 
            onOpenComplete,
            onOpenCancelled,
            onOpenRefunded,
            setSelectedOrder
        ),
        onSortingChange: setSorting,
        state: {
          globalFilter
        },
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const handleStatusChange = async (status: string) => {
        try {
            setIsLoading(true)
            let formdata: any;
            if(status === "processing"){
                formdata = {
                    "orderId": selectedOrder.id,
                    "status": "PROCESSING",
                    "requiresRefund": false,
                }
            }else if(status === "shipping"){
                formdata = {
                    "orderId": selectedOrder.id,
                    "status": "SHIPPED",
                    "requiresRefund": false,
                }
            }else if(status === "cancelled" && comment){
                formdata = {
                    "orderId": selectedOrder.id,
                    "status": "CANCELED",
                    "reason": comment,
                    "requiresRefund": true,
                    "refundStatus": "AWAITING REFUND"
                }
            }else if(status === "refunded"){
                formdata = {
                    "orderId": selectedOrder.id,
                    "status": "REFUNDED",
                }
            }else if(status === "completed"){
                formdata = {
                    "orderId": selectedOrder.id,
                    "status": "COMPLETED",
                    "requiresRefund": false,
                }
            }
            const response = await requestClient({token: token}).post(
                `/admin/orders/change-order-status`,
                formdata
            )
            if(response.status === 200){
                toast.success(response?.data?.message);
                fetchOrders();
                onCloseShip();
                onCloseProcess();
                onCloseRefunded();
                onCloseCancelled();
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            toast.error(handleServerErrorMessage(error));
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if(comment === "") {
            return setError(true)
        }else{
            handleStatusChange("cancelled")
        }
    }

    return (
    <div>
        {
            loading ? 
                <Flex justify="center" align="center" height="200px">
                <Spinner size="xl" />
                </Flex>: 
            memoizedData?.length === 0 
            ? <EmptyOrder 
            heading={`No ${type} Order Yet`} 
            content={`You currently have no ${type} orders. All ${type} orders will appear here.`} 
            /> : memoizedData?.length > 0 && (
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
                    <Pagination 
                    meta={orders?.meta}
                    setPageCount={setPageCount}
                    />
                </TableContainer>
            )
        }
        <ModalWrapper
        isOpen={isOpenProcess} 
        onClose={onCloseProcess}
        title="Change Order Status"
        >
            <div className="mb-8">
                <p className='leading-6 text-gray-500 mt-2'>
                You are about to change the status of this order to 
                <span className='font-semibold text-gray-600'> Processing</span>. Click proceed if you wish to continue.
                </p>
                <div className="flex justify-end gap-3 mt-8">
                    <Button 
                    isLoading={isLoading}
                    loadingText={"Submitting..."}
                    onClick={() => handleStatusChange("processing")} 
                    className='bg-primary-600 text-white p-3 rounded-md'>
                        Proceed
                    </Button>
                    <Button 
                    variant={"outline"}
                    className='cursor-pointer'
                    onClick={onCloseProcess}>
                        Cancel
                    </Button>
                </div>
            </div>
        </ModalWrapper>
        <ModalWrapper
        isOpen={isOpenship} 
        onClose={onCloseShip}
        title="Change Order Status"
        >
            <div className="mb-8">
                <p className='leading-6 text-gray-500 mt-2'>
                You are about to change the status of this order to 
                <span className='font-semibold text-gray-600'> Shipping</span>. Click proceed if you wish to continue.
                </p>
                <div className="flex justify-end gap-3 mt-8">
                    <Button 
                    isLoading={isLoading}
                    loadingText={"Submitting..."}
                    onClick={() => handleStatusChange("shipping")} 
                    className='bg-primary-600 text-white p-3 rounded-md'>
                        Proceed
                    </Button>
                    <Button 
                    variant={"outline"}
                    className='cursor-pointer'
                    onClick={onCloseShip}>
                        Cancel
                    </Button>
                </div>
            </div>
        </ModalWrapper>
        <ModalWrapper
        isOpen={isOpenComplete} 
        onClose={onCloseComplete}
        title="Change Order Status"
        >
            <div className="mb-8">
                <p className='leading-6 text-gray-500 mt-2'>
                You are about to change the status of this order to 
                <span className='font-semibold text-gray-600'> Completed</span>. Click proceed if you wish to continue.
                </p>
                <div className="flex justify-end gap-3 mt-8">
                    <Button 
                    isLoading={isLoading}
                    loadingText={"Submitting..."}
                    onClick={() => handleStatusChange("completed")} 
                    className='bg-primary-600 text-white p-3 rounded-md'>
                        Proceed
                    </Button>
                    <Button 
                    variant={"outline"}
                    className='cursor-pointer'
                    onClick={onCloseComplete}>
                        Cancel
                    </Button>
                </div>
            </div>
        </ModalWrapper>
        <ModalWrapper
        isOpen={isOpenRefunded} 
        onClose={onCloseRefunded}
        title="Change Order Status"
        >
            <div className="mb-8">
                <p className='leading-6 text-gray-500 mt-2'>
                You are about to change the status of this order to 
                <span className='font-semibold text-gray-600'> Refunded</span>. Click proceed if you wish to continue.
                </p>
                <div className="flex justify-end gap-3 mt-8">
                    <Button 
                    isLoading={isLoading}
                    loadingText={"Submitting..."}
                    onClick={() => handleStatusChange("refunded")} 
                    className='bg-primary-600 text-white p-3 rounded-md'>
                        Proceed
                    </Button>
                    <Button 
                    variant={"outline"}
                    className='cursor-pointer'
                    onClick={onCloseRefunded}>
                        Cancel
                    </Button>
                </div>
            </div>
        </ModalWrapper>
        <ModalWrapper
        isOpen={isOpenCancelled} 
        onClose={onCloseCancelled}
        title="Let the supplier know your reason"
        >
            <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                <FormControl className="">
                    <FormLabel htmlFor="">Reason for cancellation</FormLabel>
                    <Select 
                    onChange={(e) => {
                        setComment(e.target.value);
                        setError(false);
                    }} 
                    placeholder='Select reason' 
                    _placeholder={{color: "gray"}}
                    >
                        <option value="Expired product">Expired product</option>
                        <option value="Out of stock">Out of stock</option>
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel>Other</FormLabel>
                    <Textarea 
                    onChange={(e) => {
                        setComment(e.target.value);
                        setError(false);
                    }}
                    className="w-full border rounded-md placeholder:text-gray-400 p-2 mt-1" 
                    placeholder="Enter reason"
                    />
                    {
                        error && <span className="text-sm text-red-500 mt-1">Reason is required</span>
                    }
                </FormControl>
                <div className="flex justify-end gap-2">
                    <Button 
                    isLoading={isLoading}
                    type='submit'
                    loadingText={"Submitting..."}
                    bg={"red.600"}
                    _hover={{
                        background: "red.300"
                    }}
                    className='text-white p-3 rounded-md'>
                        Cancel Order
                    </Button>
                    <Button 
                    variant={"outline"}
                    className='cursor-pointer'
                    onClick={onCloseCancelled}>
                        Cancel
                    </Button>
                </div>
            </form>
        </ModalWrapper>
    </div>
  )
}

export default OrderPage