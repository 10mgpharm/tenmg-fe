"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Flex,
  Divider,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";

import requestClient from "@/lib/requestClient";
import { handleServerErrorMessage } from "@/utils";
import { NextAuthUserSession } from "@/types";

import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";

interface IShippingAddressInput {
  name: string; // "Address One 2"
  address: string; // "some address"
  phoneNumber: string; // "0812345689"
  zipCode: string; // "12356029"
}

interface EditAddressModalProps {
  id?: string; // if present -> Edit mode
  onSuccess: () => void; // callback to refresh parent data
  existingData?: {
    name?: string;
    address?: string;
    phoneNumber?: string;
    country?: string;
    state?: string;
    city?: string;
    zipCode?: string;
  };
}

export default function EditAddressModal({
  id,
  onSuccess,
  existingData,
}: EditAddressModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const userToken = sessionData?.user?.token;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IShippingAddressInput>({
    mode: "onChange",
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
      zipCode: "",
    },
  });
  // console.log("existingData", existingData);
  // Country/State/City from the library
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [selectedState, setSelectedState] = useState<IState | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);

  // For searching countries
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState<ICountry[] | null>(null);
  const [states, setStates] = useState<IState[] | null>(null);
  const [cities, setCities] = useState<ICity[] | null>(null);

  // Placeholders
  const countryPlaceholder = selectedCountry?.name || "Select a country";
  const statePlaceholder = selectedState?.name || "Select a state";
  const cityPlaceholder = selectedCity?.name || "Select a city";

  // Load countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // If editing, populate fields
  useEffect(() => {
    if (id && existingData) {
      // Pre-fill the react-hook-form fields
      setValue("name", existingData.name || "");
      setValue("address", existingData.address || "");
      setValue("phoneNumber", existingData.phoneNumber || "");
      setValue("zipCode", existingData.zipCode || "");

      // Try to match the existing country with the library
      if (existingData.country) {
        const foundCountry = Country.getAllCountries().find(
          (c) => c.name.toLowerCase() === existingData.country?.toLowerCase()
        );
        if (foundCountry) {
          setSelectedCountry(foundCountry);
          setStates(State.getStatesOfCountry(foundCountry.isoCode));
        }
      }

      // If we have a state from existingData, try to match it
      if (existingData.state && selectedCountry?.isoCode) {
        const foundState = State.getStatesOfCountry(
          selectedCountry.isoCode
        ).find(
          (s) => s.name.toLowerCase() === existingData.state?.toLowerCase()
        );
        if (foundState) {
          setSelectedState(foundState);
          setCities(
            City.getCitiesOfState(foundState.countryCode, foundState.isoCode)
          );
        }
      }

      // If we have a city from existingData, try to match it
      if (
        existingData.city &&
        selectedState?.countryCode &&
        selectedState.isoCode
      ) {
        const foundCity = City.getCitiesOfState(
          selectedState.countryCode,
          selectedState.isoCode
        ).find(
          (c) => c.name.toLowerCase() === existingData.city?.toLowerCase()
        );
        if (foundCity) {
          setSelectedCity(foundCity);
        }
      }
    }
  }, [id, existingData, setValue, selectedCountry, selectedState]);

  // Filter countries by search
  const filteredCountries = useMemo(() => {
    if (!countries) return [];
    return countries.filter((country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [countries, searchQuery]);

  // Handler for searching countries
  const handleCountrySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handler for selecting a country from the menu
  const handleCountryChange = (country: ICountry) => {
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
    setStates(State.getStatesOfCountry(country.isoCode));
  };

  // Handler for selecting a state from the menu
  const handleSelectState = (state: IState) => {
    setSelectedState(state);
    setSelectedCity(null);
    setCities(City.getCitiesOfState(state.countryCode, state.isoCode));
  };

  // Handler for selecting a city from the menu
  const handleSelectCity = (city: ICity) => {
    setSelectedCity(city);
  };

  const onSubmit: SubmitHandler<IShippingAddressInput> = async (formData) => {
    if (!userToken) return;

    const payload = {
      name: formData.name,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
      country: selectedCountry?.name,
      state: selectedState?.name,
      city: selectedCity?.name,
      zipCode: formData.zipCode,
      isDefault: existingData?.isDefault || false,
    };

    try {
      if (id) {
        // PATCH
        const response = await requestClient({ token: userToken }).patch(
          `/storefront/shipping-addresses/${id}`,
          payload
        );
        if (response.status === 200) {
          toast.success("Address updated successfully");
        } else {
          toast.error(`Error: ${response.data.message}`);
        }
      } else {
        // POST
        const response = await requestClient({ token: userToken }).post(
          `/storefront/shipping-addresses`,
          payload
        );
        if (response.status === 200) {
          toast.success("Address created successfully");
        } else {
          toast.error(`Error: ${response.data.message}`);
        }
      }
      onSuccess(); // refresh address list
      onClose();
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        variant={id ? "outline" : "solid"}
        colorScheme="blue"
        size={id && "sm"}
        width="100%"
      >
        {id ? "Edit Address" : "Add Shipping Address"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {id ? "Edit Shipping Address" : "Add Shipping Address"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form className="space-y-5 mt-6" onSubmit={handleSubmit(onSubmit)}>
              <HStack gap={5}>
                <FormControl isInvalid={!!errors.name?.message}>
                  <FormLabel>Address Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Address One 2"
                    {...register("name", {
                      required: "Name is required",
                    })}
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>
              </HStack>

              <HStack gap={5}>
                <FormControl isInvalid={!!errors.address?.message}>
                  <FormLabel>Address</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter street or detailed address"
                    {...register("address", {
                      required: "Address is required",
                    })}
                  />
                  <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.phoneNumber?.message}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    type="tel"
                    placeholder="0812345689"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.phoneNumber?.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>

              <div className="grid gap-4 grid-cols-2">
                {/* Country */}
                <FormControl>
                  <FormLabel>Country</FormLabel>
                  <Menu>
                    <MenuButton
                      as={Button}
                      variant="outline"
                      w="100%"
                      rightIcon={<ChevronDownIcon />}
                      colorScheme="gray"
                      size={`${
                        selectedCountry && countryPlaceholder?.length > 14
                          ? "sm"
                          : "md"
                      }`}
                      className={`${
                        selectedCountry && countryPlaceholder?.length > 14
                          ? "py-[23px]"
                          : ""
                      }`}
                    >
                      {countryPlaceholder}
                    </MenuButton>
                    <MenuList maxH="300px" overflowY="auto">
                      <Box p={2}>
                        <Input
                          placeholder="Search for a country"
                          value={searchQuery}
                          onChange={handleCountrySearch}
                        />
                      </Box>
                      {filteredCountries.map((country) => (
                        <MenuItem
                          key={country.isoCode}
                          onClick={() => handleCountryChange(country)}
                        >
                          {country.name}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </FormControl>

                {/* State */}
                <FormControl>
                  <FormLabel>State</FormLabel>
                  <Menu>
                    <MenuButton
                      as={Button}
                      variant="outline"
                      w="100%"
                      rightIcon={<ChevronDownIcon />}
                      colorScheme="gray"
                      size={`${
                        selectedState && statePlaceholder?.length > 14
                          ? "sm"
                          : "md"
                      }`}
                      className={`${
                        selectedState && statePlaceholder?.length > 14
                          ? "py-[23px]"
                          : ""
                      }`}
                    >
                      {statePlaceholder}
                    </MenuButton>
                    <MenuList maxH="300px" overflowY="auto">
                      {states?.map((s) => (
                        <MenuItem
                          key={s.isoCode}
                          onClick={() => handleSelectState(s)}
                        >
                          {s.name}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </FormControl>
              </div>

              <HStack gap={5}>
                {/* City */}
                <FormControl>
                  <FormLabel>City</FormLabel>
                  <Menu>
                    <MenuButton
                      as={Button}
                      variant="outline"
                      w="100%"
                      rightIcon={<ChevronDownIcon />}
                      colorScheme="gray"
                      size={`${
                        selectedCity && cityPlaceholder?.length > 14
                          ? "sm"
                          : "md"
                      }`}
                      className={`${
                        selectedCity && cityPlaceholder?.length > 14
                          ? "py-[23px]"
                          : ""
                      }`}
                    >
                      {cityPlaceholder}
                    </MenuButton>
                    <MenuList maxH="300px" overflowY="auto">
                      {cities?.map((c, idx) => (
                        <MenuItem key={idx} onClick={() => handleSelectCity(c)}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </FormControl>

                {/* Zip Code */}
                <FormControl isInvalid={!!errors.zipCode?.message}>
                  <FormLabel>Zip Code</FormLabel>
                  <Input
                    type="text"
                    placeholder="12356029"
                    {...register("zipCode", {
                      required: "Zip code is required",
                    })}
                  />
                  <FormErrorMessage>{errors.zipCode?.message}</FormErrorMessage>
                </FormControl>
              </HStack>

              <Divider />

              <Flex justify="flex-end" py={2}>
                <Button type="submit" variant="solid">
                  {id ? "Update" : "Save"}
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
