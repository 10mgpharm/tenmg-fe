"use client";

import { Button, Input, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import ShippingFeeTable from "./_components/ShippingFeeTable";
import SelectFeeModel from "./_components/SelectFeeModel";

export type ShippingFeeDataType = {
  type: "FLAT" | "CUSTOM";
  amount?: number;
  locations?: {
    country: string;
    state: string;
    city: string;
    address: string;
    amount: number;
  }[];
};

const ShippingFee = () => {
  const [shippingFeeData, setShippingFeeData] = useState<ShippingFeeDataType>({
    type: "FLAT",
    amount: 0,
    locations: [],
  });

  const {
    isOpen: openConfigModel,
    onOpen: setOpenConfigModel,
    onClose,
  } = useDisclosure();

  return (
    <div>
      {/* header */}
      <div className="flex flex-col gap-2 sm:flex-row items-center justify-between ">
        <div>
          <h2 className="text-[17px] font-semibold">
            Shipping Fee Configuration
          </h2>
          <p className="text-[15px] text-gray-700 pt-1">
            Customize how much you charge for shipping — by location
          </p>
        </div>

        <Button width={["full", "auto"]} onClick={() => setOpenConfigModel()}>Configure</Button>
      </div>

      <div className="bg-white mt-5 p-5 rounded-md flex flex-col gap-5 ">
        <div className="flex flex-col ">
          <label className="text-[15px] font-semibold">Selected fee type</label>
          <Input
            className="!bg-gray-100 mt-1 uppercase mb-2 w-full max-w-[500px]  pointer-events-none"
            value={shippingFeeData.type + " FEE"}
          />
          <small className="text-primary-600 w-fit text-[13px] bg-primary-600/5 rounded-full px-2 py-1 ">
            {shippingFeeData.type === "FLAT"
              ? "One price for all locations"
              : "Different location, Different price"}
          </small>
        </div>

        {shippingFeeData.type === "FLAT" && (
          <div className="flex flex-col">
            <label className="text-[15px] font-semibold">Amount</label>
            <Input
              className="!bg-gray-100 mt-1 uppercase mb-2 w-full max-w-[500px] pointer-events-none"
              value={shippingFeeData.amount}
            />
            <small className="text-primary-600 w-fit text-[13px] bg-primary-600/5 rounded-full px-2 py-1 ">
              {shippingFeeData.type === "FLAT"
                ? "This amount serves as a uniform shipping fee for all regions."
                : "Set specific shipping fees based on location."}
            </small>
          </div>
        )}
      </div>

      {shippingFeeData.type === "CUSTOM" && (
        <ShippingFeeTable
          shippingFeeData={shippingFeeData}
          setShippingFeeData={setShippingFeeData}
        />
      )}

      {openConfigModel && (
        <SelectFeeModel
          open={openConfigModel}
          setIsOpen={setOpenConfigModel}
          setShippingFeeData={setShippingFeeData}
          shippingFeeData={shippingFeeData}
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default ShippingFee;
