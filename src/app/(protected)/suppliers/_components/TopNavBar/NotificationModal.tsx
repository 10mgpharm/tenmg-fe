import { IoIosNotifications } from "react-icons/io";
import { LuBox } from "react-icons/lu";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import Link from 'next/link';

export interface NotificationProps {
    id: string;
    readAt: string | null;
    createdAt: string;
    data: {
        message: string;
    } 
}
const NotificationModal = (
    { notificationsMsgs, route }: 
    { notificationsMsgs: NotificationProps[], route: string}
) => {
  return (
    <div>
        <div className="flex items-center justify-between px-5">
            <p className='font-bold text-lg'>Notifications</p>
            <Link
                href={route}
                className='text-sm font-semibold cursor-pointer text-primary-600'
            >
                View all
            </Link>
        </div>
        {notificationsMsgs?.length === 0 ? (
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
                <Link
                    href={route}
                    key={notification?.id}
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
                            <p className="font-medium text-sm leading-6 text-[#101828]">{notification?.data?.message}</p>
                            <p className="text-sm text-gray-400">{notification?.createdAt}</p>
                        </div>
                    </div>
                  </Link>
              ))}
            </div>
        )}
    </div>
  )
}

export default NotificationModal