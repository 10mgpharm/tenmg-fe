import { Button, HStack, Text, List, ListItem } from "@chakra-ui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  table: any; // Ideally, replace 'any' with the type returned by useReactTable for better type safety
}

const Pagination = ({ table }: PaginationProps) => {
  // Get pagination state and methods from the table instance
  const {
    getCanPreviousPage,
    getCanNextPage,
    getPageCount,
    getState,
    setPageIndex,
    previousPage,
    nextPage,
  } = table;

  const { pageIndex } = getState().pagination;

  // Generate page numbers array dynamically
  const pageNumbers = Array.from({ length: getPageCount() }, (_, index) => index + 1);

  return (
    <HStack mt={5} justify={"center"} spacing={4}>
      {/* Previous Button */}
      <Button
        h={"30px"}
        variant={"outline"}
        shadow={"sm"}
        borderColor={"gray.300"}
        px={3}
        display={"flex"}
        alignItems={"center"}
        gap={2}
        onClick={previousPage}
        disabled={!getCanPreviousPage()}
      >
        <ArrowLeft className="text-gray-500 w-4 h-auto" />
        <Text className="text-gray-500 text-sm font-medium">Previous</Text>
      </Button>

      {/* Page Numbers */}
      <List className="flex items-center gap-2">
        {pageNumbers.map((pageNumber) => (
          <ListItem
            key={pageNumber}
            onClick={() => setPageIndex(pageNumber - 1)}
            className={`cursor-pointer py-1 px-3 rounded-md ${
              pageIndex + 1 === pageNumber
                ? "bg-primary-50 text-primary-600"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {pageNumber}
          </ListItem>
        ))}
      </List>

      {/* Next Button */}
      <Button
        h={"30px"}
        variant={"outline"}
        borderColor={"gray.300"}
        shadow={"sm"}
        px={3}
        display={"flex"}
        alignItems={"center"}
        gap={1.5}
        onClick={nextPage}
        disabled={!getCanNextPage()}
      >
        <Text className="text-gray-500 text-sm font-medium">Next</Text>
        <ArrowRight className="text-gray-500 w-4 h-auto" />
      </Button>
    </HStack>
  );
};

export default Pagination;
