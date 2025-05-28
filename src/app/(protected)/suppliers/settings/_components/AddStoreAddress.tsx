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

interface Props {
  onClose: () => void;
  onAdd: (newItem: any) => void;
  onUpdate?: (updatedItem: any) => void; // optional for editing
  initialData?: any; // optional prefill data for editing
}

export default function AddStoreAddressForm({
  onClose,
  onAdd,
  onUpdate,
  initialData,
}: Props) {
  const { register, handleSubmit, reset, watch } = useForm();
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const country = watch("country");
  const state = watch("state");

  // Mock options – you can replace this with real API or dynamic values
  const countries = ["Nigeria", "Ghana", "Kenya"];
  const stateOptions = {
    Nigeria: ["Lagos", "Kogi", "Abuja"],
    Ghana: ["Accra", "Kumasi"],
    Kenya: ["Nairobi", "Mombasa"],
  };
  const cityOptions = {
    Lagos: ["Ikeja", "Mushin", "Yaba"],
    Kogi: ["Lokoja", "Anyigba"],
    Abuja: ["Garki", "Wuse"],
    Accra: ["East Legon", "Osu"],
    Kumasi: ["Adum", "Asokwa"],
    Nairobi: ["Westlands", "Kibera"],
    Mombasa: ["Nyali", "Likoni"],
  };

  // Update states and cities when country/state changes
  useEffect(() => {
    if (country) {
      setStates(stateOptions[country] || []);
    } else {
      setStates([]);
    }
    setCities([]);
  }, [country]);

  useEffect(() => {
    if (state) {
      setCities(cityOptions[state] || []);
    } else {
      setCities([]);
    }
  }, [state]);

  const onSubmit = (data: any) => {
    onAdd(data);
    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Country</FormLabel>
          <Select placeholder="Select country" {...register("country")}>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>State</FormLabel>
          <Select placeholder="Select state" {...register("state")}>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>City</FormLabel>
          <Select placeholder="Select city" {...register("city")}>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
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

        <Button colorScheme="blue" type="submit">
          Save
        </Button>
      </VStack>
    </form>
  );
}
