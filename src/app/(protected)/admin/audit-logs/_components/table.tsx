import { AuditLogData } from "@/types";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge, Box, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper<AuditLogData>();

export const ColumsLogFN = () => [
  columnHelper.accessor("actor", {
    header: "User",
    cell: (info) => {
      const actor = info.getValue();

      if (!actor) return "Unknown";

      return (
        <Box>
          <Text fontWeight="semibold">{actor.name || "Unknown"}</Text>
          <Text fontSize="sm" color="gray.500">
            {actor.email || "No email"}
          </Text>
          {actor.role && (
            <Badge mt={1} colorScheme="purple">
              {actor.role}
            </Badge>
          )}
        </Box>
      );
    },
  }),
  columnHelper.accessor("properties.action", {
    header: "Action",
    cell: (info) => info.getValue() || "Unknown",
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("createdAt", {
    header: "Timestamp",
    cell: (info) => {
      const date = new Date(info.getValue());
      return date.toLocaleString();
    },
  }),
];
