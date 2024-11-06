import DateComponent from "@/app/(protected)/suppliers/products/components/DateComponent";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Text,
  Stack,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { FaCalendar } from "react-icons/fa6";

interface IFormInput {
  date: Date | null;
}

const FilterDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Text fontWeight={"medium"} fontSize={"large"}>
            Filters
          </Text>
          <Text fontWeight={"normal"} fontSize={"13px"} color={"gray.500"}>
            Apply filters to table data.
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <Stack mt={5}>
            <FormControl>
              <FormLabel>Date</FormLabel>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DateComponent
                    startDate={field.value}
                    setStartDate={field.onChange}
                    isMinDate
                  />
                )}
              />
            </FormControl>
          </Stack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue">Apply</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;
