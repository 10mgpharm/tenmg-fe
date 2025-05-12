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
  Skeleton,
  Text,
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
        await session.update({
          ...sessionData,
          user: {
            ...sessionData.user,
            businessName: value.businessName,
            contactPerson: value.contactPerson,
            contactPhone: value.contactPhone,
          },
        });
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
        <div className="space-y-5 w-full flex justify-between py-5 flex-col lg:flex-row">
          <div>
            <h3 className="font-semibold text-lg">Business Information</h3>
            <Text fontSize={"14px"} color={"gray.500"}>
              Manage your business information.
            </Text>
          </div>
          <Button
            size={"sm"}
            variant={"solid"}
            colorScheme={"primary"}
            isLoading={isLoading}
            loadingText="Submitting..."
            type="submit"
          >
            Save Changes
          </Button>
        </div>

        <div className="p-5 rounded-lg bg-white/70 border border-slate-300 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="">
              <FormLabel m={0}>Business Name</FormLabel>

              <Text fontSize={"14px"} color={"gray.500"}>
                Registered name of business
              </Text>
            </div>

            <Skeleton isLoaded={!isInfoLoading}>
              <FormControl className="col-span-2">
                <Input
                  type="text"
                  placeholder={"Business Name"}
                  {...register("businessName", {
                    required: "Business name is required",
                  })}
                />
              </FormControl>
            </Skeleton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="">
              <FormLabel m={0}>{`Contact Person's Name`}</FormLabel>
              <Text fontSize={"14px"} color={"gray.500"}>
                Associated name to this business
              </Text>
            </div>

            <Skeleton isLoaded={!isInfoLoading}>
              <FormControl className="col-span-2">
                <Input
                  type="text"
                  placeholder={"Olivia Bellingham"}
                  {...register("contactPerson", {
                    required: "Contact person name is required",
                  })}
                />
              </FormControl>
            </Skeleton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="">
              <FormLabel m={0}>{`Email Address`}</FormLabel>
              <Text fontSize={"14px"} color={"gray.500"}>
                Associated business email address
              </Text>
            </div>

            <Skeleton isLoaded={!isInfoLoading}>
              <FormControl className="col-span-2">
                <Input
                  type="email"
                  isDisabled
                  placeholder={"olivia.bellingham@me.com"}
                  {...register("contactEmail", {
                    required: "Business email is required",
                  })}
                />
              </FormControl>
            </Skeleton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="">
              <FormLabel m={0}>{`Phone Number`}</FormLabel>
              <Text fontSize={"14px"} color={"gray.500"}>
                Associated business phone number
              </Text>
            </div>
            <Skeleton isLoaded={!isInfoLoading}>
              <FormControl className="col-span-2">
                <Input
                  type="tel"
                  placeholder={"(123) 456-7890"}
                  {...register("contactPhone", {
                    required: "phone number is required",
                  })}
                />
              </FormControl>
            </Skeleton>
          </div>
        </div>
      </form>

      <BankInfoFormComp
        sessionData={sessionData}
        defaultBankDetail={defaultBankDetail}
        isInfoLoading={isInfoLoading}
      />
    </div>
  );
}
