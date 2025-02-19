"use client";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";
import { handleServerErrorMessage } from "@/utils";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BankInfoFormComp from "./BankInfoFormComp";

interface IFormInput {
  businessName: string;
  contactEmail: string;
  contactPerson: string;
  contactPhone: string;
  businessAddress: string;
  contactPersonPosition: string;
}

export default function BusinessInfoFormComp() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInfoLoading, setIsInfoLoading] = useState<boolean>(false);
  const [defaultBankDetail, setDefaultBankDetail] = useState<any>(null);
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
      businessName: "",
      contactEmail: "",
      contactPhone: "",
      businessAddress: "",
      contactPersonPosition: "",
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsInfoLoading(true);
        const response = await requestClient({
          token: sessionData.user.token,
        }).get("/lender/settings");

        const data = response.data.data;
        setValue("businessName", data.businessName);
        setValue("contactEmail", data.contactEmail);
        setValue("contactPerson", data.contactPerson);
        setValue("contactPhone", data.contactPhone);
        setValue("businessAddress", data.businessAddress);
        setValue("contactPersonPosition", data.contactPersonPosition || "");
        setDefaultBankDetail(data.lenderBankAccount);
      } catch (error) {
        const errorMessage = handleServerErrorMessage(error);
        toast.error(errorMessage);
      } finally {
        setIsInfoLoading(false);
      }
    };

    if (sessionData?.user?.token) fetchSettings();
  }, [sessionData?.user?.token, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (value) => {
    try {
      setIsLoading(true);

      const response = await requestClient({
        token: sessionData.user.token,
      }).patch("/lender/settings/business-information", {
        ...value,
      });

      if (response.status === 200) {
        toast.success("Business information successfully updated");
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form className="space-y-4 mb-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5 w-full flex justify-between p-5 ">
          <div>
            <h3 className="font-semibold text-lg">Business Information</h3>
            <p className="text-sm text-slate-300">
              Manage your business information
            </p>
          </div>
          <Button
            size={"sm"}
            variant={"solid"}
            colorScheme={"primary"}
            isLoading={isLoading}
            type="submit"
          >
            Save Changes
          </Button>
        </div>

        <div className="p-5 rounded-lg bg-white/70 border border-slate-300 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="">
              <FormLabel>Business Name</FormLabel>
              <p className="text-sm text-slate-300">
                Registered name of Business
              </p>
            </div>

            <FormControl className="col-span-2">
              <Input
                type="text"
                placeholder={"Business Name"}
                {...register("businessName", {
                  required: "Business name is required",
                })}
              />
            </FormControl>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="">
              <FormLabel>{`Contact Person's Name`}</FormLabel>
              <p className="text-sm">{`Contact person's name`}</p>
            </div>

            <FormControl className="col-span-2">
              <Input
                type="text"
                placeholder={"Olivia Bellingham"}
                {...register("contactPerson", {
                  required: "Contact person name is required",
                })}
              />
            </FormControl>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="">
              <FormLabel>{`Email Address`}</FormLabel>
              <p className="text-sm text-slate-300">{`Associated business email address`}</p>
            </div>

            <FormControl className="col-span-2">
              <Input
                type="email"
                placeholder={"olivia.bellingham@me.com"}
                {...register("contactEmail", {
                  required: "Business email is required",
                })}
              />
            </FormControl>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="">
              <FormLabel>{`Phone Number`}</FormLabel>
              <p className="text-sm text-slate-300">{`Associated business phone number`}</p>
            </div>

            <FormControl className="col-span-2">
              <Input
                type="tel"
                placeholder={"(123) 456-7890"}
                {...register("contactPhone", {
                  required: "phone number is required",
                })}
              />
            </FormControl>
          </div>
        </div>
      </form>

      <BankInfoFormComp
        sessionData={sessionData}
        defaultBankDetail={defaultBankDetail}
      />
    </div>
  );
}
