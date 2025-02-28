"use client";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession, NotificationProps, NotificationResponseData } from "@/types";
import { handleServerErrorMessage } from "@/utils";
import { Divider, Switch } from "@chakra-ui/react"
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const Notifications = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [loading, setLoading] = useState<boolean>(false);
    const [notificationData, setNotificationData] = useState<NotificationResponseData>();

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
        const response = await requestClient({ token: token }).get(
            `/account/app-notifications`
        );
        if (response.status === 200) {
            setNotificationData(response.data.data);
        }
        setLoading(false);
        } catch (error) {
        console.error(error);
        setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if(!token) return;
        fetchNotifications();
    },[fetchNotifications, token]);

    const SubscribeToNotification = async(id: number) => {
    if(id){
        try {
            const response = await requestClient({ token: token }).patch(
                `/account/app-notifications/${id}/subscription`
            );
            if(response.status === 200){
                toast.success(response.data?.message)
            }
        } catch (error) {
            console.error(error);
            toast.error(handleServerErrorMessage(error));
        }
    }
  }

  return (
    <div>
        <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Notifications</h3>
            <p className="text-gray-500 text-sm">Update your notification preference here</p>
            <Divider />
        </div>
        <div className="py-5">
            {
                notificationData?.data?.map((item: NotificationProps) => (
                    <div key={item?.id} className="border p-4 rounded-md flex items-center justify-between mb-5">
                        <div className="max-w-xl">
                            <h3 className="font-medium text-gray-700">{item?.name}</h3>
                            <p className="text-sm text-gray-500">{item?.description}</p>
                        </div>
                        <Switch 
                        size={"lg"} 
                        defaultChecked={item?.isSubscribed} 
                        onChange={() => SubscribeToNotification(item.id)}
                        />
                    </div>
                ))
            }
        </div>
        {/* <div className="flex justify-end">
            <div className="flex items-center gap-3">
                <Button variant={"outline"}>Discard</Button>
                <Button bg={"blue.700"}>Save Changes</Button>
            </div>
        </div> */}
    </div>
  )
}

export default Notifications