"use client";

import { Button, Input, Spinner, useDisclosure } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { formatAmount } from "@/utils/formatAmount";
import ConfigureShippingFee from "./_components/configureShippingFee";

export type ShippingFeeDataType = {
  id: number;
  type: "FIXED";
  fee: string;
};

const ShippingFee = () => {
  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;
  const [shippingFeeData, setShippingFeeData] =
    useState<ShippingFeeDataType>(null);
  const [loadingShippingFee, setLoadingShippingFee] = useState(false);

  const {
    isOpen: openConfigModel,
    onOpen: setOpenConfigModel,
    onClose,
  } = useDisclosure();

  const fetchShippingFee = useCallback(async () => {
    setLoadingShippingFee(true);
    try {
      const response = await requestClient({ token: token }).get(
        `/admin/settings/shipping-fee`
      );
      if (response.status === 200) {
        setShippingFeeData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }

    setLoadingShippingFee(false);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchShippingFee();
  }, [token, fetchShippingFee]);

  if (loadingShippingFee) {
    return (
      <div className="flex items-center justify-center min-h-32 h-full">
        <Spinner size={"md"} className="" />
      </div>
    );
  }

  return (
    <div>
      {/* header */}
      <div className="flex flex-col gap-2 sm:flex-row items-center justify-between ">
        <div>
          <h2 className="text-[17px] font-semibold">
            Shipping Fee Configuration
          </h2>
          <p className="text-[15px] text-gray-700 pt-1">
            Set how much you charge for shipping
          </p>
        </div>

        <Button width={["full", "auto"]} onClick={() => setOpenConfigModel()}>
          Configure
        </Button>
      </div>

      <div className="bg-white mt-5 p-5 rounded-md flex flex-col gap-5 ">
        <div className="flex flex-col ">
          <label className="text-[15px] font-semibold"> Fee Type</label>
          <Input
            className="!bg-gray-100 mt-1 uppercase mb-2 w-full max-w-[500px]  pointer-events-none"
            value={shippingFeeData?.type}
          />
          <small className="text-primary-600 w-fit text-[13px] bg-primary-600/5 rounded-full px-2 py-1 ">
            {"One price for all locations"}
          </small>
        </div>

        {shippingFeeData?.type === "FIXED" && (
          <div className="flex flex-col">
            <label className="text-[15px] font-semibold">Amount</label>
            <Input
              className="!bg-gray-100 mt-1 uppercase mb-2 w-full max-w-[500px] pointer-events-none"
              value={formatAmount(shippingFeeData?.fee)}
            />
            <small className="text-primary-600 w-fit text-[13px] bg-primary-600/5 rounded-full px-2 py-1 ">
              {"This amount serves as a uniform shipping fee for all regions."}
            </small>
          </div>
        )}
      </div>

      {openConfigModel && (
        <ConfigureShippingFee
          open={openConfigModel}
          refetchData={fetchShippingFee}
          onClose={onClose}
          defaultValue={Number(formatAmount(shippingFeeData?.fee))}
          data={shippingFeeData}
        />
      )}
    </div>
  );
};

export default ShippingFee;
