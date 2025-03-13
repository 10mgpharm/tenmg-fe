import { classNames } from "@/utils";
import { Button, HStack, Text } from "@chakra-ui/react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Dispatch, SetStateAction } from "react";

const Pagination = (
  {meta, setPageCount}: 
  {meta: any, setPageCount: Dispatch<SetStateAction<number>>}
) => {

  const isArrayFormat = Array.isArray(meta?.links);
  
  const paginateList = isArrayFormat
    ? meta?.links?.slice(1, -1) 
    : Array.from({ length: (meta?.last?.match(/page=(\d+)/)?.[1] || 1) }, (_, i) => ({
        label: (i + 1).toString(),
        url: meta?.first?.replace(/page=\d+/, `page=${i + 1}`),
        active: meta?.currentPage === i + 1
      }));

  const firstItem = isArrayFormat
    ? meta?.links?.[0]
    : { url: meta?.prev, label: "Previous" };
  
  const lastItem = isArrayFormat
    ? meta?.links?.at(-1)
    : { url: meta?.next, label: "Next" };

  const handlePageChange = async (page: number) => {
    setPageCount(page);
  };

  return (
    <HStack mt={5} justify={"space-between"}>
      <Button 
      h={"30px"} 
      variant={"outline"} 
      shadow={"sm"} 
      borderColor={"gray.300"} 
      px={3} 
      display={"flex"} 
      alignItems={"center"} 
      gap={2}
      disabled={!firstItem?.url}
      cursor={!firstItem?.url ? "not-allowed": "pointer"}
      onClick={() => {
        if(!firstItem?.url) return;
        handlePageChange(meta?.currentPage - 1)}
      }
      >
        <ArrowLeft className='text-gray-500 w-4 h-auto' />
        <Text className='text-gray-500 text-sm font-medium'>Previous</Text>
      </Button>
      <ul className="flex items-center gap-3">
        {
          paginateList ?
          (paginateList?.map((item: any, index: number) => (
            <li 
            onClick={() => handlePageChange(Number(item.label))
            } 
            key={index} 
            className={classNames(
              item.active ? 
              "text-primary-600 bg-primary-50" : 
              "text-gray-500", 
              "  py-1.5 px-3 rounded-md cursor-pointer")}>
              {item.label}
            </li>
          )))
          : <li className="py-1.5 px-3 rounded-md cursor-pointer text-primary-500 bg-blue-50">1</li>
        }
      </ul>
      <Button 
      h={"30px"} 
      variant={"outline"} 
      borderColor={"gray.300"} 
      shadow={"sm"} 
      px={3} 
      display={"flex"} 
      alignItems={"center"} 
      gap={1.5}
      disabled={!lastItem?.url}
      onClick={() => {
        if(!lastItem?.url) return;
        handlePageChange(meta?.currentPage + 1)}
      }
      cursor={!lastItem?.url ? "not-allowed": "pointer"}
      >
          <Text className='text-gray-500 text-sm font-medium'>Next</Text>
          <ArrowRight className='text-gray-500 w-4 h-auto' />
      </Button>
    </HStack>
  );
};

export default Pagination;
