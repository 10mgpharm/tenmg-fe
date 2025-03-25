"use client";
import { Select, useRangeSlider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";
import BreadCrumbBanner from "../_components/BreadCrumbBanner";
import StoreProductCardComponent from "../_components/StoreProductCardComponent";
import EmptyProductScreen from "../_components/EmptyProductScreen";

export default function SearchPage() {
  const min = 0;
  const max = 100;
  let defaultValue = [0, 30];

  const [value, setVal] = useState(defaultValue);

  const onChangeEnd = (val) => {
    console.log(val);
    defaultValue = val;
    setVal(val);
  };

  // const [] = useState();

  const breadCrumb = [
    {
      text: "Home",
      link: "/",
    },
    {
      text: "Products",
      link: "/storefront",
    },
    {
      text: "Search Result for Paracetamol",
      link: "#",
    },
  ];

  return (
    <section>
      <BreadCrumbBanner breadCrumbsData={breadCrumb} />
      <div className="grid grid-cols-4 gap-6  w-11/12 mx-auto my-10">
        <div className="col-span-1 sticky top-[120px] h-[90vh]">
          <div className="space-y-4 border-x border-gray-200 px-4 h-full">
            <Select placeholder="Categories ">
              {/* <option value=""></option> */}
            </Select>
            <Select placeholder="Brands">
              {/* <option value=""></option> */}
            </Select>
            <Select placeholder="Availability ">
              {/* <option value=""></option> */}
            </Select>
            <Select placeholder="Filter ">
              {/* <option value=""></option> */}
            </Select>

            <div className="border-gray-200 border rounded-md  p-8 pt-4">
              <RangeSlider
                defaultValue={defaultValue}
                min={min}
                max={max}
                onChangeEnd={(val) => onChangeEnd(val)}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0}>
                  <div className="absolute top-4">{value[0]}</div>
                </RangeSliderThumb>
                <RangeSliderThumb index={1}>
                  <div className="absolute top-4">{value[1]}</div>
                </RangeSliderThumb>
              </RangeSlider>
            </div>
          </div>
        </div>

        <div className="col-span-3">
          {/* <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6'>
            {Array(8)
              .fill(null)
              .map((_, i: number) => (
                // <p key={i}>Item {i}</p>
                <StoreProductCardComponent key={1} />
              ))}
          </div> */}
          <EmptyProductScreen />
        </div>
      </div>
    </section>
  );
}
