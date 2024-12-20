import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Input,
    Text,
    Stack,
    Checkbox,
    Tag,
    InputGroup,
    InputLeftElement,
    FormLabel,
    FormControl,
  } from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form';
import { FaSearch } from 'react-icons/fa'
import DateComponent from './DateComponent';

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
        getValues,
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
    <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        size={"md"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Text fontWeight={"medium"} fontSize={"large"}>Filters</Text>
            <Text fontWeight={"normal"} fontSize={"13px"} color={"gray.500"}>Apply filters to table data.</Text>
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing={5} direction='column'>
                <Checkbox>
                    <Tag colorScheme={"green"}>In stock</Tag>
                </Checkbox>
                <Checkbox>
                    <Tag colorScheme={"orange"}>Low stock</Tag>
                </Checkbox>
                <Checkbox>
                    <Tag colorScheme={"red"}>Out of stock</Tag>
                </Checkbox>
            </Stack>
            <Stack mt={5}>
                <Text mb={4}>Brand</Text>
                <InputGroup>
                    <InputLeftElement pointerEvents='none'>
                    <FaSearch className='text-gray-400' />
                    </InputLeftElement>
                    <Input type='text' placeholder='Search' />
                </InputGroup>
                <Stack mt={5}>
                    <Checkbox>
                        Brand One
                    </Checkbox>
                    <Checkbox>
                        Brand Two
                    </Checkbox>
                    <Checkbox>
                        Brand Three
                    </Checkbox>
                    <Checkbox>
                        Brand Four
                    </Checkbox>
                    <Checkbox>
                        Brand Five
                    </Checkbox>
                    <Checkbox>
                        Brand Six
                    </Checkbox>
                </Stack>
            </Stack>
            <Stack mt={5}>
                <Text mb={4}>Date</Text>
                <FormControl>
                    <FormLabel>
                        From
                    </FormLabel>
                    <Controller
                        name="startDate"
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
                <FormControl mt={4}>
                    <FormLabel>
                        To
                    </FormLabel>
                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                        <DateComponent
                            startDate={field.value}
                            setStartDate={field.onChange}
                            isMinDate
                            minDate={getValues("startDate")}
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
            <Button variant="outline" mr={3} onClick={handleClearFilters}>
                Clear Filters
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
                Apply
            </Button>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}

export default FilterDrawer