import { MetaDataProp } from "@/types";
import { classNames } from "@/utils";
import { Button, HStack, Text } from "@chakra-ui/react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Dispatch, SetStateAction } from "react";

const Pagination = ({meta, setPageCount, actionFn}: {meta: any, setPageCount: Dispatch<SetStateAction<number>>, actionFn: any}) => {
  console.log(meta);
  const paginateList = meta?.links?.slice(1, -1);
  const lastItem = meta?.links?.at(-1);
  const firstItem = meta?.links?.at(0);
  console.log(lastItem);

  const handlePageChange = async (page: string) => {
    const formatPage = Number(page);
    setPageCount(formatPage);
    // actionFn();
  }
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
      disabled={!firstItem?.isActive}
      cursor={!firstItem?.isActive ? "not-allowed": "pointer"}
      >
        <ArrowLeft className='text-gray-500 w-4 h-auto' />
        <Text className='text-gray-500 text-sm font-medium'>Previous</Text>
      </Button>
      <ul className="flex items-center gap-3">
        {
          paginateList?.map((item: any, index: number) => (
            <li 
            onClick={() => handlePageChange(item.label)} 
            key={index} 
            className={classNames(item.active ? "text-primary-600 bg-primary-50" : "text-gray-500 ", "  py-1.5 px-3 rounded-md cursor-pointer")}>
              {item.label}
            </li>
          ))
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
      disabled={!lastItem?.isActive}
      cursor={!lastItem?.isActive ? "not-allowed": "pointer"}
      >
          <Text className='text-gray-500 text-sm font-medium'>Next</Text>
          <ArrowRight className='text-gray-500 w-4 h-auto' />
      </Button>
  </HStack>
  )
}

export default Pagination