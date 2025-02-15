"use client";

import React, { useEffect, useRef, useTransition } from "react";
import {
    Box,
    Text,
    FormControl,
    FormLabel,
    Center,
    Select,
    Button,
    FormErrorMessage,
    Link,
    Flex,
    NumberInput,
    NumberInputField,
    Skeleton,
} from "@chakra-ui/react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import LoanProfile from "../../_components/LoanProfile";
import LoanLayout from "../../_components/LoanLayout";
import { BusinessDto, CustomerDto, ApplicationDto, BankDto, BankAccountDto } from "@/types";
import { createBankAccount, getBankList, verifyBankAccount } from "../actions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { maskAccountNumber } from "@/lib/utils";

interface Props {
    token: string;
    business: BusinessDto;
    customer: CustomerDto;
    application: ApplicationDto;
    defaultBankDetail?: BankAccountDto;
    navigateBackAction?: () => void;
    onContinueAction?: (defaultBankAccount: BankAccountDto) => void;
}

interface SelectOption {
    label: string;
    value: number;
}

const formSchema = z.object({
    accountNumber: z
        .string()
        .nonempty("Account number cannot be empty.")
        .length(10, "Account number must be exactly 10 digits.")
        .regex(/^\d{10}$/, "Account number must contain only digits."),
    accountName: z
        .string()
        .min(1, "Account name cannot be empty."),
    bankCode: z
        .string({ invalid_type_error: "Please select a bank." })
        .min(1, "Please select a valid bank."),
    bankName: z.string().nonempty(),
    address: z.string().optional(),
});

type FormInput = z.infer<typeof formSchema>;

