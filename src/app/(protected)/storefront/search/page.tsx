'use client'
import { Select, useRangeSlider, } from '@chakra-ui/react'
import React, { useState } from 'react'

import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from '@chakra-ui/react'

export default function SearchPage() {

  const min = 0;
  const max = 100;
  const defaultValue = [0, 30];


  const {
    state,
    // actions,
    // getInnerTrackProps,
    // getInputProps,
    // getMarkerProps,
    // getRootProps,
    // getThumbProps,
    // getTrackProps,
  } = useRangeSlider({ min, max, defaultValue })

  console.log(state);

  return (
    <section>

      <div className="grid grid-cols-4 gap-6">
        <div className='col-span-1'>
          <div>
            <Select placeholder='Categories '>
              {/* <option value=""></option> */}
            </Select>
            <Select placeholder='Brands'>
              {/* <option value=""></option> */}
            </Select>
            <Select placeholder='Availability '>
              {/* <option value=""></option> */}
            </Select>
            <Select placeholder='Filter '>
              {/* <option value=""></option> */}
            </Select>

            <div className=''>
              <RangeSlider defaultValue={[0, 4500]} min={0} max={7000}>
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} >g</RangeSliderThumb>
                <RangeSliderThumb index={1}>hinge</RangeSliderThumb>
              </RangeSlider>
            </div>

          </div>
        </div>

        <div className="col-span-3">
          <Select placeholder='Choose Repayment Period '>
            {/* <option value=""></option> */}
          </Select>
        </div>

      </div>


    </section>
  )
}
