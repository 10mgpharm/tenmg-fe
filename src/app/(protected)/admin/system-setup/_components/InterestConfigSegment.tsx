"use client";

import { Button, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";

interface IFormInput {
  productCommission: number;
}

const InterestConfigSegment = () => {
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    control,
    reset,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

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
          <h2 className="text-[17spx] font-semibold">Product Configuration</h2>
          <p className="text-[15px] text-gray-700 pt-1">
            Set 10mg commission on each product
          </p>
        </div>
        <Button onClick={handleSubmit(onSubmit)}>Save Changes</Button>
      </div>

      <form className="shadow-sm bg-white p-4 rounded-md space-y-4 mt-5">
        <FormControl
          isInvalid={!!errors.productCommission?.message}
          className="w-full max-w-[400px]"
        >
          <FormLabel>Product Commission(%)</FormLabel>
          <Input
            type={"number"}
            placeholder="Enter 10mg commission on each product"
            {...register("productCommission", {
              required: "Enter commission on each product",
            })}
          />
          {errors.productCommission && (
            <Text as={"span"} className="text-red-500 text-sm">
              {errors.productCommission?.message}
            </Text>
          )}
        </FormControl>
      </form>
    </div>
  );
};

export default InterestConfigSegment;
