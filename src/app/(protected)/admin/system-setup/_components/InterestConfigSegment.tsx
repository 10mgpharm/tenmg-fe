"use client";

import { Button, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";

interface IFormInput {
  productCommission: number;
}

const InterestConfigSegment = ({
  data,
  refetch,
}: {
  data: {
    key: string;
    value: number;
    group: string;
  }[];
  refetch: () => void;
}) => {
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;
  const [isLoading, setIsLoading] = useState(false);
  const productCommission = data?.find(
    (i) => i.key === "tenmg_ecommerce_commission_percent"
  );

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

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      const response = await requestClient({ token: token }).post(
        "/admin/settings/config",
        {
          settings: [
            {
              group: "general",
              key: "tenmg_ecommerce_commission_percent",
              value: watch("productCommission"),
            },
          ],
        }
      );
      if (response.status === 200) {
        toast.success("Saved successfully");
        refetch();
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error(handleServerErrorMessage(error));
    }
    setIsLoading(false);
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
        <Button onClick={handleSubmit(onSubmit)} isLoading={isLoading}>
          Save Changes
        </Button>
      </div>

      <form className="shadow-sm bg-white p-4 rounded-md space-y-4 mt-5">
        <FormControl
          isInvalid={!!errors.productCommission?.message}
          className="w-full max-w-[400px]"
        >
          <FormLabel>Product Commission (%)</FormLabel>
          <Input
            type={"number"}
            placeholder="Enter 10mg commission on each product"
            {...register("productCommission", {
              required: "Enter commission on each product",
            })}
            defaultValue={productCommission?.value}
            disabled={isLoading}
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
