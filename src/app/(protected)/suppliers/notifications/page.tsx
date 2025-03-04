"use client";
import requestClient from "@/lib/requestClient";
import { cn } from "@/lib/utils";
import { NextAuthUserSession, SingleNotification } from "@/types";
import { handleServerErrorMessage, truncateString } from "@/utils";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react"
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowTrendUp } from "react-icons/fa6"
import { IoIosNotifications, IoMdNotificationsOutline } from "react-icons/io"
import { LuBox } from "react-icons/lu"
import { NotificationProps } from "../../suppliers/_components/TopNavBar/NotificationModal";
import { Flex, Spinner } from "@chakra-ui/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { toast } from "react-toastify";

const Notifications = () => {

    const [selectedNotification, setSelectedNotification] = useState<SingleNotification>();
    const [data, setData] = useState<NotificationProps[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const fetchingData = async () => {
        setLoading(true);
        try {
            const response = await requestClient({ token: token }).get(
            `/account/notifications`
            );
            if (response.status === 200) {
                setData(response.data.data.data || []);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(handleServerErrorMessage(err))
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchingData();
        }
    }, [token]);

    const markAsRead = async (id: string, reload: boolean) => {
        try {
            const res = await requestClient({ token: token }).patch(
                `/account/notifications/${id}`,
            );
            if (res.status === 200) {
                if(reload){
                    toast.success(res?.data?.message)
                }
                fetchingData();
            }
        } catch (error) {
            console.error(error);
            toast.error(handleServerErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }

    const fetchingDataById = useCallback(async (id: string) => {
        setIsLoading(true);
        try {
            const response = await requestClient({ token: token }).get(
            `/account/notifications/${id}`
            );
            if (response.status === 200) {
                markAsRead(id, false)
                setSelectedNotification(response?.data?.data);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(handleServerErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    }, [token]) 

    const handleDelete = useCallback(async (id: string) => {
        // setLoading(true);
        try {
            const response = await requestClient({ token: token }).delete(
            `/account/notifications/${id}`
            );
            if (response.status === 200) {
                fetchingData();
            }
        } catch (err: any) {
            console.error(err);
            toast.error(handleServerErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [token]) 

    if(loading){
        return(
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        )
    }

    return (
    <div className='h-[calc(100vh-150px)] rounded-sm m-4 bg-white'>
        {
            data?.length === 0 ?
            <div className="flex flex-col items-center justify-center pt-24 text-center">
                <IoIosNotifications
                    className="w-32 h-32 text-primary-500"
                />
                <p className="text-gray-500 font-medium mt-4">
                This is where your notifications will appear.
              </p>
            </div>
            : 
            <div className="flex h-[calc(100vh-150px)] rounded-sm m-4 bg-white">
                <div className="border-r">
                    <h2 className="text-xl font-semibold mb-2 px-4 mt-5">My Notifications</h2>
                    <button className="text-primary-500 font-medium text-sm mb-6 px-4">
                        Mark all as read
                    </button>
                    <div className="space-y-3">
                        {
                        data?.map((notification) => (
                            <div
                                key={notification?.id}
                                className={cn(
                                    (selectedNotification?.id === notification.id || notification?.readAt) 
                                    ? "text-black/50 font-normal" : 
                                    "hover:bg-gray-100/10 font-semibold", 
                                    "cursor-pointer max-w-md border-b border-gray-200")}
                            >
                            <div className='flex mx-4'>
                                <div className="p-1 bg-blue-100 text-blue-600 rounded-full max-h-max">
                                    <IoMdNotificationsOutline
                                    className="w-5 h-5 cursor-pointer"
                                    />
                                </div>
                                <div className="flex-1 flex items-center">
                                    <div className="flex-1" onClick={() => fetchingDataById(notification.id)}>
                                        <p className="px-4">{truncateString(notification?.data?.message, 76)}</p>
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
                                            className="absolute right-0 z-10 mt-2.5 w-36 origin-top-right space-y-1 rounded-md bg-white p-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                            >
                                                <MenuItem onClick={() => markAsRead(notification.id, true)} as={"div"}>
                                                    <span className="text-sm text-gray-600">Mark as read</span>
                                                </MenuItem>
                                                <MenuItem as={"div"} onClick={() => handleDelete(notification.id)}>
                                                    <span className="text-red-600 text-[13px]">Delete Notification</span>
                                                </MenuItem>
                                        </MenuItems>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                <div className="flex-1 p-6">
                    {
                    isLoading ? (
                        <Flex justify="center" align="center" height="200px">
                            <Spinner size="xl" />
                        </Flex>
                    ) :
                    selectedNotification ? (
                        <div>
                            <div>
                                <div className="flex items-center gap-5">
                                    <div className="inline-flex p-1 bg-blue-100 text-blue-600 rounded-full">
                                        <IoMdNotificationsOutline
                                            className="w-10 h-10 cursor-pointer"
                                        />
                                    </div>
                                    <h3 className="text-base font-semibold">{selectedNotification?.data?.subject}</h3>
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
                        <div className="flex justify-center items-center mt-48">
                            <p className="text-gray-500 text-xl">Select a notification to see details.</p>
                        </div>
                    )}
                </div>
            </div>
        }
    </div>
  )
}

export default Notifications;