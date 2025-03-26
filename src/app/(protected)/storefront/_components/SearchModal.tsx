"use client";

import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";
import { useDebouncedValue } from "@/utils/debounce";
import {
  Button,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";

const SearchModal = ({
  isSearchOpen,
  handleCloseSearch,
}: {
  isSearchOpen: boolean;
  handleCloseSearch: () => void;
}) => {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const debouncedSearch = useDebouncedValue(searchValue, 500);

  // Fetch FNs
  const fetchData = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await requestClient({
        token: userData?.user?.token,
      }).get(url);
      setData([...response?.data?.data?.data]);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!userData || searchValue.trim() === "") return;
    fetchData(`/storefront/products/search?search=${debouncedSearch.trim()}`);
  }, [debouncedSearch, userData?.user?.token]);

  const handleSearch = (selectedValue?: string) => {
    if (!selectedValue && !searchValue.trim()) return handleCloseSearch();

    const newParams = new URLSearchParams(searchParams.toString());

    if (selectedValue) {
      newParams.set("searchValue", selectedValue.trim());

      router.push(`/storefront/search?${newParams.toString()}`);
      handleCloseSearch();

      return;
    }

    if (searchValue) {
      newParams.set("searchValue", searchValue.trim());
    } else {
      // If the new value is empty, remove the parameter
      newParams.delete("searchValue");
    }

    router.push(`/storefront/search?${newParams.toString()}`);
    handleCloseSearch();
  };

  // When enter btn is clicked
  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  return (
    <Modal isOpen={isSearchOpen} onClose={handleCloseSearch}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody className=" !p-2 !rounded-lg">
          <InputGroup size="md">
            <InputLeftElement>
              <IconButton
                size="sm"
                bgColor={"transparent"}
                _hover={{
                  bg: "transparent",
                }}
                aria-label="search"
              >
                <FiSearch className="text-gray-400" />
              </IconButton>
            </InputLeftElement>
            <Input
              className=" p-[10px_14px] w-full gap-2 rounded-lg border-1 border-gray-300"
              type={"text"}
              placeholder="Search for a product or manufacturer"
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              tabIndex={1}
            />
            <InputRightElement width="4.5rem">
              <Button
                variant={"solid"}
                size="sm"
                loadingText="Searching"
                disabled={searchValue.trim() === ""}
                mr={1}
                onClick={() => handleSearch()}
              >
                Search
              </Button>
            </InputRightElement>
          </InputGroup>

          {/* Add condition to show */}
          {searchValue.trim() !== "" && data.length === 0 && !isLoading ? (
            <>
              <Text className="text-center text-[15px] text-gray-600 mt-2 ">
                No results found for your search.
              </Text>
              <Text className="text-center text-[15px] text-gray-600 ">
                Try using different keywords.
              </Text>
            </>
          ) : searchValue.trim() !== "" && isLoading ? (
            <p className="text-[15px] text-gray-700 text-center mt-2">
              Loading...
            </p>
          ) : searchValue.trim() !== "" && data.length > 0 ? (
            <div className="mt-2 max-h-[300px] overflow-y-scroll">
              {data.map((i, key) => (
                <p
                  key={key}
                  className="w-full text-[15px] py-2 px-2 hover:bg-primary-50 cursor-pointer"
                  onClick={() => handleSearch(i.name)}
                >
                  {i.name}
                </p>
              ))}
            </div>
          ) : null}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchModal;
