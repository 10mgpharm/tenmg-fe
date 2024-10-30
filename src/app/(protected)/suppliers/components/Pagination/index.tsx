import { Button, HStack, Text } from "@chakra-ui/react"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface PaginationProps {
  allTableData?: {
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    prevPageUrl: string | null;
  };
  handlePrevious?: () => void;
  handleNext?: () => void;
  onPageChange?: (page: number) => void;
}

const Pagination = ({allTableData,  onPageChange, handlePrevious, handleNext}: PaginationProps) => {

  const pageNumbers = Array.from({ length: allTableData?.lastPage }, (_, index) => index + 1);

  return (
    <HStack mt={5} justify={"space-between"}>
      <Button h={"30px"} variant={"outline"} shadow={"sm"} borderColor={"gray.300"} px={3} display={"flex"} alignItems={"center"} gap={2} onClick={handlePrevious}  isDisabled={!allTableData?.prevPageUrl}>
        <ArrowLeft className='text-gray-500 w-4 h-auto' />
        <Text className='text-gray-500 text-sm font-medium'>Previous</Text>
      </Button>
      <ul className="flex items-center gap-5">
        {pageNumbers && pageNumbers.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`${
              pageNumber === allTableData?.currentPage
                ? "bg-primary-50 py-2 px-4 rounded-md text-primary-600"
                : "text-gray-500 cursor-pointer"
            }`}
            onClick={() => onPageChange && onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        ))}
      </ul>
      <Button h={"30px"} variant={"outline"} borderColor={"gray.300"} shadow={"sm"} px={3} display={"flex"} alignItems={"center"} gap={1.5} onClick={handleNext} isDisabled={!allTableData?.nextPageUrl}>
          <Text className='text-gray-500 text-sm font-medium'>Next</Text>
          <ArrowRight className='text-gray-500 w-4 h-auto' />
      </Button>
  </HStack>
  )
}

export default Pagination