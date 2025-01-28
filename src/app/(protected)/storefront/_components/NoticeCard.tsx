'use client';

import { BusinessStatus } from "@/constants";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Button, Box, Text, IconButton } from '@chakra-ui/react'
import { FiX } from 'react-icons/fi'

type NoticeInfo = {
    title: string;
    action: string;
}

const noticeInfos: Record<string, NoticeInfo> = {
    PENDING_VERIFICATION: {
      title: "Complete Your Verification to Unlock Full Access",
      action: "Click here to Proceed",
    },
    PENDING_APPROVAL: {
      title: "Your business has not been approved yet. Please check back later.",
      action: "Check Approval Status",
    },
    LICENSE_EXPIRED: {
      title: "Action Required: License Expired. Your license has expired.",
      action: "Update Your License",
    },
    REJECTED: {
      title: "Action Required: Request Rejected. Your request has been rejected.",
      action: "Upload New License",
    },
  };

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
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [noticeInfo, setNoticeInfo] = useState<NoticeInfo>(null);

  useEffect(() => {
    if (status) {
      setNoticeInfo(noticeInfos[status]);
    }
  }, [status]);

  return (
    <div>
        {isBannerVisible && (
          <Box
            bg="red.500"
            color="white"
            py={4}
            px={6}
            position="relative"
            textAlign="center"
          >
            <Text
              fontSize={{ base: "sm", md: "md" }}
              maxW="700px"
              mx="auto"
              fontWeight={500}
            >
              {noticeInfo?.title}{" "}
              <Button
                variant="link"
                color="white"
                onClick={() =>
                    status === BusinessStatus.PENDING_VERIFICATION
                    ? setOpen()
                    : router.push("/storefront/settings/license-upload")
                }
                textDecoration="underline"
                fontWeight={500}
              >
                {noticeInfo?.action}
              </Button>
            </Text>

            <IconButton
              size="sm"
              aria-label="Close banner"
              icon={<FiX />}
              onClick={() => setIsBannerVisible(false)}
              variant="ghost"
              color="white"
              _hover={{ bg: "red.700" }}
              position="absolute"
              right="4"
              top="50%"
              transform="translateY(-50%)"
            />
          </Box>
        )}
    </div>
  )
}

export default NoticeCard