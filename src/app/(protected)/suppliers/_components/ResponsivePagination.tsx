import { classNames } from "@/utils";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Select } from '@chakra-ui/react'

const NewPagination = ({
  meta,
  setPageCount,
  compact = true,

}: {
  meta: any;
  setPageCount: Dispatch<SetStateAction<number>>;
  compact?: boolean;
}) => {
  const isArrayFormat = Array.isArray(meta?.links);

  // const paginateList = isArrayFormat
  //   ? meta?.links?.slice(1, -1)
  //   : Array.from(
  //     { length: meta?.last?.match(/page=(\d+)/)?.[1] || 1 },
  //     (_, i) => ({
  //       label: (i + 1).toString(),
  //       url: meta?.first?.replace(/page=\d+/, `page=${i + 1}`),
  //       active: meta?.currentPage === i + 1,
  //     })
  //   );

  const paginateList = isArrayFormat
    ? meta?.links?.slice(1, -1)
    : Array.from(
      { length: meta?.last?.match(/page=(\d+)/)?.[1] || 1 },
      (_, i) => ({
        label: (i + 1).toString(),
        url: meta?.first?.replace(/page=\d+/, `page=${i + 1}`),
        active: meta?.currentPage === i + 1,
      })
    );

  // Apply compact logic if `compact` is true
  if (compact && !isArrayFormat && paginateList?.length > 5) {
    const firstTwo = paginateList.slice(0, 2);
    const lastTwo = paginateList.slice(-2);
    const ellipsisItem = { url: null, label: "...", active: false };
    return [...firstTwo, ellipsisItem, ...lastTwo];
  }

  // return paginateList;

  // console.log("paginationList, ", paginateList);

  const cpfunc = (paginationList) => {
    const d = [];
    // console.log("paginationList, ", paginationList);
    // console.log("compact, ", compact);
    // console.log("isArrayFormat, ", isArrayFormat);

    if (paginationList?.length >= 5) {
      if (compact) {
        const firstTwo = paginationList.slice(0, 1);
        const lastTwo = paginationList.slice(-4);
        const ellipsisItem = { url: null, label: "...", active: false };
        lastTwo.splice(2, 1);
        // d.push(...firstTwo, ...lastTwo);
        d.push(...firstTwo, ellipsisItem, ...lastTwo);

        console.log("paginationList, ", paginationList);
        console.log("firstTwo, ", firstTwo);
        console.log("lastTwo, ", lastTwo);
      }
      // if (compact && !isArrayFormat && paginationList?.length > 5) {
      //   const firstTwo = paginationList.slice(0, 2);
      //   const lastTwo = paginationList.slice(-2);
      //   const ellipsisItem = { url: null, label: "...", active: false };
      //   d.push(...firstTwo, ellipsisItem, ...lastTwo);
      //   // return [...firstTwo, ellipsisItem, ...lastTwo];
      // }

    } else {
      d.push(...paginationList);
    }
    return d;
  }


  const cPL = cpfunc(paginateList);
  console.log("cPL, ", cPL);

  const firstItem = isArrayFormat
    ? meta?.links?.[0]
    : { url: meta?.prev, label: "Previous" };

  const lastItem = isArrayFormat
    ? meta?.links?.at(-1)
    : { url: meta?.next, label: "Next" };

  const handlePageChange = (page: number) => {
    setPageCount(page);
  };

  return (
    <Flex
      mt={5}
      wrap="wrap"
      justify="space-between"
      align="center"
      gap={3}
      w="100%"
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
        disabled={!firstItem?.url}
        cursor={!firstItem?.url ? "not-allowed" : "pointer"}
        onClick={() => {
          if (!firstItem?.url) return;
          handlePageChange(meta?.currentPage - 1);
        }}
      >
        <ArrowLeft className="text-gray-500 w-4 h-auto" />
        {/* <Text fontSize="sm" color="gray.500" fontWeight="medium">
          Previous
        </Text> */}
      </Button>

      <Box
        as="ul"
        display="flex"
        gap={2}
        flexWrap="wrap"
        justifyContent="center"
        flexGrow={1}
        mx="auto"
      >
        {cPL ? (
          cPL.map((item: any, index: number) => (
            <Box
              as="li"
              onClick={() => handlePageChange(Number(item.label))}
              key={index}
              className={classNames(
                item.active
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-500",
                "py-1.5 px-3 rounded-md cursor-pointer text-sm"
              )}
            >
              {item.label}
            </Box>
          ))
        ) : (
          <Box
            as="li"
            className="py-1.5 px-3 rounded-md cursor-pointer text-primary-500 bg-blue-50"
          >
            1
          </Box>
        )}
      </Box>

      <Button
        h="30px"
        variant="outline"
        borderColor="gray.300"
        shadow="sm"
        px={3}
        display="flex"
        alignItems="center"
        gap={1.5}
        disabled={!lastItem?.url}
        onClick={() => {
          if (!lastItem?.url) return;
          handlePageChange(meta?.currentPage + 1);
        }}
        cursor={!lastItem?.url ? "not-allowed" : "pointer"}
      >
        {/* <Text fontSize="sm" color="gray.500" fontWeight="medium">
          Next
        </Text> */}
        <ArrowRight className="text-gray-500 w-4 h-auto" />
      </Button>
    </Flex>
  );
};

export default NewPagination;
