"use client";

import { Button, Divider, Flex, Spinner, Switch } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { NextAuthUserSession, NotificationResponseData } from "@/types";
import { handleServerErrorMessage } from "@/utils";

const Notifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);

  const [notificationId, setNotificationId] = useState<number[]>([]);

  const [notifications, setNotifications] =
    useState<NotificationResponseData>();

  const { data: sessionData } = useSession() as {
    data: NextAuthUserSession;
  };

  const fetchNotifications = useCallback(async () => {
    setIsNotificationLoading(true);
    try {
      const response = await requestClient({
        token: sessionData.user.token,
      }).get(`/account/app-notifications`);
      if (response.status === 200) {
        setNotifications(response.data.data);
      }
      setIsNotificationLoading(false);
    } catch (error) {
      console.error(error);
      setIsNotificationLoading(false);
    }
  }, [sessionData?.user?.token]);

  useEffect(() => {
    if (!sessionData?.user?.token) return;
    fetchNotifications();
  }, [fetchNotifications, sessionData?.user?.token]);

  const subscribeToNotification = async (id: number) => {
    if (id) {
      try {
        const response = await requestClient({
          token: sessionData.user.token,
        }).patch(`/account/app-notifications/${id}/subscription`);
        if (response.status === 200) {
          toast.success(response.data?.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(handleServerErrorMessage(error));
      }
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
        {isNotificationLoading && (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        )}
        {!isNotificationLoading &&
          notifications?.data?.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-md flex items-center justify-between mb-5"
            >
              <div className="max-w-xl">
                <h3 className="font-medium text-gray-700">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <Switch
                size={"lg"}
                onChange={() => subscribeToNotification(item.id)}
                isChecked={item?.isSubscribed}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Notifications;
