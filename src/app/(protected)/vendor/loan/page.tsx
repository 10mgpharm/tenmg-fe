"use client";

import React from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";

import {
  Box,
  Image,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Link,
  IconButton,
} from "@chakra-ui/react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { TbCurrencyNaira } from "react-icons/tb";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  loanRepayment: "string";
}

const Vendor = () => {
  const [sliderValue, setSliderValue] = useState<number>(1000000);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <div>
      <section className="flex justify-between items-center w-full pb-8">
        <div className="flex gap-3 items-center">
          <Avatar bg="primary.500" name="Ahmed Olanrewaju" />
          <div>
            <h4 className="text-gray-700 text-xl">Ahmed Olanrewaju</h4>
            <p className="text-gray-500 text-sm">ahmed@bubblespharm.com</p>
          </div>
        </div>
        <IoMdInformationCircleOutline className="w-6 h-6" />
      </section>
      <section className="pb-8 flex flex-col gap-5 justify-center items-center">
        <Text fontSize="lg">Credit Amount</Text>

        <div className="flex">
          <span>
            <TbCurrencyNaira className="text-2xl" />
          </span>
          <p>{sliderValue}</p>
        </div>

        <div className="w-full">
          <Slider
            defaultValue={sliderValue}
            min={10000}
            max={3000000}
            step={5000}
            onChange={(val) => setSliderValue(val)}
          >
            <SliderTrack bg="secondary.400">
              <SliderFilledTrack bg="primary.500" />
            </SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>

          <div className="flex justify-between">
            <p>Min Amount: NGN 10,000</p>
            <p>Max Amount: NGN 3,000,000</p>
          </div>
        </div>
      </section>
      <section className="">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <Box mb={10}>
            <FormControl isInvalid={!!errors.loanRepayment?.message} mb={5}>
              <FormLabel htmlFor="name">Loan Repayment</FormLabel>
              <Select
                id="name"
                placeholder="Choose Repayment Period"
                {...register("loanRepayment", {
                  required: "Choose Repayment Period",
                })}
              />
              <FormErrorMessage>
                {errors.loanRepayment?.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box mb={8}>
            <Button colorScheme="purple" size="lg" w="full" type="submit">
              Continue
            </Button>
          </Box>
          By clicking on continue you agree with 10MG User End Policy
        </form>
      </section>
    </div>
  );
};

export default Vendor;
