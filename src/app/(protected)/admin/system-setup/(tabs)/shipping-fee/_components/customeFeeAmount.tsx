"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import axios from "axios";
import Image from "next/image";
import { ShippingFeeDataType } from "../page";

interface IFormInput {
  country: string;
  state: string;
  city: string;
  address: string;
  amount: number;
}

export const CustomFeeForm = ({
  onClose,
  setFormStep,
  setShippingFeeData,
  shippingFeeData,
  isAdding = false,
}: {
  setFormStep?: (value: number) => void;
  onClose: () => void;
  setShippingFeeData: (value: ShippingFeeDataType) => void;
  shippingFeeData: ShippingFeeDataType;
  isAdding?: boolean;
}) => {
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const sessionToken = sessionData?.user?.token;
  const [isLoading, setIsLoading] = useState(false);
  const [countriesList, setCountriesList] = useState(null);
  const [statesList, setStatesList] = useState(null);
  const [citiesList, setCitiesList] = useState(null);
  const [addressList, setAddressList] = useState(null);

  //   loadingStates
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  //   Selected data
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  // Sort Data in alphabetical order
  const sortData = (data: any[], setter: (value: any) => void) => {
    const sortedData = data.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    console.log(sortedData);
    setter(sortedData);
  };

  // Get all countries
  const getAllCountries = useCallback(async () => {
    setIsLoadingCountries(true);
    try {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      sortData(
        response?.data?.map((i) => ({ name: i.name.common })),
        setCountriesList
      );
    } catch (error) {
      toast.error("Unable to fetch list of countries");
      console.log(error);
    }
    setIsLoadingCountries(false);
  }, []);

  //   Get states
  const getRespectiveStates = useCallback(async () => {
    setIsLoadingStates(true);
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country: selectedCountry }
      );
      sortData(response?.data?.data.states, setStatesList);
    } catch (error) {
      toast.error("Unable to fetch list of states");
      console.log(error);
    }
    setIsLoadingStates(false);
  }, [selectedCountry]);

  //   Get cities
  const getRespectiveCities = useCallback(async () => {
    setIsLoadingCities(true);
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          country: selectedCountry,
          state: selectedState,
        }
      );
      sortData(
        response?.data?.data.map((i) => ({ name: i })),
        setCitiesList
      );
    } catch (error) {
      toast.error("Unable to fetch list of cities");
      console.log(error);
    }
    setIsLoadingCities(false);
  }, [selectedCountry, selectedState]);

  //   Get address
  const getRespectiveAddress = useCallback(async () => {
    setIsLoadingAddress(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?city=${selectedCity}&state=${selectedState}&country=${selectedCountry}&format=json`
      );
      sortData(
        response?.data?.map((i) => ({ name: i.display_name })),
        setAddressList
      );
    } catch (error) {
      toast.error("Unable to fetch list of addresses");
      console.log(error);
    }
    setIsLoadingAddress(false);
  }, [selectedCountry, selectedState, selectedCity]);

  //   useEffect for countries
  useEffect(() => {
    getAllCountries();
  }, [getAllCountries]);

  //   useEffect for states
  useEffect(() => {
    if (!selectedCountry) return;
    getRespectiveStates();
  }, [selectedCountry, getRespectiveStates]);

  //   useEffect for cities
  useEffect(() => {
    if (!selectedState) return;
    getRespectiveCities();
  }, [selectedState, getRespectiveCities]);

  //   useEffect for address
  useEffect(() => {
    if (!selectedCity) return;
    getRespectiveAddress();
  }, [selectedCity, getRespectiveAddress]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      // Call enpoint
      setShippingFeeData({
        ...shippingFeeData,
        type: "CUSTOM",
        locations: shippingFeeData.locations
          ? [
              {
                country: selectedCountry,
                state: selectedState,
                city: selectedCity,
                address: selectedAddress,
                amount: data.amount,
              },
              ...shippingFeeData.locations,
            ]
          : [
              {
                country: selectedCountry,
                state: selectedState,
                city: selectedCity,
                address: selectedAddress,
                amount: data.amount,
              },
            ],
      });

      toast.success("Your custom fee is set successfully");
      onClose();
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
      console.log(error);
    }
    setIsLoading(false);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm<IFormInput>({ mode: "onChange" });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5 text-gray mb-10">
        <FormControl isInvalid={!!errors.country} mb={6}>
          <FormLabel htmlFor="amount">Country</FormLabel>
          <InputGroup>
            <Select
              id="country"
              placeholder="Select country"
              {...register("country", {
                required: "Select a country",
              })}
              disabled={isLoadingCountries}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {countriesList?.map((i, key) => (
                <option key={key} value={i.name}>
                  {i.name}
                </option>
              ))}
            </Select>
          </InputGroup>
          <FormErrorMessage>{errors.country?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.state} mb={6}>
          <FormLabel htmlFor="amount">State</FormLabel>
          <InputGroup className="relative">
            <Select
              id="state"
              placeholder="Select state"
              {...register("state", {
                required: "Select a state",
              })}
              disabled={isLoadingStates || !selectedCountry}
              onChange={(e) => {
                setSelectedState(e.target.value);
              }}
            >
              {statesList?.map((i, key) => (
                <option key={key} value={i.name}>
                  {i.name}
                </option>
              ))}
            </Select>

            {isLoadingStates && (
              <span className="absolute right-3 top-2 bg-white">
                <Spinner size={"xs"} opacity={0.5} />
              </span>
            )}
          </InputGroup>
          <FormErrorMessage>{errors.country?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.city} mb={6}>
          <FormLabel>City</FormLabel>
          <InputGroup className="relative">
            <Select
              id="city"
              placeholder="Select city"
              {...register("city", {
                required: "Select a city",
              })}
              disabled={isLoadingCities || !selectedCountry || !selectedState}
              onChange={(e) => {
                setSelectedCity(e.target.value);
              }}
            >
              {citiesList?.map((i, key) => (
                <option key={key} value={i.name}>
                  {i.name}
                </option>
              ))}
            </Select>

            {isLoadingCities && (
              <span className="absolute right-3 top-2 bg-white">
                <Spinner size={"xs"} opacity={0.5} />
              </span>
            )}
          </InputGroup>
          <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.address} mb={6}>
          <FormLabel>Closest Bus Stop</FormLabel>
          <InputGroup className="relative">
            <Select
              id="address"
              placeholder="Select Closest Bus Stop"
              {...register("address", {
                required: "Select a address",
              })}
              disabled={
                isLoadingAddress ||
                !selectedCountry ||
                !selectedState ||
                !selectedCity
              }
              onChange={(e) => {
                setSelectedAddress(e.target.value);
              }}
            >
              {addressList?.map((i, key) => (
                <option key={key} value={i.name}>
                  {i.name}
                </option>
              ))}
            </Select>

            {isLoadingAddress && (
              <span className="absolute right-3 top-2 bg-white">
                <Spinner size={"xs"} opacity={0.5} />
              </span>
            )}
          </InputGroup>
          <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.amount} mb={6}>
          <FormLabel htmlFor="amount">Shipping Amount</FormLabel>
          <InputGroup>
            <InputLeftElement>₦</InputLeftElement>
            <Input
              id="amount"
              type="number"
              placeholder="Enter Shipping Amount"
              {...register("amount", {
                required: "Amount is required",
              })}
              disabled={
                !selectedCountry ||
                !selectedState ||
                !selectedCity ||
                !selectedAddress
              }
            />
          </InputGroup>
          <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
        </FormControl>

        <div className="flex items-center gap-4 justify-between">
          {!isAdding && (
            <Button
              type="button"
              w="full"
              variant={"outline"}
              onClick={() => setFormStep(1)}
            >
              Back
            </Button>
          )}

          <Button
            size="lg"
            w="full"
            type="submit"
            isLoading={isLoading}
            loadingText="Submitting..."
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};
