'use client';

import { ApplicationDto, BankAccountDto, BankMandateDto, BusinessDto, CustomerDto } from '@/types';
import React, { useEffect, useState } from 'react'
import StepOneConsent from './StepOneConsent';
import StepTwoCheckingEligibility from './StepTwoCheckingElegibility';
import StepThreeApplicationForm from './StepThreeApplicationForm';
import { SubmitHandler, useForm } from 'react-hook-form';
import StepFourBankForm from './StepFourBankForm';
import StepFiveMandateScreen from './StepFiveMandateScreen';

interface Props {
    business: BusinessDto;
    customer: CustomerDto;
    application: ApplicationDto;
    reference: string;
    token: string;
}

interface IFormInput {
    requestedAmount: number;
    durationInMonth: number;
    bankDetail: BankAccountDto;
    mandateReference: string;
    mandateAmount: number;
    mandateDescription: string;
    mandateStatus: string;
}

export default function ApplicationWidget({ business, customer, application, reference, token }: Props) {
    const [activeStep, setActiveStep] = useState<number>(1);
    const [mandateDetail, setMandateDetail] = useState<BankMandateDto | null>(null);

    const {
        formState: { errors, isSubmitting },
        handleSubmit,
        setValue,
        watch,
    } = useForm<IFormInput>({
        defaultValues: {
            requestedAmount: application.requestedAmount,
            durationInMonth: null,
            bankDetail: null,
            mandateReference: null,
            mandateAmount: null,
            mandateDescription: null,
            mandateStatus: null,
        },
        mode: "onChange",
    });

    const bankDetail = watch('bankDetail');
    const durationInMonth = watch('durationInMonth');
    const mandateReference = watch('mandateReference');
    const mandateAmount = watch('mandateAmount');
    const mandateDescription = watch('mandateDescription');
    const mandateStatus = watch('mandateStatus');

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        // handle final submission of form data 
        console.log({ data })
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const step = queryParams.get('step');
        if (step) {
            setActiveStep(parseInt(step));
        }
    }, []);

    useEffect(() => {
        //TODO: Handle step specific global logic here 
        console.log({ activeStep })
    }, [activeStep])

    switch (activeStep) {
        case 1:
            return (
                <StepOneConsent
                    business={business}
                    customer={customer}
                    application={application}
                    onContinueAction={() => {
                        setActiveStep(activeStep + 1);
                    }}
                />
            );
        case 2:
            return (
                <StepTwoCheckingEligibility
                    business={business}
                    customer={customer}
                    application={application}
                    navigateBackAction={() => {
                        setActiveStep(activeStep - 1);
                    }}
                    onContinueAction={() => {
                        setActiveStep(activeStep + 1);
                    }}
                />
            );
        case 3:
            return (
                <StepThreeApplicationForm
                    token={token}
                    business={business}
                    customer={customer}
                    application={application}
                    navigateBackAction={() => {
                        setActiveStep(1); //reset
                    }}
                    onContinueAction={async (durationInMonth: number, bankDetail: BankAccountDto) => {
                        // set bank info for mandate creation
                        if (bankDetail) {
                            setValue('bankDetail.accountName', bankDetail?.accountName);
                            setValue('bankDetail.accountNumber', bankDetail?.accountNumber);
                            setValue('bankDetail.bankCode', bankDetail?.bankCode);
                            setValue('bankDetail.bankName', bankDetail?.bankName);
                        }

                        setValue('durationInMonth', durationInMonth);
                        setActiveStep(activeStep + 1);
                    }}
                />
            );
        case 4:
            return (
                <StepFourBankForm
                    token={token}
                    defaultBankDetail={bankDetail}
                    business={business}
                    customer={customer}
                    application={application}
                    durationInMonth={durationInMonth}
                    setMandateDetail={setMandateDetail}
                    navigateBackAction={() => {
                        setActiveStep(activeStep - 1);
                    }}
                    onContinueAction={(defaultBankAccount: BankAccountDto, mandateDetail?: BankMandateDto) => {
                        // set bank info for mandate creation
                        setValue('bankDetail.accountName', defaultBankAccount?.accountName);
                        setValue('bankDetail.accountNumber', defaultBankAccount?.accountNumber);
                        setValue('bankDetail.bankCode', defaultBankAccount?.bankCode);
                        setValue('bankDetail.bankName', defaultBankAccount?.bankName);
                        setValue("mandateReference", mandateDetail.reference);
                        

                        setActiveStep(activeStep + 1);
                    }}
                />
            );
        case 5:
            return (
                <StepFiveMandateScreen
                    token={token}
                        defaultBankDetail={bankDetail}
                        business={business}
                        customer={customer}
                        application={application}
                        navigateBackAction={() => {
                            setActiveStep(activeStep - 1);
                        }}
                        mandateDetail={mandateDetail}
                        onContinueAction={(defaultBankAccount: BankAccountDto) => {
                            // set bank info for mandate creation
                            setValue('bankDetail.accountName', defaultBankAccount?.accountName);
                            setValue('bankDetail.accountNumber', defaultBankAccount?.accountNumber);
                            setValue('bankDetail.bankCode', defaultBankAccount?.bankCode);
                            setValue('bankDetail.bankName', defaultBankAccount?.bankName);
                         
                    }}
                />
                );
    }
}
