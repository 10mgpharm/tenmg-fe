"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

interface IFormInput {
  amount: number;
  reasons: string;
}

export const FlatFeeForm = ({
  onClose,
  setFormStep,
}: {
  setFormStep: (value: number) => void;
  onClose: () => void;
}) => {
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const sessionToken = sessionData?.user?.token;
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      // Call enpoint
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
    setIsLoading(false);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm<IFormInput>({ mode: "onChange" });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5 text-gray mb-10">
        <FormControl isInvalid={!!errors.amount} mb={6}>
          <FormLabel htmlFor="amount">Enter Amount</FormLabel>
          <InputGroup>
            <InputLeftElement>₦</InputLeftElement>
            <Input
              id="amount"
              type="number"
              placeholder="E.g. N12,092,894"
              {...register("amount", {
                required: "Amount is required",
              })}
            />
          </InputGroup>
          <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
        </FormControl>

        <div className="flex items-center gap-4 justify-between">
          <Button
            type="button"
            w="full"
            variant={"outline"}
            onClick={() => setFormStep(1)}
          >
            Back
          </Button>

          <Button
            size="lg"
            w="full"
            type="submit"
            isLoading={isLoading}
            loadingText="Submitting..."
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};
