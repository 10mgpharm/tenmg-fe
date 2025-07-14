import { createColumnHelper } from "@tanstack/react-table";
import { classNames, formatAmountString } from "@/utils";
import { OrderData } from "@/types";
import { convertDate } from "@/utils/formatDate";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";

const columnHelper = createColumnHelper<OrderData>();

export function ColumsOrderFN(
  pageIndex: number,
  pageSize: number,
  type: string,
  onOpenShip: () => void,
  onOpenProcess: () => void,
  onOpenComplete: () => void,
  onOpenCancelled: () => void,
  onOpenRefunded: () => void,
  setSelectedOrder: (item: any) => void
) {
  const router = useRouter();

  return [
    columnHelper.accessor("id", {
      header: () => (
        <div className="pl-6">
          <p>S/N</p>
        </div>
      ),
      cell: (info) => {
        const serialNumber =
          pageIndex > 1
            ? (pageIndex - 1) * pageSize + info?.row.index + 1
            : info?.row.index + 1;
        return (
          <div>
            <p className="pl-6">{serialNumber}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("customer", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Customer Name</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p>{info.row.original?.customer?.name} </p>
        </div>
      ),
    }),
    columnHelper.accessor("identifier", {
      header: () => <p>Order ID</p>,
      cell: (info) => (
        <div>
          <p>{info.row.original?.identifier || "NA"}</p>
        </div>
      ),
    }),
    columnHelper.accessor("grandTotal", {
      header: () => <p>Cost</p>,
      cell: (info) => (
        <div>
          <p>₦{formatAmountString(info.row.original?.grandTotal)}</p>
        </div>
      ),
    }),
    columnHelper.accessor("qtyTotal", {
      header: () => <p>Quantity</p>,
      cell: (info) => (
        <div>
          <p className="pl-4">{info.row.original?.qtyTotal}</p>
        </div>
      ),
    }),
    columnHelper.accessor("deliveryType", {
      header: () => <p>Delivery Type</p>,
      cell: (info) => (
        <div>
          <p>{info.row.original?.deliveryType}</p>
        </div>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: () => <p>Date</p>,
      cell: (info) => (
        <div>
          <p>{convertDate(info?.row?.original?.payment?.paidAt)}</p>
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: () => <p>Status</p>,
      cell: (info) => (
        <div>
          <p
            className={classNames(
              info?.row?.original?.status === "PENDING"
                ? "bg-[#FFFAEB] text-[#F79009]"
                : info?.row?.original?.status === "CANCELED"
                ? "bg-[#FEF3F2] text-[#B42318]"
                : info?.row?.original?.status === "SHIPPED"
                ? "text-[#027A48] bg-[#ECFDF3]"
                : info?.row?.original?.status === "COMPLETED"
                ? "text-blue-500 bg-blue-50"
                : info?.row?.original?.status === "PROCESSING"
                ? "text-purple-500 bg-purple-50"
                : "text-gray-500",
              " max-w-min p-1 px-2 rounded-2xl text-xs font-medium"
            )}
          >
            <span className="rounded-full text-[1.2rem]">•</span>{" "}
            {info?.row?.original?.status === "CANCELED"
              ? info.row.original?.refundStatus
              : info.row.original?.status}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: () => <p>Action</p>,
      cell: (info) => (
        <Flex justify={"flex-start"}>
          <Menu placement="bottom-start">
            <MenuButton>
              <BsThreeDotsVertical />
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() =>
                  router.push(
                    `/admin/orders/${
                      info.row.original.id || info.row.original.identifier
                    }`
                  )
                }
              >
                View Order
              </MenuItem>
              {info.row.original.status === "PENDING" && (
                <>
                  <MenuItem
                    onClick={() => {
                      setSelectedOrder(info.row.original);
                      onOpenProcess();
                    }}
                  >
                    Process Order
                  </MenuItem>
                  <MenuItem
                    color={"red.500"}
                    onClick={() => {
                      setSelectedOrder(info.row.original);
                      onOpenCancelled();
                    }}
                  >
                    Cancel Order
                  </MenuItem>
                </>
              )}
              {info.row.original.status === "PROCESSING" && (
                <>
                  <MenuItem
                    onClick={() => {
                      setSelectedOrder(info.row.original);
                      onOpenShip();
                    }}
                  >
                    Ship Order
                  </MenuItem>
                  <MenuItem
                    color={"red.500"}
                    onClick={() => {
                      setSelectedOrder(info.row.original);
                      onOpenCancelled();
                    }}
                  >
                    Cancel Order
                  </MenuItem>
                </>
              )}
              {info.row.original.status === "CONFIRMED" && (
                <MenuItem
                  onClick={() => {
                    setSelectedOrder(info.row.original);
                    onOpenProcess();
                  }}
                >
                  Shipping Order
                </MenuItem>
              )}
              {info.row.original.status === "SHIPPED" && (
                <MenuItem
                  onClick={() => {
                    setSelectedOrder(info.row.original);
                    onOpenComplete();
                  }}
                >
                  Delivered
                </MenuItem>
              )}
              {info.row.original.status === "CANCELED" &&
                info.row.original?.refundStatus === "AWAITING REFUND" && (
                  <MenuItem
                    onClick={() => {
                      setSelectedOrder(info.row.original);
                      onOpenRefunded();
                    }}
                  >
                    Refund Order
                  </MenuItem>
                )}
            </MenuList>
          </Menu>
        </Flex>
      ),
    }),
  ];
}
