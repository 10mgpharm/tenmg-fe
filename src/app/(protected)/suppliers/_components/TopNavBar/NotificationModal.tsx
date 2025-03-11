import Link from 'next/link';
import { IoIosNotifications } from "react-icons/io";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MenuItem, MenuItems } from "@headlessui/react";
import { useRouter } from 'next/navigation';
import { Flex } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react';
import { cn } from '@/lib/utils';
export interface NotificationProps {
    id: string;
    readAt: string | null;
    createdAt: string;
    data: {
        message: string;
        subject: string;
    } 
}

const NotificationModal = (
    { notificationsMsgs, route, loading }: 
    { notificationsMsgs: NotificationProps[], route: string, loading: boolean}
) => {
    const navigate = useRouter();
    console.log(notificationsMsgs)
    return (
    <MenuItems 
        transition
        className="absolute right-5 z-10 mt-5 pb-8 w-full sm:w-[430px] h-[560px] overflow-y-scroll origin-top-right rounded-lg bg-white py-2 shadow-xl ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
        <div className="flex-1">
            <MenuItem>
                <div className="flex items-center justify-between px-5">
                    <p className='font-bold text-lg'>Notifications</p>
                    <div
                    onClick={() => navigate.push(route)}
                        className='text-sm font-semibold cursor-pointer text-primary-600'
                    >
                        View all
                    </div>
                </div>
            </MenuItem>
            {
                loading ? 
                <Flex justify="center" align="center" height="200px">
                    <Spinner size="xl" />
                </Flex>: 
                notificationsMsgs?.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-24 text-center">
                    <IoIosNotifications
                        className="w-32 h-32 text-primary-500"
                    />
                    <p className="text-gray-600 font-medium mt-4">
                    This is where your notifications will appear.
                    </p>
                </div>
            )
            : 
            (<div className="space-y-4 mt-6">
                {notificationsMsgs?.map((notification) => (
                    <MenuItem key={notification?.id}>
                        <Link
                            href={`${route}?id=${notification.id}`}
                            className="flex items-start border-b border-gray-200  mt-3 cursor-pointer"
                        >
                            <div className='flex gap-3 px-5'>
                                <div>
                                    <div className="p-1 bg-blue-100 text-blue-600 rounded-full">
                                        <IoMdNotificationsOutline
                                            className="w-6 h-6 cursor-pointer"
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
                                <div className="space-y-1 mb-2">
                                    <p 
                                    className={cn(notification.readAt ? "text-black/50 font-normal" : "text-[#101828]" , "font-medium text-sm leading-6")}>{
                                    notification?.data?.subject}
                                    </p>
                                    <p className="text-sm text-gray-400">{notification?.createdAt}</p>
                                </div>
                            </div>
                        </Link>
                    </MenuItem>
                ))}
                </div>
            )}
        </div>
    </MenuItems>
  )
}

export default NotificationModal