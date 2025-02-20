"use client";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import LoanAutoAccept from "./LoanAutoAccept";
import requestClient from "@/lib/requestClient";
import { handleServerErrorMessage } from "@/utils";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";

interface IFormInput {
  loanTenure: string;
  loanInterest: string;
  creditScoreCategory: string;
}

export default function LoanPreferenceComp() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(null);

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const loan_tenure = ["3 months", "6 months", "12 months"];

  const category = [
    "Category A  (Above 75%)",
    "Category B  (Above 50%)",
    "Category C  (Above 25%)",
    "Category D  (Below 25%)",
  ];

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      loanTenure: "",
      loanInterest: "",
      creditScoreCategory: "",
    },
  });

  //TODO: Fetch saved loan preferences prefill (if available)
  useEffect(() => {
    const fetchLoanPreferences = async () => {
      try {
        const response = await requestClient({
          token: sessionData?.user?.token,
        }).get("/lender/settings/get-loan-preferences");

        const { loanTenure, loanInterest, creditScoreCategory, autoAccept } =
          response.data.data;

        const tenureString =
          Array.isArray(loanTenure) && loanTenure.length > 0
            ? `${loanTenure[0]} months`
            : "";

        const categoryOptions = [
          "Category A  (Above 75%)",
          "Category B  (Above 50%)",
          "Category C  (Above 25%)",
          "Category D  (Below 25%)",
        ];
        const categoryString =
          Array.isArray(creditScoreCategory) && creditScoreCategory.length > 0
            ? categoryOptions.find((opt) =>
                opt.includes(creditScoreCategory[0])
              ) || ""
            : "";

        setValue("loanTenure", tenureString);
        setValue("loanInterest", loanInterest);
        setValue("creditScoreCategory", categoryString);
        setStatus(autoAccept);
      } catch (error: any) {
        toast.error(handleServerErrorMessage(error));
      }
    };

    if (sessionData?.user?.token) fetchLoanPreferences();
  }, [setValue, sessionData?.user?.token]);

  const selectedTenure = watch("loanTenure");
  const selectedCategory = watch("creditScoreCategory");

  useEffect(() => {
    if (selectedTenure && selectedCategory) {
      setValue("loanInterest", "Your interest 15%, Processing fee (0%)");
    } else {
      setValue("loanInterest", "");
    }
  }, [selectedTenure, selectedCategory, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      const tenureMatch = data.loanTenure.match(/\d+/);
      const creditMatch = data.creditScoreCategory.match(/Category\s+([A-Z])/);
      const payload = {
        loanTenure: tenureMatch ? [parseInt(tenureMatch[0])] : [],
        creditScoreCategory: creditMatch ? [creditMatch[1]] : [],
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
        <div className="space-y-5 w-full flex justify-between p-5">
          <div>
            <h3 className="font-semibold text-lg">Loan Information</h3>
            <p className="text-sm text-slate-300">
              Define your preferences for loan disbursement.
            </p>
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
          {/* Loan Tenure Option */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-4">
            <div>
              <FormLabel>Loan Tenure Option</FormLabel>
              <p className="text-sm text-slate-300">Loan Duration</p>
            </div>
            <FormControl className="col-span-2" isInvalid={!!errors.loanTenure}>
              <Select
                {...register("loanTenure", {
                  required: "Loan tenure option is required",
                })}
                defaultValue=""
              >
                <option value="" disabled>
                  Select loan tenure
                </option>
                {loan_tenure.map((option, i) => (
                  <option value={option} key={i}>
                    {option}
                  </option>
                ))}
              </Select>
              {errors.loanTenure && (
                <p className="text-red-500">{errors.loanTenure.message}</p>
              )}
            </FormControl>
          </div>

       

          {/* Customer Credit Score Category */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-4">
            <div>
              <FormLabel>Customer Credit Score Category</FormLabel>
              <p className="text-sm text-slate-300">
                Specify the customer categories you would like to give credit to
              </p>
            </div>

            <FormControl
              className="col-span-2"
              isInvalid={!!errors.creditScoreCategory}
            >
              <Select
                {...register("creditScoreCategory", {
                  required: "Please specify customer category",
                })}
                defaultValue=""
              >
                <option value="" disabled>
                  Select customer category
                </option>
                {category.map((option, i) => (
                  <option value={option} key={i}>
                    {option}
                  </option>
                ))}
              </Select>
              {errors.creditScoreCategory && (
                <p className="text-red-500">
                  {errors.creditScoreCategory.message}
                </p>
              )}
            </FormControl>
          </div>
             {/* Interest Rate (Disabled) */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div>
              <FormLabel>Interest Rate</FormLabel>
              <p className="text-sm text-slate-300">
                System Default interest rate
              </p>
            </div>
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
          </div>
        </div>
        
      </form>

      <LoanAutoAccept defaultStatus={status} />
    </div>
  );
}
