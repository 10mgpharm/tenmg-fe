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
    CheckboxGroup,
  } from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { FaSearch } from 'react-icons/fa';
import DateComponent from './DateComponent';
import { Dispatch, SetStateAction, useState } from 'react';
import { MedicationData, MedicationResponseData} from '@/types';

interface IFormInput {
    fromDate?: Date | null;
    toDate?: Date | null;
    inventory?: string;
    brand?: string;
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
    brands,
    setBrandFilter,
    selectedBrand,
    setSelectedBrand,
    brandFilter
}: {
    isOpen: boolean;
    onClose: () => void;
    applyFilters?: (filters: IFormInput) => void;
    clearFilters?: () => void;
    filterOptions?: FilterOptions[];
    isNotDate?: boolean;
    brandFilter: string;
    setBrandFilter: Dispatch<SetStateAction<string>>;
    selectedBrand: string;
    setSelectedBrand: Dispatch<SetStateAction<string>>;
    brands: MedicationResponseData;
}) => {

    const [checkedItems, setCheckedItems] = useState([false, false, false]);
    const [checkedItems2, setCheckedItems2] = useState([false, false, false, false]);
    const {
        handleSubmit,
        formState: {},
        control,
        reset,
        setValue
    } = useForm<IFormInput>({
        mode: "onChange",
    });

    const onSubmit = (data: IFormInput) => {
        applyFilters(data);
        onClose();
    };

    const handleClearFilters = () => {
        reset({
            brand: "",
            inventory: "",
            toDate: null,
            fromDate: null,
            status: "",
        });
        clearFilters();
        setCheckedItems([false, false, false])
        setCheckedItems2([false, false, false, false])
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
            <Stack mt={1}>
                <Text mb={4}>Inventory</Text>
                <CheckboxGroup>
                    <Stack spacing={4} direction='column'>
                        <Checkbox 
                            isChecked={checkedItems[0]} 
                            onChange={(e) => {
                                setCheckedItems([e.target.checked, false, false]);
                                setValue("inventory", "IN STOCK");
                            }} 
                        >
                            <Tag colorScheme={"green"} size={"sm"}>In stock</Tag>
                        </Checkbox>
                        <Checkbox 
                            isChecked={checkedItems[1]} 
                            onChange={(e) => {
                                setCheckedItems([false, e.target.checked, false])
                                setValue("inventory", "LOW STOCK")
                            }} 
                        >
                            <Tag colorScheme={"orange"} size={"sm"}>Low stock</Tag>
                        </Checkbox>
                        <Checkbox 
                        isChecked={checkedItems[2]} 
                        onChange={(e) => {
                            setCheckedItems([false, false, e.target.checked])
                            setValue("inventory", "OUT OF STOCK")
                        }} 
                        >
                            <Tag colorScheme={"red"} size={"sm"}>Out of stock</Tag>
                        </Checkbox>
                    </Stack>
                </CheckboxGroup>
            </Stack>
            <Stack mt={5}>
                <Text mb={4}>Status</Text>
                <CheckboxGroup>
                    <Stack spacing={4} direction='column'>
                        <Checkbox 
                            isChecked={checkedItems2[0]} 
                            onChange={(e) => {
                                setCheckedItems2([e.target.checked, false, false, false]);
                                setValue("status", "active");
                            }} 
                        >
                            <Tag colorScheme={"green"} size={"sm"}>Active</Tag>
                        </Checkbox>
                        <Checkbox 
                            isChecked={checkedItems2[1]} 
                            onChange={(e) => {
                                setCheckedItems2([false, e.target.checked, false, false])
                                setValue("status", "inactive")
                            }} 
                        >
                            <Tag colorScheme={"orange"} size={"sm"}>Inactive</Tag>
                        </Checkbox>
                        <Checkbox 
                        isChecked={checkedItems2[2]} 
                        onChange={(e) => {
                            setCheckedItems2([false, false, e.target.checked, false])
                            setValue("status", "pending")
                        }} 
                        >
                            <Tag colorScheme={"red"} size={"sm"}>Pending</Tag>
                        </Checkbox>
                        <Checkbox 
                        isChecked={checkedItems2[3]} 
                        onChange={(e) => {
                            setCheckedItems2([false, false, false, e.target.checked])
                            setValue("status", "approved")
                        }} 
                        >
                            <Tag colorScheme={"blue"} size={"sm"}>Approved</Tag>
                        </Checkbox>
                    </Stack>
                </CheckboxGroup>
            </Stack>
            <Stack mt={5}>
                <Text mb={4}>Brand</Text>
                <InputGroup>
                    <InputLeftElement pointerEvents='none'>
                        <FaSearch className='text-gray-400' />
                    </InputLeftElement>
                    <Input 
                        type='text' 
                        placeholder='Search' 
                        value={brandFilter} 
                        onChange={(e) => {
                            setBrandFilter(e.target.value);
                        }} 
                    />
                </InputGroup>
                {/* <Text fontWeight={"normal"} fontSize={"13px"} color={"gray.500"}>Searched results.</Text> */}
                {
                    (brands?.data?.length > 0) && brands?.data?.map((brand: MedicationData) => (
                        <Stack key={brand.id}>
                            <Checkbox 
                            value={brand?.name}
                            isChecked={brand?.name === selectedBrand}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                if(isChecked){
                                    setSelectedBrand(e.target.value);
                                    setValue("brand", e.target.value);
                                }
                            }}>
                                {brand.name}
                            </Checkbox>
                        </Stack>
                    ))
                }
            </Stack>
            <Stack mt={5}>
                <Text mb={3}>Date</Text>
                <FormControl>
                    <FormLabel>
                        From
                    </FormLabel>
                    <Controller
                        name="fromDate"
                        control={control}
                        render={({ field }) => (
                        <DateComponent
                            startDate={field.value}
                            setStartDate={field.onChange}
                            isMinDate
                            isMaxDate
                        />
                        )}
                    />
                </FormControl>
                <FormControl mt={4}>
                    <FormLabel>
                        To
                    </FormLabel>
                    <Controller
                        name="toDate"
                        control={control}
                        render={({ field }) => (
                        <DateComponent
                            startDate={field.value}
                            setStartDate={field.onChange}
                            isMaxDate
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