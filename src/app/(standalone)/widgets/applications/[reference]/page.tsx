import { Metadata } from 'next';
import React from 'react'
import { getApplicationConfig } from '../actions';
import { ApplicationDto, ApplicationWidgetConfig, BusinessDto, CustomerDto, ResponseDto } from '@/types';
import ApplicationWidget from '../_components/ApplicationWidget';

export const metadata: Metadata = {
  title: 'Apply for 10mg Health Credit',
};

interface PageProps {
  params: {
    reference: string;
  };
  searchParams: {
    token: string | null | undefined;
  };
}

export default async function Page({ params: { reference }, searchParams: { token } }: PageProps) {
  
  if (!token) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">Invalid application link provided</h1>
        </div>
      </>
    )
  }

  const response: ResponseDto<ApplicationWidgetConfig> = await getApplicationConfig(reference, token);

  if (response.status === 'error') {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">{response.message}</h1>
        </div>
      </>
    )
  }

  const data: ApplicationWidgetConfig = response.data;
  const business: BusinessDto = data.business;
  const customer: CustomerDto = data.customer;
  const application: ApplicationDto = data.application;

  return (
    <ApplicationWidget
      business={business}
      customer={customer}
      application={application}
      reference={reference}
      token={token}
    />
  )
}
