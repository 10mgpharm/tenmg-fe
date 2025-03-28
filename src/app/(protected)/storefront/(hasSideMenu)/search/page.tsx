"use client";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BreadCrumbBanner from "../../_components/BreadCrumbBanner";
import StoreProductCardComponent from "../../_components/StoreProductCardComponent";
import EmptyProductScreen from "../../_components/EmptyProductScreen";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import requestClient from "@/lib/requestClient";
import SearchSideBar from "../../_components/searchSideBar";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Navbar from "../../_components/Navbar";

export default function SearchPage() {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMobileFilter, setOpenMobileFilter] = useState(false);

  const searchParams = useSearchParams();
  const filterCategory = searchParams.get("filterCategory");
  const filterValue = searchParams.get("filterValue");
  const searchValue = searchParams.get("searchValue");

  const breadCrumb = [
    {
      text: "Home",
      link: "/",
    },
    {
      text: "Products",
      link: "/storefront",
    },
    {
      text: `Search Result for ${searchValue ?? ""}`,
      link: "#",
    },
  ];

  // Fetch FNs
  const fetchData = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await requestClient({
        token: userData?.user?.token,
      }).get(url);
      setData([...response?.data?.data.data]);
      setLastPage(response?.data.data.lastPage);
      setCurrentPage(response?.data?.data.currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!userData) return;
    fetchData(
      `/storefront/products/search?search=${searchValue}${
        filterValue ? "&" + filterCategory + "=" + filterValue : ""
      }&status=ACTIVE&active=active&inventory=OUT OF STOCK,LOW STOCK,IN STOCK`
    );
  }, [searchValue, filterCategory, filterValue, userData?.user?.token]);

  return (
    <>
      <Navbar OpenMenu={setOpenMobileFilter} />

      <section>
        <BreadCrumbBanner
          breadCrumbsData={searchValue ? breadCrumb : breadCrumb.slice(0, 2)}
        />
        <div className="grid grid-cols-4 gap-6  w-11/12 mx-auto my-10">
          <div className="hidden lg:block col-span-1 sticky top-[120px] h-[90vh] border-x px-4 border-gray-200 ">
            <SearchSideBar />
          </div>

          <div className="col-span-full lg:col-span-3   min-h-screen">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner />
              </div>
            ) : !isLoading && data.length < 1 && !searchValue ? (
              <EmptyProductScreen />
            ) : !isLoading && data.length < 1 && searchValue ? (
              <EmptyProductScreen
                searchValue={
                  filterCategory
                    ? `${searchValue}: ${filterValue}`
                    : searchValue
                }
              />
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4  max-md:place-items-center">
                  {data.map((product, key) => (
                    <StoreProductCardComponent key={key} product={product} />
                  ))}
                </div>

                {/* pagination */}
                {lastPage > currentPage && (
                  <div className="flex justify-center w-full gap-4 mt-10">
                    <Button
                      className="!bg-primary-100 !h-fit !text-gray-900 border-gray-25 !px-4 !py-2 rounded-lg"
                      disabled={currentPage === 1}
                    >
                      <ChevronLeftIcon size={18} />
                    </Button>
                    <Button
                      className="!bg-primary-100  !h-fit  !text-gray-900 border-gray-25 !px-4 !py-2 rounded-lg"
                      disabled={lastPage === currentPage}
                    >
                      <ChevronRightIcon size={18} />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <MobileFilterComponent
          isOpen={openMobileFilter}
          setIsOpen={setOpenMobileFilter}
        />
      </section>
    </>
  );
}

const MobileFilterComponent = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={() => {
        setIsOpen(false);
      }}
      size="sm"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Filter Your Search</DrawerHeader>
        <DrawerBody>
          <SearchSideBar setIsOpen={setIsOpen} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
