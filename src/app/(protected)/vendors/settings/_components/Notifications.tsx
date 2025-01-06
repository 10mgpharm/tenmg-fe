"use client";

import { Button, Divider, Flex, Spinner, Switch } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { handleServerErrorMessage } from "@/utils";

const Notifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);

  const [notificationId, setNotificationId] = useState<number[]>([]);

  const [notifications, setNotifications] = useState<any[]>([]);

  const { data: sessionData } = useSession() as {
    data: NextAuthUserSession;
  };

  useEffect(() => {
    const fetchUserNotificationSubscription = async () => {
      try {
        setIsNotificationLoading(true);

        const response = await requestClient({
          token: sessionData.user.token,
        }).get("/account/notifications");

        if (response?.status === 200) {
          const fetchedNotifications = response?.data.data.data ?? [];
          setNotifications(fetchedNotifications);

          const alreadySubscribedIds = fetchedNotifications
            .filter((noti: any) => noti.isSubscribed)
            .map((noti: any) => noti.id);
          setNotificationId(alreadySubscribedIds);
          setIsNotificationLoading(false);
        } else {
          toast.error(
            `Notification Subscription failed: ${response.data.message}`
          );
        }
      } catch (error) {
        const errorMessage = handleServerErrorMessage(error);
        toast.error(errorMessage);
        setIsNotificationLoading(false);
      }
    };

    if (sessionData?.user?.token) fetchUserNotificationSubscription();
  }, [sessionData?.user?.token]);

  const handleNotificationChange = (id: number) => {
    setNotificationId((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleNotification = async () => {
    try {
      setIsNotificationLoading(true);

      const response = await requestClient({
        token: sessionData.user.token,
      }).patch(`/account/notifications/subscriptions`, {
        notificationIds: notificationId,
      });

      if (response.status === 200) {
        console.log(response.data.data);
        toast.success(response.data.message);
      } else {
        toast.error(
          `Notification Subscription failed: ${response.data.message}`
        );
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsNotificationLoading(false);
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
          notifications.map((item) => (
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
                onChange={() => handleNotificationChange(item.id)}
                isChecked={notificationId.includes(item.id)}
                isDisabled={isNotificationLoading}
              />
            </div>
          ))}
      </div>
      <div className="flex justify-end">
        <div className="flex items-center gap-3">
          <Button variant={"outline"}>Discard</Button>
          <Button
            bg={"blue.700"}
            onClick={handleNotification}
            disabled={isNotificationLoading}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
