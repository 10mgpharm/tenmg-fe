import { Select } from "@chakra-ui/react";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const SearchSideBar = ({
  setIsOpen,
}: {
  setIsOpen?: (value: boolean) => void;
}) => {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("searchValue");

  // category states
  const [isLoadingCategory, setIsLoadingCatgeory] = useState(false);
  const [categoryCurrentPage, setCategoryCurrentPage] = useState(1);
  const [categoryTotalPage, setCategoryTotalPage] = useState(1);
  const [listOfCategory, setListOfCategory] = useState([]);
  const [categoryNextPageUrl, setCategoryNextPageUrl] = useState("");
  const [categoryValue, setCategoryValue] = useState("");

  // brand states
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [brandCurrentPage, setBrandCurrentPage] = useState(1);
  const [brandTotalPage, setBrandTotalPage] = useState(1);
  const [listOfBrands, setListOfBrands] = useState([]);
  const [brandNextPageUrl, setBrandNextPageUrl] = useState("");
  const [brandValue, setbrandValue] = useState("");

  // measurements
  const [isLoadingMeasurements, setIsLoadingMeasurements] = useState(false);
  const [measurementsCurrentPage, setMeasurementsCurrentPage] = useState(1);
  const [measurementsTotalPage, setMeasurementsTotalPage] = useState(1);
  const [listOfMeasurements, setListOfMeasurements] = useState([]);
  const [measurementNextPageUrl, setMeasurementNextPageUrl] = useState("");
  const [measurementValue, setMeasurementValue] = useState("");

  // medical types
  const [isLoadingMedicationTypes, setIsLoadingMedicationTypes] =
    useState(false);
  const [medicationTypesCurrentPage, setMedicationTypesCurrentPage] =
    useState(1);
  const [medicationTypesTotalPage, setMedicationTypesTotalPage] = useState(1);
  const [listOfMedicationTypes, setListOfMedicationTypes] = useState([]);
  const [medTypeNextPageUrl, setMedTypeNextPageUrl] = useState("");
  const [medTypeValue, setMedTypesValue] = useState("");

  // presentations
  const [isLoadingPresentations, setIsLoadingPresentations] = useState(false);
  const [presentationCurrentPage, setPresentationCurrentPage] = useState(1);
  const [presentationsTotalPage, setPresentationsTotalPage] = useState(1);
  const [listOfPresentations, setListOfPresentations] = useState([]);
  const [presentationNextPageUrl, setPresenttationNextPageUrl] = useState("");
  const [presentationtValue, setPresentationValue] = useState("");

  // Reset effect
  useEffect(() => {
    setCategoryValue("");
    setbrandValue("");
    setMeasurementValue("");
    setMedTypesValue("");
    setPresentationValue("");
    setParams("", "");
  }, [searchValue]);

  // Fetch FNs
  const fetchData = async (
    url: string,
    setter: (value: any) => void,
    prevValues: any[],
    setLoader: (value: boolean) => void,
    setLastPage: (value: number) => void,
    setCurrentPage: (value: number) => void,
    setNextPageUrl: (value: string) => void,
    currentPage: number
  ) => {
    setLoader(true);
    try {
      const response = await requestClient({
        token: userData?.user?.token,
      }).get(url);

      setter(
        currentPage === response?.data.data.currentPage
          ? [...response.data.data.data]
          : [...prevValues, ...response.data.data.data]
      );
      setLastPage(response?.data.data.lastPage);
      setCurrentPage(response?.data.data.currentPage);
      setNextPageUrl(response?.data.data.nextPageUrl);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
    setLoader(false);
  };

  // const fetch categories
  const fetchCategories = (url: string) => {
    fetchData(
      url,
      setListOfCategory,
      listOfCategory,
      setIsLoadingCatgeory,
      setCategoryTotalPage,
      setCategoryCurrentPage,
      setCategoryNextPageUrl,
      categoryCurrentPage
    );
  };

  // fecth brands
  const fetchBrands = (url: string) => {
    fetchData(
      url,
      setListOfBrands,
      listOfBrands,
      setIsLoadingBrands,
      setBrandTotalPage,
      setBrandCurrentPage,
      setBrandNextPageUrl,
      brandCurrentPage
    );
  };

  // fetch measurements
  const fetchMeasurements = (url: string) => {
    fetchData(
      url,
      setListOfMeasurements,
      listOfMeasurements,
      setIsLoadingMeasurements,
      setMeasurementsTotalPage,
      setMeasurementsCurrentPage,
      setMeasurementNextPageUrl,
      measurementsCurrentPage
    );
  };

  const fetchMedType = (url: string) => {
    fetchData(
      url,
      setListOfMedicationTypes,
      listOfMedicationTypes,
      setIsLoadingMedicationTypes,
      setMedicationTypesTotalPage,
      setMedicationTypesCurrentPage,
      setMedTypeNextPageUrl,
      medicationTypesCurrentPage
    );
  };

  const fetchPresentation = (url: string) => {
    fetchData(
      url,
      setListOfPresentations,
      listOfPresentations,
      setIsLoadingPresentations,
      setPresentationsTotalPage,
      setPresentationCurrentPage,
      setPresenttationNextPageUrl,
      presentationCurrentPage
    );
  };

  useEffect(() => {
    if (!userData?.user?.token) return;

    // fecth categories
    fetchCategories("/storefront/categories/search");

    // fetch brands
    fetchBrands("/storefront/brands");

    // fetch measurements
    fetchMeasurements("/storefront/measurements");

    // fetch medication type
    fetchMedType("/storefront/medication-types");

    // fetch presentation
    fetchPresentation("/storefront/presentations");
  }, [userData?.user?.token]);

  //
  const setParams = (filterCategory: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (value) {
      newParams.set("filterCategory", filterCategory);
      newParams.set("filterValue", value);
    } else {
      // If the new value is empty, remove the parameter
      newParams.delete("filterCategory");
      newParams.delete("filterValue");
    }

    router.push(`?${newParams.toString()}`);
  };

  const handleFilterState = (
    filterType: "cate" | "brands" | "measure" | "medTye" | "present",
    value: string
  ) => {
    switch (filterType) {
      case "cate":
        setCategoryValue(value);
        setbrandValue("");
        setMeasurementValue("");
        setMedTypesValue("");
        setPresentationValue("");
        break;

      case "brands":
        setCategoryValue("");
        setbrandValue(value);
        setMeasurementValue("");
        setMedTypesValue("");
        setPresentationValue("");
        break;

      case "measure":
        setCategoryValue("");
        setbrandValue("");
        setMeasurementValue(value);
        setMedTypesValue("");
        setPresentationValue("");
        break;

      case "medTye":
        setCategoryValue("");
        setbrandValue("");
        setMeasurementValue("");
        setMedTypesValue(value);
        setPresentationValue("");
        break;

      case "present":
        setCategoryValue("");
        setbrandValue("");
        setMeasurementValue("");
        setMedTypesValue("");
        setPresentationValue(value);
        break;
    }
  };

  return (
    <div className=" space-y-4 size-full">
      {/* list of categoris */}

      <Select
        className={cn(
          "!border-gray-400 !h-[52px] !px-5",
          categoryValue !== "" ? "!bg-primary-50" : ""
        )}
        placeholder={
          isLoadingCategory && listOfCategory.length < 1
            ? "Loading..."
            : "Categories"
        }
        disabled={isLoadingCategory && listOfCategory.length < 1}
        onChange={(e) => {
          if (e.target.value === "Loading more...") {
            fetchCategories(categoryNextPageUrl);
            return;
          }
          handleFilterState("cate", e.target.value);
          setParams("categories", e.target.value);
          setIsOpen && setIsOpen(false);
        }}
        value={categoryValue}
      >
        {listOfCategory.length < 1 ? (
          <option value="" disabled>
            No data
          </option>
        ) : (
          <>
            <SelectDropDown
              data={listOfCategory}
              canLoadMore={categoryTotalPage > categoryCurrentPage}
              isLoading={isLoadingCategory}
            />
          </>
        )}
      </Select>

      {/* Brands */}
      <Select
        className={cn(
          "!border-gray-400 !h-[52px] !px-5",
          brandValue !== "" ? "!bg-primary-50" : ""
        )}
        placeholder={
          isLoadingBrands && listOfBrands.length < 1 ? "Loading..." : "Brands"
        }
        disabled={isLoadingBrands && listOfCategory.length < 1}
        onChange={(e) => {
          if (e.target.value === "Loading more...") {
            fetchBrands(brandNextPageUrl);
            return;
          }
          handleFilterState("brands", e.target.value);
          setParams("brands", e.target.value);
          setIsOpen && setIsOpen(false);
        }}
        value={brandValue}
      >
        {listOfBrands.length < 1 ? (
          <option value="" disabled>
            No data
          </option>
        ) : (
          <SelectDropDown
            data={listOfBrands}
            canLoadMore={brandTotalPage > brandCurrentPage}
            isLoading={isLoadingBrands}
          />
        )}
      </Select>

      {/* measurements  */}
      <Select
        className={cn(
          "!border-gray-400 !h-[52px] !px-5",
          measurementValue !== "" ? "!bg-primary-50" : ""
        )}
        placeholder={
          isLoadingMeasurements && listOfMeasurements.length < 1
            ? "Loading..."
            : "Measurements"
        }
        disabled={isLoadingMeasurements && listOfMeasurements.length < 1}
        onChange={(e) => {
          if (e.target.value === "Loading more...") {
            fetchMeasurements(measurementNextPageUrl);
            return;
          }
          handleFilterState("measure", e.target.value);
          setParams("measurements", e.target.value);
          setIsOpen && setIsOpen(false);
        }}
        value={measurementValue}
      >
        {listOfMeasurements.length < 1 ? (
          <option value="" disabled>
            No data
          </option>
        ) : (
          <SelectDropDown
            data={listOfMeasurements}
            canLoadMore={measurementsTotalPage > measurementsCurrentPage}
            isLoading={isLoadingMeasurements}
          />
        )}
      </Select>

      {/* medication types */}
      <Select
        className={cn(
          "!border-gray-400 !h-[52px] !px-5",
          medTypeValue !== "" ? "!bg-primary-50" : ""
        )}
        placeholder={
          isLoadingMedicationTypes && listOfMedicationTypes.length < 1
            ? "Loading..."
            : "Medication types"
        }
        disabled={isLoadingMedicationTypes && listOfMedicationTypes.length < 1}
        onChange={(e) => {
          if (e.target.value === "Loading more...") {
            fetchMedType(medTypeNextPageUrl);
            return;
          }
          handleFilterState("medTye", e.target.value);
          setParams("medicationTypes", e.target.value);
          setIsOpen && setIsOpen(false);
        }}
        value={medTypeValue}
      >
        {listOfMedicationTypes.length < 1 ? (
          <option value="" disabled>
            No data
          </option>
        ) : (
          <SelectDropDown
            data={listOfMedicationTypes}
            canLoadMore={medicationTypesTotalPage > medicationTypesCurrentPage}
            isLoading={isLoadingMedicationTypes}
          />
        )}
      </Select>

      {/* presentations */}
      <Select
        className={cn(
          "!border-gray-400 !h-[52px] !px-5",
          presentationtValue !== "" ? "!bg-primary-50" : ""
        )}
        placeholder={
          isLoadingPresentations && listOfPresentations.length < 1
            ? "Loading..."
            : "Presentations"
        }
        disabled={isLoadingPresentations && listOfPresentations.length < 1}
        onChange={(e) => {
          if (e.target.value === "Loading more...") {
            fetchPresentation(presentationNextPageUrl);
            return;
          }
          handleFilterState("present", e.target.value);
          setParams("presentations", e.target.value);
          setIsOpen && setIsOpen(false);
        }}
        value={presentationtValue}
      >
        {listOfPresentations.length < 1 ? (
          <option value="" disabled>
            No data
          </option>
        ) : (
          <SelectDropDown
            data={listOfPresentations}
            canLoadMore={presentationsTotalPage > presentationCurrentPage}
            isLoading={isLoadingPresentations}
          />
        )}
      </Select>
    </div>
  );
};

export default SearchSideBar;

type SelectDropDownProps = {
  data: any[];
  canLoadMore: boolean;
  isLoading: boolean;
};

const SelectDropDown = ({
  data,
  canLoadMore,
  isLoading,
}: SelectDropDownProps) => {
  return (
    <>
      <>
        {data.map((i, key) => (
          <option key={key} value={i.name}>
            {i.name}
          </option>
        ))}
      </>
      {canLoadMore && !isLoading ? (
        <option
          className="text-center pointer-events-auto bg-red-500"
          value={"Loading more..."}
        >
          Load more
        </option>
      ) : isLoading ? (
        <option disabled className="text-center">
          Loading ...
        </option>
      ) : (
        <></>
      )}
    </>
  );
};
