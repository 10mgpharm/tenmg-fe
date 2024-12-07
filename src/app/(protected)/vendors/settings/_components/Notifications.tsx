'use client';

import { Button, Divider, Switch } from "@chakra-ui/react";
import { useState } from "react";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { handleServerErrorMessage } from "@/utils";

const notifications = [
  {
    title: "License Expiry",
    desc: "Get a notification when your license is about to expire or has expired.",
  },
  {
    title: "Customers' Credit Application",
    desc: "Get notification when customers submit a credit application.",
  },
  {
    title: "Customers' Credit Offer Status",
    desc: "Get notification of customer's credit offer status.",
  },
  {
    title: "Customer Repayment [auto or manual payment]",
    desc: "Get a notification when a repayment is done for your customers.",
  },
  {
    title: "Lender Approve Customer Application",
    desc: "Get a notification when a lender approves your customer's credit application.",
  },
  {
    title: "Loan Offering",
    desc: "Get notification when admin sends loan offer to your customer.",
  },
  {
    title: "Customer Pay with 10mg Credit Voucher",
    desc: "Get a notification when your customer pays with 10MG credit voucher.",
  },
];

const Notifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: sessionData } = useSession() as {
    data: NextAuthUserSession;
  };
  const onSubmit = async () => {
    try {
      setIsLoading(true);

      const response = await requestClient({
        token: sessionData.user.token,
      }).patch("/account/notifications/1/subscription");

      if (response.status === 200) {
        toast.success(response.data.message);
        setIsLoading(false);
      } else {
        toast.error(`Notification Subscription failed: ${response.data.message}`);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Notifications</h3>
        <p className="text-gray-500 text-sm">
          Update your notification preference here
        </p>
        <Divider />
      </div>
      <div className="py-5">
        {notifications?.map((item, index) => (
          <div
            key={index}
            className="border p-4 rounded-md flex items-center justify-between mb-5"
          >
            <div className="max-w-xl">
              <h3 className="font-medium text-gray-700">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <Switch size={"lg"} />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <div className="flex items-center gap-3">
          <Button variant={"outline"}>Discard</Button>
          <Button
            bg={"blue.700"}
            onClick={onSubmit}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
