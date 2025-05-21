import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface Props {
  onClose: () => void;
  onAdd: (data: any) => void;
}

export default function AddStoreAddressForm({ onClose, onAdd }: Props) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    onAdd(data);
    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>country</FormLabel>
          <Input {...register("productName")} placeholder="e.g. Nigeria" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>state</FormLabel>
          <Input {...register("brandName")} placeholder="e.g. kogi" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>city</FormLabel>
          <Input {...register("purchaseDate")} placeholder="e.g. Mushin" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>closestLandmark</FormLabel>
          <Input {...register("brandName")} placeholder="e.g. kogi" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>streetAddress</FormLabel>
          <Input {...register("brandName")} placeholder="e.g. kogi" />
        </FormControl>

        <Button colorScheme="blue" type="submit">
          Save
        </Button>
      </VStack>
    </form>
  );
}
