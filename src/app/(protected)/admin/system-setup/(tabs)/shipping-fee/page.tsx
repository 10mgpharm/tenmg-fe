"use client";

import { Button, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import ShippingFeeTable from "./_components/ShippingFeeTable";
import SelectFeeModel from "./_components/SelectFeeModel";

const ShippingFee = () => {
  const [openConfigModel, setOpenConfigModel] = useState(false);
  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between ">
        <div>
          <h2 className="font-medium text-[20px] text-gray-700">
            Shipping Fee Configuration
          </h2>
          <p className="text-gray-500 text-[15px] pt-1">
            Customize how much you charge for shipping — by location
          </p>
        </div>

        <Button onClick={() => setOpenConfigModel(true)}>Configure</Button>
      </div>

      <div className="bg-white mt-5 p-5 rounded-md flex flex-col gap-5 ">
        <div className="flex flex-col ">
          <label className="text-[15px] font-semibold">Selected fee type</label>
          <Input className="!bg-gray-200 mt-1 uppercase mb-2 w-full max-w-[500px]" />
          <small className="text-primary-600 w-fit text-[13px] bg-primary-600/5 rounded-full px-2 py-1 ">
            One price for all locations
          </small>
        </div>

        <div className="flex flex-col">
          <label className="text-[15px] font-semibold">Amount</label>
          <Input className="!bg-gray-200 mt-1 uppercase mb-2 w-full max-w-[500px]" />
          <small className="text-primary-600 w-fit text-[13px] bg-primary-600/5 rounded-full px-2 py-1 ">
            This amount serves as a uniform shipping fee for all regions.
          </small>
        </div>
      </div>

      <ShippingFeeTable />

      {openConfigModel && <SelectFeeModel
      
      open={openConfigModel}
      setIsOpen={setOpenConfigModel}
      />}
    </div>
  );
};

export default ShippingFee;
