"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Spinner, Switch } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import {
  NextAuthUserSession,
  NotificationProps,
  NotificationResponseData,
} from "@/types";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

export default function Page() {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [loading, setLoading] = useState<boolean>(false);
  const [subScribing, setSubScribing] = useState(false);
  const [notificationData, setNotificationData] =
    useState<NotificationResponseData>();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        `/account/app-notifications`
      );
      if (response.status === 200) {
        setNotificationData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchNotifications();
  }, [fetchNotifications, token]);

  const SubscribeToNotification = async (id: number) => {
    if (id) {
      setSubScribing(true);
      try {
        const response = await requestClient({ token: token }).patch(
          `/account/app-notifications/${id}/subscription`
        );
        if (response.status === 200) {
          toast.success(response.data?.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(handleServerErrorMessage(error));
      }

      setSubScribing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {notificationData?.data?.map((item: NotificationProps) => (
        <div
          key={item?.id}
          className="border p-4 rounded-md flex items-center justify-between mb-5"
        >
          <div className="max-w-xl">
            <h3 className="font-medium text-gray-700">{item?.name}</h3>
            <p className="text-sm text-gray-500">{item?.description}</p>
          </div>
          <Switch
            size={"lg"}
            defaultChecked={item?.isSubscribed}
            onChange={() => SubscribeToNotification(item.id)}
            disabled={subScribing}
          />
        </div>
      ))}
    </div>
  );
}
