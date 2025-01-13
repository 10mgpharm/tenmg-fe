import { classNames } from "@/utils";
import { Button, HStack, Text } from "@chakra-ui/react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Dispatch, SetStateAction } from "react";
const Pagination = (
    {links, setPageCount, prevPageUrl, nextPageUrl, currentPage, firstPageUrl, lastPageUrl}: 
    {
        links: any, 
        setPageCount: Dispatch<SetStateAction<number>>, 
        prevPageUrl: string | null, 
        nextPageUrl: string | null,
        currentPage: number;
        firstPageUrl: any;
        lastPageUrl: any;
    }
    ) => {

    const isArrayFormat = Array.isArray(links);

    const paginateList = isArrayFormat
    ? links?.slice(1, -1) 
    : Array.from({ length: (lastPageUrl?.match(/page=(\d+)/)?.[1] || 1) }, (_, i) => ({
        label: (i + 1).toString(),
        url: firstPageUrl?.replace(/page=\d+/, `page=${i + 1}`),
        active: currentPage === i + 1
      }));

    const firstItem = isArrayFormat
    ? links?.[0]
    : { url: prevPageUrl, label: "Previous" };

    const lastItem = isArrayFormat
    ? links?.at(-1)
    : { url: nextPageUrl, label: "Next" };

    const handlePageChange = async (page: number) => {
        setPageCount(page);
    };

    return (
    <div>
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
                handlePageChange(currentPage - 1)}
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
                    onClick={() => handlePageChange(Number(item.label))} 
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
                handlePageChange(currentPage + 1)}
            }
            cursor={!lastItem?.url ? "not-allowed": "pointer"}
            >
                <Text className='text-gray-500 text-sm font-medium'>Next</Text>
                <ArrowRight className='text-gray-500 w-4 h-auto' />
            </Button>
        </HStack>
    </div>
  )
}

export default Pagination