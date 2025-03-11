"use client";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import LoanAutoAccept from "./LoanAutoAccept";
import requestClient from "@/lib/requestClient";
import { handleServerErrorMessage } from "@/utils";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import ReactSelect from "react-select";

interface OptionType {
  label: string;
  value: number;
}

interface CreditScoreOption {
  label: string;
  value: string;
}

interface CategoryOptionType {
  loanAbove: number;
  value: string;
  label: string;
}

interface IFormInput {
  loanTenure: OptionType[];
  loanInterest: string;
  creditScoreCategory: CreditScoreOption[];
}

export default function LoanPreferenceComp() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInfoLoading, setIsInfoLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [loanTenurePrefill, setLoanTenurePrefill] = useState<any>(null);

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      loanTenure: [],
      loanInterest: "",
      creditScoreCategory: [],
    },
  });

  // Fetch prefill data (loan tenure options and categories)
  const fetchLoanTenurePrefill = useCallback(async () => {
    setIsInfoLoading(true);
    try {
      const response = await requestClient({
        token: sessionData?.user?.token,
      }).get(`/lender/settings/get-loan-preferences-prefill`);
      if (response.status === 200) {
        setLoanTenurePrefill(response.data.data);
        setIsInfoLoading(false);
      }
    } catch (error) {
      setIsInfoLoading(false);
      console.error(error);
    }
  }, [sessionData?.user?.token]);

  useEffect(() => {
    if (sessionData?.user?.token) {
      fetchLoanTenurePrefill();
    }
  }, [sessionData?.user?.token, fetchLoanTenurePrefill]);

  // Compute loan tenure options from prefill data
  const loanTenureOptions: OptionType[] =
    loanTenurePrefill?.loanTenure || loanTenurePrefill?.data?.loanTenure || [];

  // Use default categories if none are provided by the endpoint
  const defaultCategories: CategoryOptionType[] = [
    { value: "A", loanAbove: 75, label: "Category A (Above 75%)" },
    { value: "B", loanAbove: 50, label: "Category B (Above 50%)" },
    { value: "C", loanAbove: 25, label: "Category C (Above 25%)" },
    { value: "D", loanAbove: 0, label: "Category D (Below 25%)" },
  ];
  const creditScoreCategoryOptions: CategoryOptionType[] =
    loanTenurePrefill?.categories ||
    loanTenurePrefill?.data?.categories ||
    defaultCategories;

  // Fetch existing loan preferences after prefill data is loaded
  useEffect(() => {
    const fetchLoanPreferences = async () => {
      try {
        const response = await requestClient({
          token: sessionData?.user?.token,
        }).get("/lender/settings/get-loan-preferences");

        const { loanTenure, loanInterest, creditScoreCategory, autoAccept } =
          response.data.data;

        // Map loanTenure numbers to OptionType objects
        const tenureOptions =
          Array.isArray(loanTenure) && loanTenure.length > 0
            ? loanTenure.map((t: number) => ({
                value: t,
                label: `${t} months`,
              }))
            : [];

        // Map the returned credit score categories (e.g. ["A", "B"]) to option objects.
        let selectedCategoryOptions: CreditScoreOption[] = [];
        if (
          Array.isArray(creditScoreCategory) &&
          creditScoreCategory.length > 0
        ) {
          selectedCategoryOptions = creditScoreCategory.map(
            (catVal: string) => {
              const found = creditScoreCategoryOptions.find(
                (cat: CategoryOptionType) => cat.value === catVal
              );
              return found
                ? {
                    value: found.value,
                    label: `Category ${found.value} (Above ${found.loanAbove}%)`,
                  }
                : { value: catVal, label: `Category ${catVal}` };
            }
          );
        }

        setValue("loanTenure", tenureOptions);
        setValue("loanInterest", loanInterest);
        setValue("creditScoreCategory", selectedCategoryOptions);
        setStatus(autoAccept);
      } catch (error: any) {
        toast.error(handleServerErrorMessage(error));
      }
    };

    if (sessionData?.user?.token && loanTenurePrefill) {
      fetchLoanPreferences();
    }
  }, [
    setValue,
    sessionData?.user?.token,
    loanTenurePrefill,
    creditScoreCategoryOptions,
  ]);

  const selectedTenure = watch("loanTenure");
  const selectedCategory = watch("creditScoreCategory");

  // Update the interest rate based on selected loan tenure and categories
  useEffect(() => {
    if (selectedTenure.length && selectedCategory.length) {
      setValue(
        "loanInterest",
        loanTenurePrefill?.interestRate ||
          "Your interest 15%, Processing fee (0%)"
      );
    } else {
      setValue("loanInterest", "");
    }
  }, [selectedTenure, selectedCategory, setValue, loanTenurePrefill]);

  // onSubmit handler
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        loanTenure: data.loanTenure.map((option) => option.value),
        creditScoreCategory: data.creditScoreCategory.map(
          (option) => option.value
        ),
      };

      await requestClient({
        token: sessionData?.user?.token,
      }).patch("/lender/settings/update-loan-preferences", payload);

      toast.success("Loan preferences updated successfully!");
    } catch (error: any) {
      toast.error(handleServerErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-5 w-full flex justify-between py-5">
          <div>
            <h3 className="font-semibold text-lg">Loan Information</h3>
            <Text fontSize={"14px"} color={"gray.500"}>
              Define your preferences for loan disbursement.
            </Text>
          </div>
          <Button
            type="submit"
            size="sm"
            variant="solid"
            colorScheme="primary"
            isDisabled={isLoading}
            isLoading={isLoading}
            loadingText="Submitting"
          >
            Save Changes
          </Button>
        </div>

        <div className="p-5 rounded-lg bg-white/70 border border-slate-300">
          {/* Loan Tenure Multiselect */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-4">
            <div>
              <FormLabel m={0}>Loan Tenure Option</FormLabel>
              <Text fontSize={"14px"} color={"gray.500"}>
                Loan duration
              </Text>
            </div>
            <Skeleton isLoaded={!isInfoLoading}>
              <FormControl
                className="col-span-2"
                isInvalid={!!errors.loanTenure}
              >
                <Controller
                  control={control}
                  name="loanTenure"
                  rules={{ required: "Loan Tenure is required" }}
                  render={({ field: { onChange, value } }) => (
                    <ReactSelect
                      isClearable
                      isSearchable
                      isMulti
                      options={loanTenureOptions}
                      placeholder="Select Loan Tenure"
                      closeMenuOnSelect={false}
                      onChange={(selectedOptions: OptionType[]) =>
                        onChange(selectedOptions)
                      }
                      value={value}
                    />
                  )}
                />
                {errors.loanTenure && (
                  <p className="text-red-500">{errors.loanTenure.message}</p>
                )}
              </FormControl>
            </Skeleton>
          </div>

          {/* Customer Credit Score Category Multiselect */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-4">
            <div>
              <FormLabel m={0}>Customer Credit Score Category</FormLabel>
              <Text fontSize={"14px"} color={"gray.500"}>
                Specify the customer categories you would like to give credit to
              </Text>
            </div>
            <Skeleton isLoaded={!isInfoLoading}>
              <FormControl
                className="col-span-2"
                isInvalid={!!errors.creditScoreCategory}
              >
                <Controller
                  control={control}
                  name="creditScoreCategory"
                  rules={{ required: "Credit Score Category is required" }}
                  render={({ field: { onChange, value } }) => (
                    <ReactSelect
                      isClearable
                      isSearchable
                      isMulti
                      options={creditScoreCategoryOptions.map(
                        (cat: CategoryOptionType) => ({
                          value: cat.value,
                          label: `Category ${cat.value} (Above ${cat.loanAbove}%)`,
                        })
                      )}
                      placeholder="Select Credit Score Category"
                      closeMenuOnSelect={false}
                      onChange={(selectedOptions: CreditScoreOption[]) =>
                        onChange(selectedOptions)
                      }
                      value={value}
                    />
                  )}
                />
                {errors.creditScoreCategory && (
                  <p className="text-red-500">
                    {errors.creditScoreCategory.message}
                  </p>
                )}
              </FormControl>
            </Skeleton>
          </div>

          {/* Interest Rate (Disabled) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div>
              <FormLabel m={0}>Interest Rate</FormLabel>
              <Text fontSize={"14px"} color={"gray.500"}>
                System default interest rate
              </Text>
            </div>
            <Skeleton isLoaded={!isInfoLoading}>
              <FormControl
                className="col-span-2"
                isInvalid={!!errors.loanInterest}
              >
                <Input
                  type="text"
                  placeholder="Interest Rate"
                  value={watch("loanInterest")}
                  disabled
                />
                {errors.loanInterest && (
                  <p className="text-red-500">{errors.loanInterest.message}</p>
                )}
              </FormControl>
            </Skeleton>
          </div>
        </div>
      </form>

      <LoanAutoAccept defaultStatus={status} />
    </div>
  );
}