export default function StepFourMandateForm({ token, defaultBankDetail, business, application, customer, navigateBackAction, onContinueAction }: Props) {
    const [accountVerificationInProgress, startBankAccountVerification] = useTransition();
    const [saveBankLoading, startSaveBank] = useTransition();
    const [accountVerificationError, setAccountVerificationError] = useState<string | null>(null);
    const [banks, setBanks] = useState<SelectOption[] | null>(null);

    const [defaultBankAccount, setDefaultBankAccount] = useState<BankAccountDto>(defaultBankDetail);
    const [edit, setEdit] = useState<boolean>(false);

    const {
        register,
        watch,
        formState: { errors },
        handleSubmit,
        setValue,
        trigger,
    } = useForm<FormInput>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    const accountNumber = watch('accountNumber');
    const bankCode = watch('bankCode');
    const bankName = watch('bankName');
    const accountName = watch('accountName');

    const accountNumberInputRef = useRef<HTMLInputElement>(null);

    const handleGetBankList = async () => {
        const response = await getBankList(token);
        if (response.status === 'error') {
            setBanks([]);
        } else {
            const bankList: BankDto[] = response.data;
            setBanks(bankList?.map((bank) => ({ label: bank.name, value: bank.code })));
        }
    }

    const handleVerifyBankAccount = (accountNumber: number, bankCode: number) => {
        startBankAccountVerification(async () => {
            setAccountVerificationError(null);
            setValue('accountName', '');

            const { data, status, message } = await verifyBankAccount(token, { accountNumber, bankCode });
            if (status === 'error') {
                setAccountVerificationError(message);
            } else {
                if (data.success) {
                    setValue('accountName', data?.data?.accountName);
                } else {
                    setAccountVerificationError(data?.message);
                }
            }
        });
    }

    const handleSaveBankAccount = (formInput: FormInput) => {
        startSaveBank(async () => {
            const { accountNumber, accountName, bankCode, bankName } = formInput;

            const { data, status, message } = await createBankAccount(token, {
                identifier: customer?.identifier,
                accountNumber,
                accountName,
                bankCode,
                bankName,
            });
            if (status === 'error') {
                toast.error(message);
            } else {
                toast.success(message);
                setDefaultBankAccount(data);
                setEdit(false);
                onContinueAction(defaultBankAccount);
            }
        });
    }

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        handleSaveBankAccount(data);
    };

    useEffect(() => {
        if (accountNumber && accountNumber?.length === 10 && bankCode && bankName) {
            handleVerifyBankAccount(Number(accountNumber), Number(bankCode));
        } else {
            setValue('accountName', '');
        }

    }, [accountNumber, bankCode])

    useEffect(() => {
        if (token) {
            handleGetBankList();
        }
    }, [token]);

    useEffect(() => {
        if (defaultBankDetail) {
            setDefaultBankAccount(defaultBankAccount);
        }
    }, [defaultBankDetail])

    useEffect(() => {
        if (accountNumberInputRef?.current) {
            accountNumberInputRef?.current?.focus();
        }
    }, []);

    useEffect(() => {
        if (defaultBankAccount && edit) {
            setValue('accountName', defaultBankAccount.accountName);
            setValue('accountNumber', defaultBankAccount.accountNumber);
            setValue('bankCode', defaultBankAccount.bankCode);
            setValue('bankName', defaultBankAccount.bankName);
        }
    }, [edit, defaultBankAccount])

    return (
        <LoanLayout name={business?.name} logo={business?.logo} navigateBackAction={navigateBackAction}>
            {(!defaultBankAccount || edit) && (
                <>
                    <section className="flex justify-between items-center w-full pb-8">
                        <LoanProfile name={customer?.name} email={customer?.email} />
                        <IoMdInformationCircleOutline className="w-6 h-6" />
                    </section>

                    <section className="pb-8 flex flex-col gap-5 justify-center items-center">
                        <Text fontSize="md" textAlign={'center'}>
                            Provide Bank Account Details for Loan Repayment
                        </Text>
                        <Text fontSize="sm" className="bg-blue-50 rounded p-2 text-center text-xs">
                            Enter your account number below
                        </Text>
                        <Flex direction='column' alignItems="center" justifyContent="center" flex={1}>
                            <Flex alignItems="center">
                                <NumberInput
                                    variant="unstyled"
                                    value={accountNumber ?? ''}
                                    onChange={async (val) => {
                                        setValue('accountNumber', val);
                                        await trigger(['accountNumber']);
                                    }}
                                    isDisabled={saveBankLoading}
                                >
                                    <NumberInputField
                                        ref={accountNumberInputRef}
                                        fontSize={50}
                                        p={0}
                                        outline={0}
                                        textAlign="center"
                                        placeholder="0000000000"
                                    />
                                </NumberInput>
                            </Flex>
                            <Text fontSize={'sm'} color={'red.500'}>
                                {errors.accountNumber?.message}
                            </Text>
                        </Flex>
                    </section>

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        <Box mb={10}>
                            <FormControl isInvalid={!!errors.bankCode?.message} mb={5}>
                                <FormLabel htmlFor="bankCode">Bank</FormLabel>
                                <Select
                                    id="bankCode"
                                    placeholder="Choose Bank"
                                    {...register("bankCode")}
                                    disabled={saveBankLoading}
                                    onChange={(e) => {
                                        setValue('bankCode', e.target.value);
                                        setValue('bankName', e.target.options[e.target.selectedIndex].text);
                                        trigger(['bankCode']);
                                    }}
                                >
                                    {banks?.map((bank, index) =>
                                        <option
                                            key={`${bank.value}-${index}`}
                                            value={bank.value}
                                        >
                                            {bank.label}
                                        </option>
                                    )}
                                </Select>

                                <FormErrorMessage>
                                    {errors.bankCode?.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.accountName?.message || !!accountVerificationError} mb={4}>
                                <FormLabel>Account Name</FormLabel>
                                <Skeleton isLoaded={!accountVerificationInProgress} fadeDuration={0.5} borderRadius="md">
                                    <Text p={2} bg="gray.100" borderRadius="md">
                                        {accountName || "Account name will appear here"}
                                    </Text>
                                    {accountVerificationError && (
                                        <Flex justify={'space-between'} align={'center'} mt={1}>
                                            <Text fontSize={'sm'} color={'red.500'}>{accountVerificationError}</Text>
                                        </Flex>
                                    )}
                                </Skeleton>
                                <FormErrorMessage>{!accountName && errors.accountName?.message}</FormErrorMessage>
                            </FormControl>
                        </Box>

                        <Box mb={8}>
                            <Button
                                colorScheme="purple"
                                size="lg"
                                w="full"
                                type="submit"
                                isLoading={saveBankLoading}
                                loadingText="Saving Account Details..."
                            >
                                Save Account Details
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
                </>
            )}
            {(defaultBankAccount && !edit) && (
                <>
                    <section className="flex justify-between items-center w-full pb-8">
                        <LoanProfile name={customer?.name} email={customer?.email} />
                        <IoMdInformationCircleOutline className="w-6 h-6" />
                    </section>
                    <section className="pb-8 flex flex-col gap-5 justify-center items-center">
                        <Text fontSize="md" textAlign={'center'}>
                            Bank Account Details for Loan Repayment
                        </Text>
                        <Text fontSize="sm" className="bg-blue-50 rounded p-2 text-center text-xs mb-5">
                            Confirm the bank account below is still active
                        </Text>
                        <Text fontSize="lg" fontWeight={'bold'} textAlign={'center'}>
                            {defaultBankAccount.accountName}
                        </Text>
                        <Text fontSize="lg" textAlign={'center'}>
                            {maskAccountNumber(defaultBankAccount.accountNumber)}
                        </Text>
                        <Text fontSize="lg" textAlign={'center'}>
                            {defaultBankAccount.bankName}
                        </Text>
                    </section>
                    <Flex justifyItems={'between'} alignItems={'center'} gap={5} mt={5} mb={8}>
                        <Button
                            variant={'ghost'}
                            size="lg"
                            w="full"
                            type="submit"
                            isLoading={saveBankLoading}
                            loadingText="Saving Account Details..."
                            className="!bg-blue-50"
                            onClick={() => {
                                setEdit(true);
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            colorScheme="blue"
                            size="lg"
                            w="full"
                            type="submit"
                            isLoading={saveBankLoading}
                            loadingText="Saving Account Details..."
                        >
                            Submit Application
                        </Button>
                    </Flex>
                    <Center gap={2}>
                        <Text fontSize="sm" lineHeight={5}>
                            By clicking on continue you agree with
                            <Link paddingLeft={1} color="blue.500" fontWeight="bold">
                                10MG User End Policy
                            </Link>
                        </Text>
                    </Center>
                </>
            )}
        </LoanLayout>
    );
};
