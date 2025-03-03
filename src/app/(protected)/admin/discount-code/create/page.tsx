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
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-md my-16">
        <h2 className='font-semibold text-lg text-gray-700'>Create Discount</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack mt={5}>
                <FormControl>
                    <FormLabel className='font-medium text-lg'>Method</FormLabel>
                    <Controller 
                    control={control}
                    name='applicationMethod'
                    rules={{ required: 'Method is required' }}
                    render={({ field: { onChange, value } }) => {
                        return(
                            <RadioGroup onChange={onChange} value={value}>
                                <Stack gap={4}>
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
                <Stack mt={5}>
                    <FormControl>
                        <FormLabel className='font-medium text-lg'>Coupon Code</FormLabel>
                        <Flex gap={3}>
                            <Input 
                                id="couponCode"
                                name="couponCode"
                                placeholder="e.g 10mg code" 
                                type="text"
                                height={"48px"}
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
                            className='text-medium bg-black p-3 text-white rounded-md w-36'>
                                Generate
                            </button>
                        </Flex>
                        <p className='text-sm text-gray-600 mt-1'>
                            Customer must enter this code at checkout.
                        </p>
                    </FormControl>
                </Stack>
            }
            <Stack mt={5}>
                <FormControl isInvalid={!!errors.discountAmount}>
                    <FormLabel className='font-medium text-lg'>Value</FormLabel>
                    <Flex gap={3}>
                        <p 
                        onClick={() => setValue("discountType", "PERCENTAGE")} 
                        className={cn('py-3 px-5 rounded-md cursor-pointer w-[150px]', discountType === "PERCENTAGE" ? "border" : "border-0")}>
                            Percentage
                        </p>
                        <p 
                        onClick={() => setValue("discountType", "FIXED")} 
                        className={cn('py-3 px-5 rounded-md cursor-pointer w-[150px]', discountType === "FIXED" ? "border" : "border-0")}>
                            Fixed Amount
                        </p>
                        <Input 
                            id="discountAmount"
                            name="discountAmount"
                            placeholder="e.g 10mg code" 
                            type="text"
                            height={"48px"}
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
            <Stack mt={5}>
                <FormControl>
                    <FormLabel className='font-medium text-lg'>Applies to</FormLabel>
                    <Controller 
                    control={control}
                    name='applicableProducts'
                    rules={{ required: 'Applied to product is required' }}
                    render={({ field }) => {
                        return(
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
                            />
                        )
                    }}
                    />
                </FormControl>
            </Stack>
            <Stack mt={5}>
                <FormControl>
                    <FormLabel className='font-medium text-lg'>Customer Limit</FormLabel>
                    <Controller 
                    control={control}
                    name='customerLimit'
                    rules={{ required: 'Customer limit is required' }}
                    render={({ field: { onChange, value } }) => {
                        return(
                            <RadioGroup mt={4} onChange={onChange} value={value}>
                                <Stack gap={4}>
                                    <Radio value='LIMITED'>
                                        <Stack gap={0.5}>
                                            <Text fontWeight={600}>Limit one per customer</Text>
                                            <Text fontSize={"14px"} color={"gray.500"}>
                                                Discount can be used once per email address
                                            </Text>
                                        </Stack>
                                    </Radio>
                                    <Radio value='UNLIMITED'>
                                        <Stack gap={0.5}>
                                            <Text fontWeight={600}>Unlimited offer</Text>
                                            <Text fontSize={"14px"} color={"gray.500"}>
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
            <Stack mt={5}>
                <FormControl>
                    <FormLabel className='font-medium text-lg'></FormLabel>
                    <Controller 
                    control={control}
                    name='startDate'
                    rules={{ required: 'Start date is required' }}
                    render={({ field }) => {
                        return(
                            <Stack>
                                <Stack gap={0.5}>
                                    <Text fontWeight={600}>Discount Start Date</Text>
                                    {/* <Text fontSize={"14px"} color={"gray.500"}>
                                        Schedule the discount to activate in the future
                                    </Text> */}
                                </Stack>
                                <DateComponent
                                startDate={field.value}
                                setStartDate={field.onChange}
                                isMinDate
                                minDate={tomorrow}
                                />
                                {errors.startDate?.message &&
                                    <Text as={"span"} className="text-red-500 text-sm">
                                        {errors?.startDate?.message}
                                    </Text>
                                }
                            </Stack>
                        )
                    }}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel className='font-medium text-lg'></FormLabel>
                    <Controller 
                    control={control}
                    name='endDate'
                    rules={{ required: 'End date is required' }}
                    render={({ field }) => {
                        return(
                            <Stack>
                                <Stack gap={0.5}>
                                    <Text fontWeight={600}>Discount Expiry Date</Text>
                                    {/* <Text fontSize={"14px"} color={"gray.500"}>
                                        Schedule the discount to deactivate in the future
                                    </Text> */}
                                </Stack>
                                <DateComponent
                                    startDate={field.value}
                                    setStartDate={field.onChange}
                                    minDate={watch("startDate")}
                                    isMinDate
                                    isDisabled={watch("startDate") ? false : true}
                                />
                                {errors.endDate?.message &&
                                    <Text as={"span"} className="text-red-500 text-sm">
                                        {errors?.endDate?.message}
                                    </Text>
                                }
                            </Stack>
                        )
                    }}
                    />
                </FormControl>
            </Stack>
            <Flex mt={8} gap={3} justify={"end"}>
                <Button 
                type="button" 
                variant={"outline"}
                onClick={() => navigate.back()}
                >
                    Cancel
                </Button>
                <Button 
                isLoading={isLoading} 
                type='submit'
                loadingText={"Submitting..."} 
                bg={"primary.500"}
                width={"158px"}
                >
                    Publish Code
                </Button>
            </Flex>
        </form>
    </div>
  )
}

export default CreateDiscount;