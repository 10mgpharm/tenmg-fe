"use client";

import { Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BreadCrumbBanner from "../_components/BreadCrumbBanner";
import StoreProductCardComponent from "../_components/StoreProductCardComponent";
import EmptyProductScreen from "../_components/EmptyProductScreen";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import requestClient from "@/lib/requestClient";
import SearchSideBar from "../_components/searchSideBar";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon, ChevronsRightIcon } from "lucide-react";

export default function SearchPage() {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

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
      }`
    );
  }, [searchValue, filterCategory, filterValue, userData?.user?.token]);

  return (
    <section>
      <BreadCrumbBanner
        breadCrumbsData={searchValue ? breadCrumb : breadCrumb.slice(0, 2)}
      />
      <div className="grid grid-cols-4 gap-6  w-11/12 mx-auto my-10">
        <div className="col-span-1 sticky top-[120px] h-[90vh] border-x px-4 border-gray-200">
          <SearchSideBar />
        </div>

        <div className="col-span-3 min-h-screen">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Spinner />
            </div>
          ) : !isLoading && data.length < 1 && !searchValue ? (
            <EmptyProductScreen />
          ) : !isLoading && data.length < 1 && searchValue ? (
            <EmptyProductScreen
              searchValue={
                filterCategory ? `${searchValue}: ${filterValue}` : searchValue
              }
            />
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data.map((product, key) => (
                  <StoreProductCardComponent key={key} product={product} />
                ))}
              </div>

              {/* pagination */}
              <div>
                <button>
                  <ChevronLeftIcon />
                </button>
                <button>
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
