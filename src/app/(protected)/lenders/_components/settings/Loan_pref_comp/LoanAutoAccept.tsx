import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";
import { handleServerErrorMessage } from "@/utils";
import { Button, FormControl, Switch, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Form, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface IFormInput {
  status: boolean;
}

export default function LoanAutoAccept({
  defaultStatus,
}: {
  defaultStatus: boolean;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      status: false,
    },
  });

  useEffect(() => {
    if (defaultStatus) {
      setValue("status", defaultStatus);
    }
  }, [defaultStatus]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      await requestClient({
        token: sessionData?.user?.token,
      }).patch("/lender/settings/update-auto-accept-status", data);

      toast.success("Loan preferences updated successfully!");
    } catch (error: any) {
      toast.error(handleServerErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5 w-full flex justify-between py-5">
          <div>
            <h3 className="font-semibold text-lg">Loan Preference</h3>
            <Text fontSize={"14px"} color={"gray.500"}>
              Define your Loan Request Acceptance.
            </Text>
          </div>
          <Button
            size={"sm"}
            variant={"solid"}
            colorScheme={"primary"}
            isDisabled={isLoading}
            isLoading={isLoading}
            loadingText="Submitting"
            type="submit"
          >
            Save Changes
          </Button>
        </div>

        <div className="space-y-5 w-full flex justify-between p-5 rounded-lg bg-white/70 border border-slate-300">
          <div>
            <h3 className="font-semibold text-lg">
              Opt-in for manual acceptance of loan requests (default:
              auto-accept).
            </h3>
            <Text fontSize={"14px"} color={"gray.500"}>
              Two-Factor authentication adds another layer of security to your
              account.
            </Text>
          </div>
          <FormControl flex={1} display="flex" justifyContent="flex-end">
            <Switch colorScheme="primary" {...register("status")} />
          </FormControl>
        </div>
      </form>
    </div>
  );
}
