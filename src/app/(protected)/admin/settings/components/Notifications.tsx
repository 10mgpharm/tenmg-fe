"use client";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";
import { Button, Divider, Switch } from "@chakra-ui/react"
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

const notifications = [
    {title: "Goods Expiration", desc: "Get notified about expiration of goods."},
    {title: "New Medication", desc: "Get notified when a supplier include new types of medication, brand, category etc."},
    {title: "Shopping List", desc: "Get notified when a pharmacy add product to shopping list."},
    {title: "Order Payment Confirmation", desc: "Get notified of your commission when an order is paid for."},
    {title: "New Message", desc: "Get notified when you have a new message from a supplier."},
    {title: "New User", desc: "Get notified about new vendor, pharmacy or supplier."},
]

const Notifications = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [loading, setLoading] = useState<boolean>(false);
    const [notificationData, setNotificationData] = useState([]);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
        const response = await requestClient({ token: token }).get(
            `/admin/settings/notification`
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

  console.log(notificationData);

  return (
    <div>
        <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Notifications</h3>
            <p className="text-gray-500 text-sm">Update your notification preference here</p>
            <Divider />
        </div>
        <div className="py-5">
            {
                notifications?.map((item, index) => (
                    <div key={index} className="border p-4 rounded-md flex items-center justify-between mb-5">
                        <div className="max-w-xl">
                            <h3 className="font-medium text-gray-700">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <Switch size={"lg"}/>
                    </div>
                ))
            }
        </div>
        <div className="flex justify-end">
            <div className="flex items-center gap-3">
                <Button variant={"outline"}>Discard</Button>
                <Button bg={"blue.700"}>Save Changes</Button>
            </div>
        </div>
    </div>
  )
}

export default Notifications