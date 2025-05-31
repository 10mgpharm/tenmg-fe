import React from 'react'
import OrderPaymentStatusPage from '../_components/OrderPaymentStatusPage'
import { ApplicationStatusResponseDto, ResponseDto } from '@/types';
import { getOrderPaymentStatus } from '../actions';

interface PageProps {
  params: {
    reference: string;
  };
  searchParams: {
    reference: string | undefined
  }
}

export default async function Page({ searchParams: { reference } }: PageProps) {
  const response: ResponseDto<ApplicationStatusResponseDto> =
    await getOrderPaymentStatus(reference);
  
  if (response?.status === "error") {
    return <div>
      <p>{response?.message}</p>
    </div>
  }

  return (
    <>
      <OrderPaymentStatusPage
        status={response?.data?.application?.status}
        message={response?.data?.message}
        orderStatus={response?.data?.orderStatus}
        application={response?.data?.application}
        repaymentUrl={response?.data?.repaymentUrl}
      />
    </>
  )
}
