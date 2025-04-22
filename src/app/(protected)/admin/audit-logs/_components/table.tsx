import { AuditLogData } from "@/types";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge, Box, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper<AuditLogData>();

// Capitalizes the first letter of any string
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const ColumsLogFN = () => [
  columnHelper.accessor("actor", {
    header: "User",
    cell: (info) => {
      const actor = info.getValue();

      if (!actor) return "Unknown";

      // Add "10mg" before a capitalized role
      const roleText = actor.role ? `10mg ${capitalize(actor.role)}` : "";

      return (
        <Box>
          <Text fontWeight="semibold">{actor.name || "Unknown"}</Text>
          <Text fontSize="sm" color="gray.500">
            {actor.email || "No email"}
          </Text>
          {roleText && (
            <Badge
              mt={1}
              colorScheme="purple"
              fontSize="10px"
              px={2}
              py={1}
              borderRadius="md"
            >
              {roleText}
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
