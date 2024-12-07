'use client';

import { BusinessStatus } from "@/constants";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type NoticeInfo = {
  title: string;
  description: string;
  action: string;
}

const noticeInfos: Record<string, NoticeInfo> = {
  PENDING_VERIFICATION: {
    title: "Complete your account setup to access all features",
    description: "Let's get you set up!",
    action: "Complete Account Setup",
  },
  PENDING_APPROVAL: {
    title: "Check Business Approval Status",
    description: "Your business has not been approved yet. Please check back later.",
    action: "Check Approval Status",
  },
  LICENSE_EXPIRED: {
    title: "Action Required: License Expired",
    description: "Your license has expired. Please update your business license to continue using the service.",
    action: "Update Your License",
  },
  REJECTED: {
    title: "Action Required: Request Rejected",
    description: "Your request has been rejected. Please update your business license to continue using the service.",
    action: "Upload New License",
  },
}

const NoticeCard = ({
  setOpen,
  status,
  url,
}: {
  setOpen: () => void;
  url: string;
  status?: string;
}) => {
  const router = useRouter();
  const [noticeInfo, setNoticeInfo] = useState<NoticeInfo>(null);

  useEffect(() => {
    if (status) {
      setNoticeInfo(noticeInfos[status]);
    }
  }, [status]);

  return (
    <div className="rounded-lg p-5 bg-[#082552]">
      <h2 className="text-3xl font-semibold text-white">
        {noticeInfo?.title}
      </h2>
      <p className="font-normal text-lg mb-16 mt-2 text-white">
        {noticeInfo?.description}
      </p>
      <div className="mb-5">
        <button
          onClick={() =>
            status === BusinessStatus.PENDING_VERIFICATION ? setOpen() :
              router.push(url)
          }
          className="bg-primary-400 text-white p-4 rounded-lg z-0"
        >
          {noticeInfo?.action}
        </button>
      </div>
    </div>
  );
};

export default NoticeCard;