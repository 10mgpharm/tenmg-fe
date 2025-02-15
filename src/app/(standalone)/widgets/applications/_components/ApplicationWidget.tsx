'use client';

import { ApplicationDto, BusinessDto, CustomerDto } from '@/types';
import React, { useEffect, useState } from 'react'
import StepOneConsent from './StepOneConsent';
import StepTwoCheckingEligibility from './StepTwoCheckingElegibility';
import StepThreeApplicationForm from './StepThreeApplicationForm';

interface Props {
    business: BusinessDto;
    customer: CustomerDto;
    application: ApplicationDto;
    reference: string;
    token: string;
}

export default function ApplicationWidget({ business, customer, application, reference, token }: Props) {
    const [activeStep, setActiveStep] = useState<number>(0);

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
        case 2:
            return (
                <StepThreeApplicationForm
                    business={business}
                    customer={customer}
                    application={application}
                    navigateBackAction={() => {
                        setActiveStep(0);
                    }}
                    onContinueAction={() => {
                        setActiveStep(activeStep + 1);
                    }}
                />
            );
        default:
            // initial step = 0
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
    }
}
