import { AuditLogData } from "@/types";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge, Box, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper<AuditLogData>();

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const formatRole = (role: string) => {
  if (!role) return "";

  const lower = role.toLowerCase();

  // If role is exactly "admin", add "10mg" prefix
  if (lower === "admin") {
    return `10mg ${capitalize(lower)}`;
  }

  // If it's a member type like "admin_support" or "vendor_operator"
  const memberPrefixes = ["admin_", "vendor_"];
  const isMember = memberPrefixes.some((prefix) => lower.startsWith(prefix));

  if (isMember) {
    const [mainRole, subRole] = lower.split("_");
    return `10mg ${capitalize(mainRole)} ${capitalize(subRole)}`;
  }

  // Otherwise, just capitalize normally (for vendor, supplier, customer, lender)
  return capitalize(lower);
};


export const ColumsLogFN = () => [
  columnHelper.accessor("actor", {
    header: "User",
    cell: (info) => {
      const actor = info.getValue();

      if (!actor) return "Unknown";

      const roleText = actor.role ? formatRole(actor.role) : "";

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
