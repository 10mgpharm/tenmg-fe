import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export const ColumsLogFN = () => [
  columnHelper.accessor("actor.name", {
    header: "User",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("properties.action", {
    header: "Action",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("createdAt", {
    header: "Timestamp",
    cell: (info) => info.getValue(),
  }),
];

