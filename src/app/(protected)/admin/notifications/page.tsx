"use client";
import { notificationsMsgs } from "@/data/mockdata"
import requestClient from "@/lib/requestClient";
import { cn } from "@/lib/utils";
import { NextAuthUserSession } from "@/types";
import { truncateString } from "@/utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowTrendUp } from "react-icons/fa6"
import { IoMdNotificationsOutline } from "react-icons/io"
import { LuBox } from "react-icons/lu"

const Notifications = () => {

    const [selectedNotification, setSelectedNotification] = useState(notificationsMsgs[0]);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const fetchingData = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await requestClient({ token }).get(
            `/account/notifications`
            );

            if (response.status === 200 && response.data.data) {
                setData(response.data.data.records || []);
            } else {
                setError("Failed to load audit logs. Please try again.");
            }
        } catch (err: any) {
            console.error(err);
            setError("An unexpected error occurred while fetching audit logs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchingData();
        }
    }, [token]);

    console.log(data);

    return (
    <div className='flex h-[calc(100vh-150px)] rounded-sm m-4 bg-white'>
        <div className="border-r">
            <h2 className="text-xl font-semibold mb-2 px-4 mt-5">My Notifications</h2>
            <button className="text-primary-500 font-medium text-sm mb-6 px-4">
                Mark all as read
            </button>
            <div className="space-y-3">
                {notificationsMsgs?.map((notification) => (
                    <div
                        key={notification?.id}
                        className={cn(
                            selectedNotification.id === notification.id 
                            ? "text-black/50 font-normal" : 
                            "hover:bg-gray-100/10 font-medium", 
                            "cursor-pointer max-w-md border-b border-gray-200")}
                        onClick={() => setSelectedNotification(notification)}
                    >
                    <div className='flex mx-4'>
                        <div>
                            {notification?.type ===
                                "payment" ? <div className="p-1 bg-blue-100 text-blue-600 rounded-full">
                                            <IoMdNotificationsOutline
                                                className="w-5 h-5 cursor-pointer"
                                            />
                                        </div>
                                : "order" ?
                                        <div className="p-1 bg-purple-100 text-purple-600 rounded-full">
                                            <LuBox
                                                className="w-5 h-5 cursor-pointer"
                                            />
                                        </div> 
                                : "stock" ?
                                    <div className="p-1 bg-red-100 text-red-600 rounded-full">
                                        <FaArrowTrendUp
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                    </div> :
                                    <div className="p-1 bg-red-100 text-red-600 rounded-full">
                                        <FaArrowTrendUp
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                    </div>
                            }
                        </div>
                        <div>
                            <p className="px-4 text-sm">{truncateString(notification?.message, 76)}</p>
                            <p className="text-sm text-gray-500 my-2 px-4">{notification?.time}</p>
                        </div>
                        <BsThreeDotsVertical className="w-6 h-6"/>
                    </div>
                </div>
            ))}
            </div>
        </div>
        <div className="flex-1 p-6">
            {selectedNotification ? (
            <div>
                <div>
                    {selectedNotification?.type ===
                        "payment" ? <div className="inline-flex p-1 bg-blue-100 text-blue-600 rounded-full">
                                    <IoMdNotificationsOutline
                                        className="w-10 h-10 cursor-pointer"
                                    />
                                </div>
                        : "order" ?
                                <div className="inline-flex p-1 bg-purple-100 text-purple-600 rounded-full">
                                    <LuBox
                                        className="w-10 h-10 cursor-pointer"
                                    />
                                </div> 
                        : "stock" ?
                                <div className="inline-flex p-1 bg-red-100 text-red-600 rounded-full">
                                    <FaArrowTrendUp
                                        className="w-10 h-10 cursor-pointer"
                                    />
                                </div> :
                                <div className="inline-flex p-1 bg-red-100 text-red-600 rounded-full">
                                    <FaArrowTrendUp
                                        className="w-10 h-10 cursor-pointer"
                                    />
                                </div>
                    }
                </div>

                <h3 className="text-base font-normal mt-5 max-w-2xl">{selectedNotification.message}</h3>
            </div>
            ) : (
            <p className="text-gray-500">Select a notification to see details.</p>
            )}
        </div>
    </div>
  )
}

export default Notifications