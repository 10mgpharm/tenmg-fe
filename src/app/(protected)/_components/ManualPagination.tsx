// app/(protected)/suppliers/_components/Pagination.tsx

import { classNames } from "@/utils";
import { Button, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";

interface PaginationProps {
  meta: {
    currentPage?: number;
    first?: string;
    last?: string;
    next?: string | null;
    prev?: string | null;
  };
  setPageCount: Dispatch<SetStateAction<number>>;
}

const ManualPagination = ({ meta, setPageCount }: PaginationProps) => {
  const currentPage = meta?.currentPage || 1;

  // Extract total pages from meta.last if available
  // Assuming meta.last is a URL with query param like ?page=X
  const totalPages = meta?.last
    ? Number(meta.last.split("page=").pop() || 1)
    : 1;

  const maxLinks = useBreakpointValue({ base: 5, md: 7 }) || 7;

  const handlePageChange = (page: number) => {
    setPageCount(page);
  };

  const paginateList = useMemo(() => {
    const pages: (string | number)[] = [];

    // If totalPages is small, show all
    if (totalPages <= maxLinks) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let left = currentPage - 2;
      let right = currentPage + 2;

      // Adjust if too close to left boundary
      if (left < 2) {
        left = 2;
        right = left + 4;
      }

      // Adjust if too close to right boundary
      if (right > totalPages - 1) {
        right = totalPages - 1;
        left = right - 4;
        if (left < 2) left = 2;
      }

      // Add ellipsis before left segment if needed
      if (left > 2) {
        pages.push("...");
      }

      // Add pages between left and right
      for (let i = left; i <= right; i++) {
        pages.push(i);
      }

      // Add ellipsis after right segment if needed
      if (right < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  }, [totalPages, currentPage, maxLinks]);

  return (
    <Flex
      mt={5}
      justify={{ base: "center", md: "space-between" }}
      align="center"
      flexDir={{ base: "column", md: "row" }}
      gap={3}
      wrap="wrap"
    >
      <Button
        h="30px"
        variant="outline"
        shadow="sm"
        borderColor="gray.300"
        px={3}
        display="flex"
        alignItems="center"
        gap={2}
        disabled={!meta?.prev}
        cursor={!meta?.prev ? "not-allowed" : "pointer"}
        onClick={() => {
          if (!meta?.prev) return;
          handlePageChange(currentPage - 1);
        }}
      >
        <ArrowLeft className="text-gray-500 w-4 h-auto" />
        <Text className="text-gray-500 text-sm font-medium">Previous</Text>
      </Button>

      <Flex
        as="ul"
        className="flex items-center gap-3"
        wrap="wrap"
        justify="center"
      >
        {paginateList.map((p, i) => {
          if (p === "...") {
            return (
              <Text key={i} className="text-gray-500">
                ...
              </Text>
            );
          }

          const pageNumber = p as number;
          const isActive = pageNumber === currentPage;

          return (
            <Text
              as="li"
              key={i}
              onClick={() => handlePageChange(pageNumber)}
              cursor="pointer"
              py={1.5}
              px={3}
              borderRadius="md"
              className={classNames(
                isActive ? "text-primary-600 bg-primary-50" : "text-gray-500",
                ""
              )}
            >
              {pageNumber}
            </Text>
          );
        })}
      </Flex>

      <Button
        h="30px"
        variant="outline"
        borderColor="gray.300"
        shadow="sm"
        px={3}
        display="flex"
        alignItems="center"
        gap={1.5}
        disabled={!meta?.next}
        onClick={() => {
          if (!meta?.next) return;
          handlePageChange(currentPage + 1);
        }}
        cursor={!meta?.next ? "not-allowed" : "pointer"}
      >
        <Text className="text-gray-500 text-sm font-medium">Next</Text>
        <ArrowRight className="text-gray-500 w-4 h-auto" />
      </Button>
    </Flex>
  );
};

export default ManualPagination;
