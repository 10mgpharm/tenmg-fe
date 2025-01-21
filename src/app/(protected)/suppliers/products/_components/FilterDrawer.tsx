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
import { Dispatch, SetStateAction } from 'react';
import { MedicationData, MedicationResponseData} from '@/types';

interface IFormInput {
    fromDate?: Date | null;
    toDate?: Date | null;
    inventory?: string[];
    brand?: string[];
    status?: string[];
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

    const {
        handleSubmit,
        formState: {errors},
        control,
        reset,
        setValue,
        getValues,
        trigger,
        watch
    } = useForm<IFormInput>({
        mode: "onChange",
        defaultValues: {
            inventory: [],
            status: [],
            brand: [],
            toDate: null,
            fromDate: null
        }
    });

    const onSubmit = (data: IFormInput) => {
        applyFilters(data);
        onClose();
    };

    const handleClearFilters = () => {
        reset({
            brand: [],
            inventory: [],
            toDate: null,
            fromDate: null,
            status: [],
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
            <Stack mt={1}>
                <Text mb={4}>Inventory</Text>
                <CheckboxGroup>
                    <Stack spacing={4} direction='column'>
                        <Checkbox 
                            isChecked={watch("inventory").includes("IN STOCK")} 
                            onChange={(e) => {
                                const currentValues = getValues("inventory") || [];
                                if(e.target.checked){
                                    const newArr = [...currentValues, "IN STOCK"]
                                    setValue("inventory", newArr);
                                }else{
                                    const removeItem = currentValues.filter((item) => item !== "IN STOCK")
                                    setValue("inventory", removeItem);
                                }
                                trigger("inventory");
                            }} 
                        >
                            <Tag colorScheme={"green"} size={"sm"}>In stock</Tag>
                        </Checkbox>
                        <Checkbox 
                            isChecked={watch("inventory").includes("LOW STOCK")} 
                            onChange={(e) => {
                                const currentValues = getValues("inventory") || [];
                                if(e.target.checked){
                                    const newArr = [...currentValues, "LOW STOCK"]
                                    setValue("inventory", newArr);
                                }else{
                                    const removeItem = currentValues.filter((item) => item !== "LOW STOCK")
                                    setValue("inventory", removeItem);
                                }
                                trigger("inventory");
                            }} 
                        >
                            <Tag colorScheme={"orange"} size={"sm"}>Low stock</Tag>
                        </Checkbox>
                        <Checkbox 
                            isChecked={watch("inventory").includes("OUT OF STOCK")} 
                            onChange={(e) => {
                                const currentValues = getValues("inventory") || [];
                                if(e.target.checked){
                                    const newArr = [...currentValues, "OUT OF STOCK"]
                                    setValue("inventory", newArr);
                                }else{
                                    const removeItem = currentValues.filter((item) => item !== "OUT OF STOCK")
                                    setValue("inventory", removeItem);
                                }
                                trigger("inventory");
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
                            isChecked={watch("status").includes("active")} 
                            onChange={(e) => {
                                const currentValues = getValues("status") || [];
                                if(e.target.checked){
                                    const newArr = [...currentValues, "active"]
                                    setValue("status", newArr);
                                }else{
                                    const removeItem = currentValues.filter((item) => item !== "active")
                                    setValue("status", removeItem);
                                }
                                trigger("status");
                            }} 
                        >
                            <Tag colorScheme={"green"} size={"sm"}>Active</Tag>
                        </Checkbox>
                        <Checkbox 
                            isChecked={watch("status").includes("inactive")} 
                            onChange={(e) => {
                                const currentValues = getValues("status") || [];
                                if(e.target.checked){
                                    const newArr = [...currentValues, "inactive"]
                                    setValue("status", newArr);
                                }else{
                                    const removeItem = currentValues.filter((item) => item !== "inactive")
                                    setValue("status", removeItem);
                                }
                                trigger("status");
                            }} 
                        >
                            <Tag colorScheme={"orange"} size={"sm"}>Inactive</Tag>
                        </Checkbox>
                        <Checkbox 
                        isChecked={watch("status").includes("flagged")} 
                        onChange={(e) => {
                            const currentValues = getValues("status") || [];
                            if(e.target.checked){
                                const newArr = [...currentValues, "flagged"]
                                setValue("status", newArr);
                            }else{
                                const removeItem = currentValues.filter((item) => item !== "flagged")
                                setValue("status", removeItem);
                            }
                            trigger("status");
                        }}  
                        >
                            <Tag colorScheme={"red"} size={"sm"}>Flagged</Tag>
                        </Checkbox>
                        <Checkbox 
                        isChecked={watch("status").includes("approved")} 
                        onChange={(e) => {
                            const currentValues = getValues("status") || [];
                            if(e.target.checked){
                                const newArr = [...currentValues, "approved"]
                                setValue("status", newArr);
                            }else{
                                const removeItem = currentValues.filter((item) => item !== "approved")
                                setValue("status", removeItem);
                            }
                            trigger("status");
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
                {
                    (brands?.data?.length > 0 && brandFilter !== "") && brands?.data?.map((brand: MedicationData) => (
                        <Stack key={brand.id}>
                            <Checkbox 
                            value={brand?.name}
                            isChecked={brand?.name === selectedBrand}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                if(isChecked){
                                    setSelectedBrand(e.target.value);
                                    // setValue("brand", e.target.value);
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