"use client";
import requestClient from "@/lib/requestClient";
import { cn } from "@/lib/utils";
import { NextAuthUserSession } from "@/types";
import { handleServerErrorMessage, truncateString } from "@/utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowTrendUp } from "react-icons/fa6"
import { IoMdNotificationsOutline } from "react-icons/io"
import { LuBox } from "react-icons/lu"
import { NotificationProps } from "../../suppliers/_components/TopNavBar/NotificationModal";
import { Flex, Spinner } from "@chakra-ui/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { toast } from "react-toastify";

const Notifications = () => {

    const [selectedNotification, setSelectedNotification] = useState<NotificationProps>();
    const [data, setData] = useState<NotificationProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [notificationId, setNotificationId] = useState("");

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const fetchingData = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await requestClient({ token: token }).get(
            `/account/notifications`
            );

            if (response.status === 200) {
                setData(response.data.data.data || []);
                setSelectedNotification(response?.data?.data?.data[0]);
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

    const markAsRead = async (id: string) => {
        try {
            const res = await requestClient({ token: token }).patch(
                `/account/notifications/${id}`,
            );
            if (res.status === 200) {
                toast.success(res?.data?.message)
            } else {
                setError("Failed to load audit logs. Please try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error(handleServerErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }

    if(loading){
        return(
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        )
    }

    return (
    <div className='flex h-[calc(100vh-150px)] rounded-sm m-4 bg-white'>
        <div className="border-r">
            <h2 className="text-xl font-semibold mb-2 px-4 mt-5">My Notifications</h2>
            <button className="text-primary-500 font-medium text-sm mb-6 px-4">
                Mark all as read
            </button>
            <div className="space-y-3">
                {data?.map((notification) => (
                    <div
                        key={notification?.id}
                        className={cn(
                            selectedNotification?.id === notification.id 
                            ? "text-black/50 font-normal" : 
                            "hover:bg-gray-100/10 font-medium", 
                            "cursor-pointer max-w-md border-b border-gray-200")}
                        onClick={() => setSelectedNotification(notification)}
                    >
                    <div className='flex mx-4'>
                        <div>
                            <div className="p-1 bg-blue-100 text-blue-600 rounded-full">
                                <IoMdNotificationsOutline
                                className="w-5 h-5 cursor-pointer"
                                />
                            </div>
                            {/* {notification?.type ===
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
                            } */}
                        </div>
                        <div>
                            <p className="px-4 text-sm">{truncateString(notification?.data?.message, 76)}</p>
                            <p className="text-sm text-gray-500 my-2 px-4">{notification?.createdAt}</p>
                        </div>
                        <Menu as="div" className="relative">
                            <MenuButton
                            className="-m-2.5 p-2.5 text-gray-600"
                            >
                                <span className="sr-only">open notifications menu</span>
                                <BsThreeDotsVertical className="w-5 h-5"/>
                            </MenuButton>
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2.5 w-36 origin-top-right space-y-2 rounded-md bg-white p-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <MenuItem onClick={() => markAsRead(notification.id)} as={"div"}>
                                        <span className="text-sm">Mark as read</span>
                                    </MenuItem>
                                    <MenuItem as={"div"}>
                                        <span className="text-red-500 text-sm">Delete Notification</span>
                                    </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            ))}
            </div>
        </div>
        <div className="flex-1 p-6">
            {selectedNotification ? (
            <div>
                <div>
                    <div className="inline-flex p-1 bg-blue-100 text-blue-600 rounded-full">
                        <IoMdNotificationsOutline
                            className="w-10 h-10 cursor-pointer"
                        />
                    </div>
                    {/* {selectedNotification?.type ===
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
                    } */}
                </div>
                <h3 className="text-base font-normal mt-5 max-w-2xl">{selectedNotification?.data?.message}</h3>
            </div>
            ) : (
            <p className="text-gray-500">Select a notification to see details.</p>
            )}
        </div>
    </div>
  )
}

export default Notifications