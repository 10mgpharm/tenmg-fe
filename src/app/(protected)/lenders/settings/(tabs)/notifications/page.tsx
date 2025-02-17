'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Switch } from '@chakra-ui/react';

export default function Page() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const notification_card_details = [
    {
      title: "Customers' credit application",
      desc: "Get notification when customers submit a credit application",
      tag: "customer_credit_application"
    },
    {
      title: "Customer Repayment [auto or manual payment]",
      desc: "Get a notification when a repayment is done for your customers",
      tag: "customer_repayment"
    },
    {
      title: "Lender approve customer application",
      desc: "Get a notification when a lender approves your customer's credit application",
      tag: "lender_approve_customer"
    },
    {
      title: " Loan offering",
      desc: "Get notification when admin sends loan offer to your customer",
      tag: "loan_offering"
    },
  ];

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {notification_card_details.map((opt, i) => (
          <Notification
            key={i}
            title={opt.title}
            desc={opt.desc}
            tag={opt.tag}
            register={register}
            errors={errors}
          />
        ))}
        {/* <Button type="submit" colorScheme="primary" mt={4}>
        Submit
      </Button> */}
      </form>
    </div>
  );
}

const Notification = ({ title, desc, tag, register, errors }) => {
  return (
    <div>
      <div className='space-y-4 w-full flex justify-between p-5 '>
        <div>
          <h3 className='font-semibold text-lg'>{title}</h3>
          <p className='text-sm text-slate-300'>{desc}</p>
        </div>
        <Switch colorScheme='primary' {...register(tag)} />
      </div>
      {errors[tag] && <span>This field is required</span>}

    </div>
  );
};