import DateComponent from "@/app/(protected)/suppliers/products/_components/DateComponent";
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
  Select,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import DateRange from "../../_components/DateRange";

interface IFormInput {
  endDate?: Date | null;
  startDate?: Date | null;
  status?: string;
}

interface FilterOptions {
  option: string;
  value: string;
}

const FilterDrawer = ({
  isOpen,
  onClose,
  applyFilters,
  clearFilters,
  filterOptions,
  isNotDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  applyFilters?: (filters: IFormInput) => void;
  clearFilters?: () => void;
  filterOptions?: FilterOptions[];
  isNotDate?: boolean;
}) => {
  const {
    handleSubmit,
    formState: {},
    control,
    watch,
    setValue,
    reset,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const onSubmit = (data: IFormInput) => {
    applyFilters(data);
    onClose();
  };

  const handleClearFilters = () => {
    reset({
      status: "",
      startDate: null,
      endDate: null,
    });
    clearFilters();
  };

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
          <Stack mt={5} spacing={5}>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Controller
                name="status"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select {...field}>
                    <option value="" disabled style={{ color: "gray" }}>
                      Select Status
                    </option>
                    {filterOptions?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.option}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            {isNotDate ? null : (
            <DateRange
            fromName="startDate"
            toName="endDate"
            control={control}
            watch={watch}
            setValue={setValue}
            labelFrom="From"
            labelTo="To"
          />
            )}
          </Stack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" mr={3} onClick={handleClearFilters}>
            Clear Filters
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
            Apply
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;
