"use client";

import { Button, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";

interface IFormInput {
  lenderInterest: number;
  mgInterest: number;
}

const LoanConfigSegment = () => {
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;
  const [isLoading, setIsLoading] = useState(false);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    control,
    reset,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const lenderInterestValue = watch("lenderInterest", 0); // Watch lenderInterest
  const mgInterestValue = watch("mgInterest", 0); // Watch mgInterest

  useEffect(() => {
    setTotalInterest(Number(lenderInterestValue) + Number(mgInterestValue));
  }, [lenderInterestValue, mgInterestValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      //   Write action
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error(handleServerErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[17spx] font-semibold"> Loan Configuration</h2>
          <p className="text-[15px] text-gray-700 pt-1">
            Setup lender interest and 10mg commission on each loan
          </p>
        </div>

        <Button onClick={handleSubmit(onSubmit)}>Save Changes</Button>
      </div>

      <form className="shadow-sm bg-white p-4 rounded-md space-y-4 mt-5">
        <FormControl
          isInvalid={!!errors.lenderInterest?.message}
          className="w-full max-w-[400px]"
        >
          <FormLabel>Lenders Interest (%)</FormLabel>
          <Input
            type={"number"}
            placeholder="Enter lenders interest"
            {...register("lenderInterest", {
              required: "Enter lenders interest",
            })}
          />
          {errors.lenderInterest && (
            <Text as={"span"} className="text-red-500 text-sm">
              {errors.lenderInterest?.message}
            </Text>
          )}
        </FormControl>

        <FormControl
          isInvalid={!!errors.mgInterest?.message}
          className="w-full max-w-[400px]"
        >
          <FormLabel>10mg Interest (%)</FormLabel>
          <Input
            type={"number"}
            placeholder="Enter 10mg commission on each product"
            {...register("mgInterest", {
              required: "Enter 10mg interest",
            })}
          />
          {errors.mgInterest && (
            <Text as={"span"} className="text-red-500 text-sm">
              {errors.mgInterest?.message}
            </Text>
          )}
        </FormControl>

        <FormControl className="w-full max-w-[400px]">
          <FormLabel>Total Interest On Each Loan (%)</FormLabel>
          <Input
            type={"text"}
            disabled
            className="!bg-gray-200"
            value={totalInterest}
          />
        </FormControl>
      </form>
    </div>
  );
};

export default LoanConfigSegment;
