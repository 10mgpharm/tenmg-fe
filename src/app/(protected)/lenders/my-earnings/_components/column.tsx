import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export function MyEarningsColumn(
  onOpenDetails: () => void,
  setSelectedUserId: (value: string) => void
) {
  return [
    columnHelper.accessor("id", {
      header: ({ column }) => <p className="pl-6"> S/N</p>,
      cell: (info) => {
        const serialNumber = info?.row?.index + 1;
        return (
          <div className="pl-6">
            <p>{serialNumber}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("identifier", {
      header: ({ column }) => <p className="pl-6">Loan ID</p>,
      cell: (info) => {
        return (
          <div className="pl-6">
            <p>{info?.row?.original?.identifier}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("customer.name", {
      header: ({ column }) => <p className="">{"Borrower's Name"}</p>,
      cell: (info) => (
        <div className="">
          <p className=" capitalize">{info.row.original?.customer.name}</p>
        </div>
      ),
    }),
    columnHelper.accessor("capitalAmount", {
      header: ({ column }) => <p className="">Loan Amount</p>,
      cell: (info) => (
        <div className="">
          <p className="">₦{info.row.original?.capitalAmount}</p>
          <span className="text-primary-700 text-[12px]">
            Loan Interest: ₦{info.row.original?.interestAmount}
          </span>
          <br />

          <span className="text-primary-700 text-[12px]">
            Admin Interest: ₦{info.row.original?.adminAmount}
          </span>
        </div>
      ),
    }),

    columnHelper.accessor("interestAmount", {
      header: ({ column }) => <p className="">Repaid Interest</p>,
      cell: (info) => (
        <div className="">
          <p className="">₦{info.row.original?.paidInterest}</p>
          <span className="text-primary-700 text-[12px]">
            Admin commission: ₦{info.row.original?.adminInterest}
          </span>
        </div>
      ),
    }),
  ];
}
