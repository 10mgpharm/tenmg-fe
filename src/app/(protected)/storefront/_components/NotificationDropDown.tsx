import { cn } from "@/lib/utils";
import { Flex, MenuItem, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { IoIosNotifications, IoMdNotificationsOutline } from "react-icons/io";

const NotificationDropDown = ({
  loading,
  notifications,
}: {
  loading: boolean;
  notifications: any[];
}) => {
  const router = useRouter();

  return (
    <div className="w-full">
      <div>
        <div className="flex items-center justify-between px-5">
          <p className="font-bold text-lg">Notifications</p>
          <div
            onClick={() => router.push("/storefront/notifications")}
            className="text-sm font-semibold cursor-pointer text-primary-600"
          >
            View All
          </div>
        </div>
        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : notifications?.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-24 text-center">
            <IoIosNotifications className="w-32 h-32 text-primary-500" />
            <p className="text-gray-600 font-medium mt-4">
              This is where your notifications will appear.
            </p>
          </div>
        ) : (
          <div className="mt-6">
            {notifications?.map((notification) => (
              <MenuItem
                key={notification?.id}
                display={"block"}
                _hover={{ bg: "none" }}
              >
                <Link
                  href={`/storefront/notifications?id=${notification.id}`}
                  className="flex border-b border-gray-200 cursor-pointer pb-2"
                >
                  <div className="flex gap-3">
                    <div>
                      <div className="p-1 bg-blue-100 text-blue-600 rounded-full">
                        <IoMdNotificationsOutline className="w-6 h-6 cursor-pointer" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p
                        className={cn(
                          notification.readAt
                            ? "text-black/50 font-normal"
                            : "text-[#101828]",
                          "font-medium text-sm leading-6"
                        )}
                      >
                        {notification?.data?.subject}
                      </p>
                      <p className="text-sm text-gray-400">
                        {notification?.createdAt}
                      </p>
                    </div>
                  </div>
                </Link>
              </MenuItem>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropDown;
