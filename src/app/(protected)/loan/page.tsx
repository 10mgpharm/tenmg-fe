"use client";

import React from "react";
import {
  Avatar,
  Box,
  Text,
  FormControl,
  FormLabel,
  Center,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Button,
  FormErrorMessage,
  Link,
  Flex,
  NumberInput,
  NumberInputField,
  Stack,
} from "@chakra-ui/react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { TbCurrencyNaira } from "react-icons/tb";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import LoadingScreen from "./components/LoadingScreen";
import SuccessScreen from "./components/SuccessScreen";

interface IFormInput {
  loanRepayment: string;
}

const Vendor = () => {
  const [sliderValue, setSliderValue] = useState<number>(1000000);
  const [isLoanRepayment, setIsLoanRepayment] = useState<boolean>(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "failed"
  >("idle");

  const format = (val) => `₦` + val;
  const parse = (val) => val.replace(/^\$/, "");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setStatus("loading");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStatus("success");
    } catch (error) {
      setStatus("failed");
    }
  };

  return (
    <div>
      {status === "idle" && (
        <>
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
            <Text fontSize="md" lineHeight={6}>
              Credit Amount
            </Text>

            <Flex alignItems="center" justifyContent="center" flex={1}>
              <Flex alignItems="center">
                <TbCurrencyNaira size="24px" className="flex-1" />

                <NumberInput
                  variant="unstyled"
                  value={format(sliderValue)}
                  onChange={(val) => setSliderValue(parse(val))}
                >
                  <NumberInputField
                    fontSize={64}
                    p={0}
                    outline={0}
                    textAlign="center"
                  />
                </NumberInput>
              </Flex>
            </Flex>

            <Box w="full">
              <Slider
                defaultValue={sliderValue}
                min={10000}
                max={3000000}
                step={5000}
                onChange={(val) => setSliderValue(val)}
              >
                <SliderTrack bg="secondary.400" height="8px" borderRadius="4px">
                  <SliderFilledTrack bg="primary.500" />
                </SliderTrack>
                <SliderThumb boxSize={6} borderColor="primary.500" />
              </Slider>

              <Flex justifyContent="space-between">
                <Text fontSize="sm">Min Amount: NGN 10,000</Text>
                <Text fontSize="sm">Max Amount: NGN 3,000,000</Text>
              </Flex>
            </Box>
          </section>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Box mb={10}>
              <FormControl isInvalid={!!errors.loanRepayment?.message} mb={5}>
                <FormLabel htmlFor="loanRepayment">Loan Repayment</FormLabel>
                <Select
                  id="loanRepayment"
                  placeholder="Choose Repayment Period"
                  {...register("loanRepayment", {
                    required: "Choose Repayment Period",
                  })}
                  onChange={() => setIsLoanRepayment(!isLoanRepayment)}
                >
                  <option value="3">3 Months Repayment Plan</option>
                </Select>

                <FormErrorMessage>
                  {errors.loanRepayment?.message}
                </FormErrorMessage>
              </FormControl>
              {isLoanRepayment && (
                <Box bgColor="warning.100" p={4} borderRadius="md" my={6}>
                  <Stack direction="column">
                    <Text fontSize="md" fontWeight="bold">
                      Interest rate: 25%
                    </Text>
                    <Text fontSize="md" fontWeight="bold">
                      Repayment Amount: N1,250,000.00
                    </Text>
                    <Text fontSize="md" fontWeight="bold">
                      Monthly Interest: N15,0000
                    </Text>

                    <Text fontSize="md" fontWeight="bold">
                      Monthly Repayment: N100,000
                    </Text>
                  </Stack>
                </Box>
              )}
            </Box>

            <Box mb={8}>
              <Button colorScheme="purple" size="lg" w="full" type="submit">
                Continue
              </Button>
            </Box>
            <Center gap={2}>
              <Text fontSize="sm" lineHeight={5}>
                By clicking on continue you agree with
                <Link paddingLeft={1} color="blue.500" fontWeight="bold">
                  10MG User End Policy
                </Link>
              </Text>
            </Center>
          </form>
        </>
      )}
      {status === "loading" && <LoadingScreen />}

      {status === "success" && <SuccessScreen />}
    </div>
  );
};

export default Vendor;
