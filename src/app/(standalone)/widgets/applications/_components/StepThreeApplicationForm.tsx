"use client";

import React, { useEffect, useTransition } from "react";
import {
    Avatar,
    Box,
    Text,
    FormControl,
    FormLabel,
    Center,
    Select,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Button,
    FormErrorMessage,
    Link,
    Flex,
    NumberInput,
    NumberInputField,
    Stack,
} from "@chakra-ui/react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import LoanProfile from "../../_components/LoanProfile";
import LoanLayout from "../../_components/LoanLayout";
import { BusinessDto, CustomerDto, ApplicationDto, BankAccountDto } from "@/types";
import { formatAmount } from "@/utils/formatAmount";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getDefaultBankAccount } from "../actions";
import { toast } from "react-toastify";


interface Props {
    token: string;
    business: BusinessDto;
    customer: CustomerDto;
    application: ApplicationDto;
    onContinueAction: (durationInMonth: number, bankDetail: BankAccountDto) => void;
    navigateBackAction?: () => void;
}

interface SelectOption {
    label: string;
    value: number;
}

const schema = z.object({
    durationInMonth: z.enum(["3", "6", "7", "9", "12"], {
        errorMap: () => ({ message: "Invalid duration selected" }),
    }).transform(Number), // Convert string to number
});

type FormInput = z.infer<typeof schema>;

export default function StepThreeApplicationForm({ token, business, application, customer, navigateBackAction, onContinueAction }: Props) {
    const [requestedAmount, setRequestedAmount] = useState<number>(application.requestedAmount);

    const {
        register,
        watch,
        formState: { errors },
        handleSubmit,

    } = useForm<FormInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            durationInMonth: undefined, // Ensures the user selects a value
        },
        mode: "onChange",
    });

    const durationInMonth = watch('durationInMonth');

    const [monthlyInterestAmount, setMonthlyInterestAmount] = useState<number>(0);
    const [monthlyCapitalAmount, setMonthlyCapitalAmount] = useState<number>(0);
    const [monthlyRepaymentAmount, setMonthlyCapitalRepayment] = useState<number>(0);
    const [totalRepayment, setTotalRepayment] = useState<number>(0);

    const durations: SelectOption[] = [
        { label: '3 Months', value: 3 },
        { label: '6 Months', value: 6 },
        { label: '9 Months', value: 9 },
        { label: '12 Months', value: 12 }
    ];


    const [isPending, startTransition] = useTransition();

    const handleGetDefaultBankAccount = (durationInMonth: number) => {
        startTransition(async () => {
            const { data: bankDetail, status, message } = await getDefaultBankAccount(token, customer.identifier);
            if (status === 'error') {
                toast.error(message);
            } else {
                onContinueAction(durationInMonth, bankDetail);
            }
        });
    }

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        handleGetDefaultBankAccount(data.durationInMonth);
    };

    useEffect(() => {
        if (durationInMonth) {
            const totalInterestAmount = (application.interestRate / 100) * application.requestedAmount;
            const interestAmtPerMonth = totalInterestAmount / durationInMonth;
            setMonthlyInterestAmount(interestAmtPerMonth);

            const totalCapitalAmount = application.requestedAmount;
            const capitalPerMonth = totalCapitalAmount / durationInMonth;
            setMonthlyCapitalRepayment(capitalPerMonth + interestAmtPerMonth);
            setMonthlyCapitalAmount(capitalPerMonth);

            setTotalRepayment(Number(totalInterestAmount) + Number(totalCapitalAmount));
        }
    }, [durationInMonth])

    return (
        <LoanLayout name={business?.name} logo={business?.logo} navigateBackAction={navigateBackAction}>
            <section className="flex justify-between items-center w-full pb-8">
                <LoanProfile name={customer?.name} email={customer?.email} />
                <IoMdInformationCircleOutline className="w-6 h-6" />
            </section>

            <section className="pb-8 flex flex-col gap-5 justify-center items-center">
                <Text fontSize="md">
                    Credit Amount
                </Text>
                <Text fontSize="sm" className="bg-blue-50 rounded p-2 text-center text-xs">
                    This is the total amount retrieve from your checkout point.
                </Text>

                <Flex alignItems="center" justifyContent="center" flex={1}>
                    <Flex alignItems="center">
                        <NumberInput
                            variant="unstyled"
                            value={formatAmount(requestedAmount)}
                        >
                            <NumberInputField
                                fontSize={50}
                                p={0}
                                outline={0}
                                textAlign="center"
                                disabled
                            />
                        </NumberInput>
                    </Flex>
                </Flex>

                <Box w="full">
                    <Slider
                        defaultValue={requestedAmount}
                        min={10000}
                        max={3000000}
                        step={5000}
                        onChange={(val) => setRequestedAmount(val)}
                        isReadOnly
                        isDisabled
                    >
                        <SliderTrack bg="secondary.400" height="8px" borderRadius="4px">
                            <SliderFilledTrack bg="primary.500" />
                        </SliderTrack>
                        <SliderThumb boxSize={6} borderColor="primary.500" />
                    </Slider>

                    <Flex justifyContent="space-between">
                        <Text fontSize="sm">Min Amount: {formatAmount(10000)}</Text>
                        <Text fontSize="sm">Max Amount: {formatAmount(3000000)}</Text>
                    </Flex>
                </Box>
            </section>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <Box mb={10}>
                    <FormControl isInvalid={!!errors.durationInMonth?.message} mb={5}>
                        <FormLabel htmlFor="loanRepayment">Loan Repayment</FormLabel>
                        <Select
                            id="durationInMonth"
                            placeholder="Choose Repayment Period"
                            {...register("durationInMonth")}
                        >
                            {durations?.map((duration) =>
                                <option key={duration.value} value={duration.value}>{duration.label} Repayment Plan</option>
                            )}
                        </Select>

                        <FormErrorMessage>
                            {errors.durationInMonth?.message}
                        </FormErrorMessage>
                    </FormControl>
                    {durationInMonth && (
                        <Box
                            bgColor="warning.100"
                            borderColor="warning.400"
                            border="1px solid var(--tenmg-colors-warning-400)"
                            p={4}
                            borderRadius="sm"
                            my={6}
                        >
                            <Stack direction="column">
                                <Text fontSize="sm" fontWeight="bold">
                                    Interest rate: {application.interestRate}%
                                </Text>
                                <Text fontSize="sm" fontWeight="bold">
                                    Total Repayment: {formatAmount(totalRepayment)}
                                </Text>
                                <Text fontSize="sm" fontWeight="bold">
                                    Monthly Interest: {formatAmount(monthlyInterestAmount)}
                                </Text>
                                <Text fontSize="sm" fontWeight="bold">
                                    Monthly Capital: {formatAmount(monthlyCapitalAmount)}
                                </Text>
                                <Text fontSize="sm" fontWeight="bold">
                                    Monthly Repayment: {formatAmount(monthlyRepaymentAmount)}
                                </Text>
                            </Stack>
                        </Box>
                    )}
                </Box>

                <Box mb={8}>
                    <Button colorScheme="purple" size="lg" w="full" type="submit" isLoading={isPending} loadingText={'Processing...'}>
                        Continue
                    </Button>
                </Box>
                <Center gap={2}>
                    <Text fontSize="sm" lineHeight={5}>
                        By clicking on continue you agree with
                        <Link paddingLeft={1} color="blue.500" fontWeight="bold">
                            10MG User End Policy
                        </Link>
                    </Text>
                </Center>
            </form>
        </LoanLayout>
    );
};
