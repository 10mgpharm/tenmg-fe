import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import requestClient from "@/lib/requestClient";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  handleprocess: (updatedItem: any, id?: string) => void; // optional for editing
  initialData?: {
    closestLandmark: string;
    streetAddress: string;
    country: string;
    state: string;
    city: string;
    id?: string;
  };
  isLoading: boolean;
}

export default function AddStoreAddressForm({
  handleprocess,
  isLoading,
  initialData,
}: Props) {
  const schema = z.object({
    closestLandmark: z.string().min(1, "this field is required"),
    streetAddress: z.string().min(1, "this field is required"),
    country: z.string().min(1, "this field is required"),
    state: z.string().min(1, "this field is required"),
    city: z.string().min(1, "this field is required"),
  });

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      closestLandmark: "",
      streetAddress: "",
      country: "",
      state: "",
      city: "",
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setValue("city", initialData?.city ?? "");
    setValue("closestLandmark", initialData?.closestLandmark ?? "");
    setValue("streetAddress", initialData?.streetAddress ?? "");
    setValue("country", initialData?.country ?? "");
    setValue("state", initialData?.state ?? "");
  }, [initialData]);

  const [countries, setCountries] = useState<{ name: string }[]>([]);
  const [states, setStates] = useState<{ name: string }[]>([]);
  const [cities, setCities] = useState<{ name: string }[]>([]);
  const [addressList, setAddressList] = useState<{ name: string }[]>([]);

  // loading states
  const [fetchingCountries, setFetchingCountries] = useState(false);
  const [fetchingStates, setFetchingStates] = useState(false);
  const [fetchingCities, setFetchingCities] = useState(false);

  const country = watch("country");
  const state = watch("state");

  useEffect(() => {
    const getCountries = async () => {
      setFetchingCountries(true);
      try {
        const response = await axios.get(
          "https://countriesnow.space/api/v0.1/countries/positions"
        );

        setCountries(response.data.data.map((i) => ({ name: i.name })));

        setValue("city", "");
        setValue("state", "");
        setValue("streetAddress", "");
        setValue("closestLandmark", "");
      } catch (error) {
        console.error("Error fetching list of countries");
      }
      setFetchingCountries(false);
    };

    getCountries();
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      setFetchingStates(true);
      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/states",
          { country: country }
        );

        setStates(response.data.data.states.map((i) => ({ name: i.name })));

        setValue("city", "");
        setValue("streetAddress", "");
        setValue("closestLandmark", "");
      } catch (error) {
        console.error("Error fetching states");
      }
      setFetchingStates(false);
    };

    if (!country) return;
    getCountries();
  }, [country]);

  useEffect(() => {
    const getCountries = async () => {
      setFetchingCities(true);
      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          {
            country: country,
            state: state,
          }
        );

        setCities(response.data.data.map((i) => ({ name: i })));

        setValue("streetAddress", "");
        setValue("closestLandmark", "");
      } catch (error) {
        console.error("Error fetching cities");
      }
      setFetchingCities(false);
    };

    if (!state || !country) return;
    getCountries();
  }, [state, country]);

  const onSubmit = (data: any) => {
    handleprocess(data, initialData?.id);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Country</FormLabel>
          <Select placeholder="Select country" {...register("country")}>
            {fetchingCountries ? (
              <option value={""}>Loading...</option>
            ) : (
              countries.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))
            )}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>State</FormLabel>
          <Select
            placeholder="Select state"
            {...register("state")}
            disabled={!country}
          >
            {fetchingStates ? (
              <option value={""}>Loading...</option>
            ) : (
              states.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))
            )}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>City</FormLabel>
          <Select
            placeholder="Select city"
            {...register("city")}
            disabled={!state || !country}
          >
            {fetchingCities ? (
              <option value={""}>Loading...</option>
            ) : (
              cities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))
            )}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Closest Landmark</FormLabel>
          <Input
            {...register("closestLandmark")}
            placeholder="e.g. Market Square"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Street Address</FormLabel>
          <Input
            {...register("streetAddress")}
            placeholder="e.g. 12 Aba Road"
          />
        </FormControl>

        <Button colorScheme="blue" type="submit" isLoading={isLoading}>
          Save
        </Button>
      </VStack>
    </form>
  );
}
