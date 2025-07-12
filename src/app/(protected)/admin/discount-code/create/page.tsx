"use client";
import { cn } from '@/lib/utils';
import Select from 'react-select';
import { useCallback, useEffect, useState } from 'react'
import { 
    Button, 
    Flex, 
    FormControl, 
    FormLabel, 
    Input, 
    Radio, 
    RadioGroup, 
    Stack,  
    Text 
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react';
import { NextAuthUserSession, ProductResponseData } from '@/types';
import requestClient from '@/lib/requestClient';
import { convertArray } from '@/utils/convertSelectArray';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { generateRandomCoupon, handleServerErrorMessage } from '@/utils';
import { useRouter } from 'next/navigation';
import DateComponent from '@/app/(protected)/suppliers/products/_components/DateComponent';
import { useDebouncedValue } from '@/utils/debounce';
import { ArrowLeft } from 'lucide-react';
interface OptionType {
    label: string;
    value: number
}
interface IFormInput {
    applicationMethod: string;
    couponCode?: string;
    discountAmount: number;
    discountType: string;
    applicableProducts: number[];
    customerLimit: string;
    startDate: Date | null;
    endDate: Date | null;
    allProduct: boolean;
}
  
const CreateDiscount = () => {

    const navigate = useRouter();
    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const [isLoading, setIsLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [products, setProducts] = useState<ProductResponseData>();

    const debouncedSearch = useDebouncedValue(globalFilter, 500);

    const fetchingProducts = useCallback(async() => {
        try {
            const response = await requestClient({ token: token }).get(
                `/admin/settings/products/search?search=${debouncedSearch}`
            );
            if(response.status === 200){
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error(error)
        }
    },[token, debouncedSearch]);

    useEffect(() => {
        if(!token) return;
        fetchingProducts();
    },[token, fetchingProducts]);

    const {
        control,
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        watch
    } = useForm<IFormInput>({
        mode: "onChange",
        defaultValues: {
            applicationMethod: "COUPON",
            customerLimit: "LIMITED",
            discountType: "PERCENTAGE",
        }
    });

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        let formdata: any;
        setIsLoading(true);
        if(data.allProduct){
            formdata = {
                allProducts: true,
                applicationMethod: data.applicationMethod,
                couponCode: data.couponCode,
                discountType: data?.discountType,
                discountAmount: data?.discountAmount,
                customerLimit: data?.customerLimit, 
                startDate: new Date(data.startDate).toLocaleDateString('en-CA'),
                endDate: new Date(data.endDate).toLocaleDateString('en-CA'),
            }
        }else{
            formdata = {
                allProducts: false,
                applicationMethod: data.applicationMethod,
                applicableProducts: data.applicableProducts,
                couponCode: data.couponCode,
                discountType: data?.discountType,
                discountAmount: data?.discountAmount,
                customerLimit: data?.customerLimit, 
                startDate: new Date(data.startDate).toLocaleDateString('en-CA'),
                endDate: new Date(data.endDate).toLocaleDateString('en-CA'),
            }
        }
        try {
            const response = await requestClient({token: token}).post(
                "/admin/discounts",
                formdata
            )
            if(response.status === 200){
                setIsLoading(false);
                toast.success(response.data.message);
                navigate.push('/admin/discount-code');
            }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error(handleServerErrorMessage(error));
        }
    }

    const [selectedOption, setSelectedOption] = useState([]);

    const discountType = watch("discountType");
    const methodType = watch("applicationMethod");
    const allProducts = products?.data && [{id: "AllProduct", name: "All Products"}, ...products?.data]
    const productOptions = convertArray(allProducts);

    // Disable all options except the selected ones when "All Products" is selected
    const updatedOptions = productOptions?.map((opt: OptionType) => ({
        ...opt,
        isDisabled: selectedOption.some((sel) => sel.label === "All Products") && opt.label !== "All Products",
    }));

    const handleRandomCoupon = () => {
        const couponCode = generateRandomCoupon();
        setValue("couponCode", couponCode);
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return (
    <div className='max-w-2xl mx-auto'>
        <Flex
            cursor={"pointer"}
            onClick={() => navigate.back()}
            align={"center"}
            gap={2}
            pt={6}
          >
            <ArrowLeft className="w-5 h-auto text-gray-500" />
            <Text fontSize={"14px"} color={"gray.600"}>
              Back
            </Text>
        </Flex>
       
        <div className="bg-white p-4 sm:p-6 rounded-md my-4 sm:my-8 md:my-10">
        <h2 className='font-semibold text-lg md:text-xl text-gray-700'>Create Discount</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack mt={4}>
                <FormControl>
                    <FormLabel className='font-medium text-base md:text-lg'>Method</FormLabel>
                    <Controller 
                    control={control}
                    name='applicationMethod'
                    rules={{ required: 'Method is required' }}
                    render={({ field: { onChange, value } }) => {
                        return(
                            <RadioGroup onChange={onChange} value={value}>
                                <Stack gap={3}>
                                    <Radio value='COUPON'>Coupon Code</Radio>
                                    <Radio value='AUTOMATIC'>Automatic Discount</Radio>
                                </Stack>
                            </RadioGroup>
                        )
                    }}
                    />
                </FormControl>
            </Stack>
            {
                methodType === "COUPON" &&
                <Stack mt={4}>
                    <FormControl>
                        <FormLabel className='font-medium text-base md:text-lg'>Coupon Code</FormLabel>
                        <Flex gap={2} direction={{base: "column", sm: "row"}}>
                            <Input 
                                id="couponCode"
                                name="couponCode"
                                placeholder="e.g 10mg code" 
                                type="text"
                                height={"40px"}
                                isInvalid={!!errors.couponCode}
                                _focus={{
                                    border: !!errors.couponCode ? "red.300" : "border-gray-300",
                                }}
                                {...register("couponCode", {
                                    required: (methodType === "COUPON") ? true : false,
                                })}
                            />
                            <button 
                            type='button'
                            onClick={handleRandomCoupon} 
                            className='text-sm md:text-medium bg-black p-2 md:p-3 text-white rounded-md w-full sm:w-36'>
                                Generate
                            </button>
                        </Flex>
                        <p className='text-xs sm:text-sm text-gray-600 mt-1'>
                            Customer must enter this code at checkout.
                        </p>
                    </FormControl>
                </Stack>
            }
            <Stack mt={4}>
                <FormControl isInvalid={!!errors.discountAmount}>
                    <FormLabel className='font-medium text-base md:text-lg'>Value</FormLabel>
                    <Flex gap={2} direction={{base: "column", md: "row"}}>
                        <Flex gap={2} width={{base: "full", md: "auto"}}>
                            <p 
                            onClick={() => setValue("discountType", "PERCENTAGE")} 
                            className={cn('py-2 md:py-3 px-3 md:px-5 text-sm md:text-base rounded-md cursor-pointer flex-1 md:w-[150px] text-center', discountType === "PERCENTAGE" ? "border border-gray-300" : "border-0 bg-gray-100")}>
                                Percentage
                            </p>
                            <p 
                            onClick={() => setValue("discountType", "FIXED")} 
                            className={cn('py-2 md:py-3 px-3 md:px-5 text-sm md:text-base rounded-md cursor-pointer flex-1 md:w-[150px] text-center', discountType === "FIXED" ? "border border-gray-300" : "border-0 bg-gray-100")}>
                                Fixed Amount
                            </p>
                        </Flex>
                        <Input 
                            id="discountAmount"
                            name="discountAmount"
                            placeholder="e.g 10mg code" 
                            type="text"
                            height={"48px"}
                            py={3}
                            flex={1}
                            isInvalid={!!errors.discountAmount}
                            _focus={{
                                border: !!errors.discountAmount ? "red.300" : "border-gray-300",
                            }}
                            {...register("discountAmount", {
                                required: true,
                            })}
                        />
                    </Flex>
                </FormControl>
            </Stack>
            <Stack mt={4}>
                <FormControl>
                    <FormLabel className='font-medium text-base md:text-lg'>Applies to</FormLabel>
                    <Controller 
                    control={control}
                    name='applicableProducts'
                    rules={{ required: 'Applied to product is required' }}
                    render={({ field }) => {
                        return(
                            <div className="text-sm md:text-base">
                                <Select
                                    isClearable={true}
                                    isSearchable={true}
                                    isMulti
                                    options={updatedOptions}
                                    placeholder={"Select Products"}
                                    closeMenuOnSelect={false}
                                    onChange={(selectedOption: OptionType[]) => {
                                        setSelectedOption([]);
                                        const productIds = selectedOption.flatMap((item: OptionType) => {
                                            if(item.label === "All Products"){
                                                setSelectedOption([item]);
                                                setValue("allProduct", true);
                                                return [item.value] ;
                                            } else {
                                                setValue("allProduct", false);
                                                return [item.value];
                                            }
                                        });
                                        setValue("applicableProducts", productIds);
                                    }}
                                    onInputChange={(inputValue) => setGlobalFilter(inputValue) }
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            minHeight: '40px',
                                            '@media (min-width: 768px)': {
                                                minHeight: '48px',
                                            },
                                        }),
                                    }}
                                    className="text-sm md:text-base"
                                />
                            </div>
                        )
                    }}
                    />
                </FormControl>
            </Stack>
            <Stack mt={4} mb={5}>
                <FormControl>
                    <FormLabel className='font-medium text-base md:text-lg'>Customer Limit</FormLabel>
                    <Controller 
                    control={control}
                    name='customerLimit'
                    rules={{ required: 'Customer limit is required' }}
                    render={({ field: { onChange, value } }) => {
                        return(
                            <RadioGroup mt={3} onChange={onChange} value={value}>
                                <Stack gap={3}>
                                    <Radio value='LIMITED'>
                                        <Stack gap={0.5}>
                                            <Text fontWeight={600} fontSize={{base: "sm", md: "md"}}>Limit one per customer</Text>
                                            <Text fontSize={{base: "xs", md: "14px"}} color={"gray.500"}>
                                                Discount can be used once per email address
                                            </Text>
                                        </Stack>
                                    </Radio>
                                    <Radio value='UNLIMITED'>
                                        <Stack gap={0.5}>
                                            <Text fontWeight={600} fontSize={{base: "sm", md: "md"}}>Unlimited offer</Text>
                                            <Text fontSize={{base: "xs", md: "14px"}} color={"gray.500"}>
                                                Discount can be used once per email address
                                            </Text>
                                        </Stack>
                                    </Radio>
                                </Stack>
                            </RadioGroup>
                        )
                    }}
                    />
                </FormControl>
            </Stack>
            <Stack mt={4}>
                <FormControl>
                    <FormLabel className='font-medium text-base md:text-lg'></FormLabel>
                    <Controller 
                    control={control}
                    name='startDate'
                    rules={{ required: 'Start date is required' }}
                    render={({ field }) => {
                        return(
                            <Stack>
                                <Stack gap={0.5}>
                                    <Text fontWeight={600} fontSize={{base: "sm", md: "md"}}>Discount Start Date</Text>
                                    {/* <Text fontSize={"14px"} color={"gray.500"}>
                                        Schedule the discount to activate in the future
                                    </Text> */}
                                </Stack>
                                <div className="text-xs md:text-sm">
                                    <DateComponent
                                    startDate={field.value}
                                    setStartDate={field.onChange}
                                    isMinDate
                                    minDate={tomorrow}
                                    />
                                </div>
                                {errors.startDate?.message &&
                                    <Text as={"span"} className="text-red-500 text-xs sm:text-sm">
                                        {errors?.startDate?.message}
                                    </Text>
                                }
                            </Stack>
                        )
                    }}
                    />
                </FormControl>
                <FormControl mt={3}>
                    <FormLabel className='font-medium text-base md:text-lg'></FormLabel>
                    <Controller 
                    control={control}
                    name='endDate'
                    rules={{ required: 'End date is required' }}
                    render={({ field }) => {
                        return(
                            <Stack>
                                <Stack gap={0.5}>
                                    <Text fontWeight={600} fontSize={{base: "sm", md: "md"}}>Discount Expiry Date</Text>
                                    {/* <Text fontSize={"14px"} color={"gray.500"}>
                                        Schedule the discount to deactivate in the future
                                    </Text> */}
                                </Stack>
                                <div className="text-xs md:text-sm">
                                    <DateComponent
                                        startDate={field.value}
                                        setStartDate={field.onChange}
                                        minDate={watch("startDate")}
                                        isMinDate
                                        isDisabled={watch("startDate") ? false : true}
                                    />
                                </div>
                                {errors.endDate?.message &&
                                    <Text as={"span"} className="text-red-500 text-xs sm:text-sm">
                                        {errors?.endDate?.message}
                                    </Text>
                                }
                            </Stack>
                        )
                    }}
                    />
                </FormControl>
            </Stack>
            <Flex mt={6} gap={2} direction={{base: "column", sm: "row"}} justify={{base: "stretch", sm: "end"}}>
                <Button 
                type="button" 
                variant={"outline"}
                onClick={() => navigate.back()}
                width={{base: "100%", sm: "auto"}}
                height={"40px"}
                fontSize={{base: "sm", md: "md"}}
                >
                    Cancel
                </Button>
                <Button 
                isLoading={isLoading} 
                type='submit'
                loadingText={"Submitting..."} 
                bg={"primary.500"}
                width={{base: "100%", sm: "158px"}}
                height={"40px"}
                fontSize={{base: "sm", md: "md"}}
                >
                    Publish Code
                </Button>
            </Flex>
        </form>
        </div>
    </div>
  )
}

export default CreateDiscount;