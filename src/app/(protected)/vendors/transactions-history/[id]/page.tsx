"use client";
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import TransactionSummary from "../_components/TransactionSummary";
import Records from "../_components/Records";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession, TransactionHistoryData } from "@/types";
import BreakdownRecords from "../_components/BreakdownRecord";

const SingleTransactionPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const session = useSession();

  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const sessionData = session?.data as NextAuthUserSession;
  const [tnxHistoryData, setTnxHistorysData] = useState<
    TransactionHistoryData[] | null
  >(null);
  const token = sessionData?.user?.token;

  const fetchCustomerTnx = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        `vendor/txn_history/creditscore-breakdown/${params.id}`
      );
      if (response.status === 200) {
        setTnxHistorysData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, params.id]);

  const downloadCustomerTnx = useCallback(async () => {
    setIsDownloading(true);
    try {
      const response = await requestClient({ token: token }).post(
        `vendor/txn_history/download/${params.id}`
      );

      if (response.status === 200) {
        const data = response.data;
        if (!data) {
          throw new Error("No file data found");
        }

        const uint8Array = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
          uint8Array[i] = data.charCodeAt(i);
        }

        const blob = new Blob([uint8Array], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Trigger download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "transactions.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setIsDownloading(false);
    } catch (error) {
      console.error(error);
      setIsDownloading(false);
    }
  }, [token, params.id]);

  useEffect(() => {
    if (!token) return;
    // fetchCustomers();
    fetchCustomerTnx();
  }, [fetchCustomerTnx, token]);

  return (
    <div className="p-8">
      <HStack justifyContent={"space-between"}>
        <Flex
          cursor={"pointer"}
          onClick={() => router.back()}
          align={"center"}
          gap={2}
        >
          <ArrowLeft className="w-5 h-auto text-gray-500" />
          <Text fontSize={"14px"} color={"gray.600"}>
            Back
          </Text>
        </Flex>
        <Flex gap={2} align={"center"}>
          <Button
            variant={"outline"}
            h={"34px"}
            onClick={downloadCustomerTnx}
            isDisabled={isDownloading}
            isLoading={isDownloading}
            loadingText="Downloading..."
          >
            Download Transaction History
          </Button>
          <Link
            href={`/vendors/transactions-history/${params.id}/records`}
            className="bg-primary-600 text-white px-4 py-2 text-sm font-medium rounded-md"
          >
            View Uploaded Transaction History
          </Link>
        </Flex>
      </HStack>
      <Box mt={4}>
        <div className="">
          <h3 className="font-semibold text-xl">Customer Reference No. </h3>
          <p className="text-sm text-gray-500 mt-1">
            This provides a detailed breakdown of the customer’s evaluation
            reference, credit score, purchase and credit patterns.
          </p>
        </div>
      </Box>
      <div className="grid grid-cols-6 gap-5 mt-5">
        <div className="col-span-2">
          <div className="space-y-7">
            <div className="border rounded-md">
              <div className="border-t-md p-4 bg-gray-100">
                <p className="font-medium">Customer Information</p>
              </div>
              <div className="space-y-3 p-4">
                <div className="">
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-700">
                    Samule Ajayi
                  </p>
                </div>
                <div className="">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-700">
                    sunday.ajayi@lendsqr.com
                  </p>
                </div>
                <div className="">
                  <p className="text-sm text-gray-500">Evaluation ID</p>
                  <p className="text-sm font-medium text-gray-700">
                    EVAL-44S-333
                  </p>
                </div>
                <div className="">
                  <p className="text-sm text-gray-500">Customer ID</p>
                  <p className="text-sm font-medium text-gray-700">
                    Samule Ajayi
                  </p>
                </div>
                <div className="">
                  <p className="text-sm text-gray-500">Vendor</p>
                  <p className="text-sm font-medium text-gray-700">
                    Samule Ajayi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4 space-y-5">
          <div className="flex gap-5">
            <div className="flex-1 space-y-2.5">
              <div className="border rounded-md p-6">
                <div className="space-y-2">
                  <p className="text-gray-500">Average Transaction Volume</p>
                  <h2 className="text-2xl font-semibold">₦161,060</h2>
                </div>
              </div>
              <div className="border rounded-md p-6">
                <div className="space-y-2">
                  <p className="text-gray-500">Total Transactions Volume</p>
                  <h2 className="text-2xl font-semibold">₦161,060</h2>
                </div>
              </div>
              <div className="border rounded-md p-6">
                <div className="space-y-2">
                  <p className="text-gray-500">
                    Total Months in Transaction History
                  </p>
                  <h2 className="text-2xl font-semibold">6 Months</h2>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              <div className="border flex items-center gap-5 p-5 rounded-md">
                <div className="space-y-3 w-1/3">
                  <h3 className="font-semibold">Credit Score</h3>
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-500">Score Category</p>
                    <p className="text-xl font-semibold text-gray-800">
                      Category A
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-500">Score Value</p>
                    <p className="text-xl font-semibold text-gray-800">
                      855/950
                    </p>
                  </div>
                </div>
                <div style={{ width: 140, height: 140 }}>
                  <CircularProgressbar
                    value={70}
                    text={`${70}%`}
                    strokeWidth={12}
                    styles={buildStyles({
                      pathColor: "#E86C60",
                      textColor: "#E86C60",
                      trailColor: "#EFD358",
                    })}
                  />
                </div>
              </div>
              <div className="border rounded-md p-5">
                <h3 className="font-semibold mb-3">Affordability Amount</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Min Amount</p>
                    <h3 className="text-lg font-semibold text-gray-700">
                      ₦16,060,230
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Max Amount</p>
                    <h3 className="text-lg font-semibold text-gray-700">
                      ₦160,060,000
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-6">
          <TransactionSummary />
        </div>
        <div className="col-span-2">
          <div className="p-4 border rounded-md">
            <h4 className="font-medium mb-2">Result Breakdown</h4>
            <p className="text-gray-500 mb-4 text-sm">
              This outlines the breakdown of how the user score was computed
            </p>
            <button
              onClick={onOpen}
              className="border-primary-600 border text-primary-500 font-medium bg-transparent p-2 w-full rounded-md mb-5"
            >
              View Breakdown
            </button>
          </div>
        </div>
        <div className="col-span-4">
          <Records />
          <BreakdownRecords isOpen={isOpen} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default SingleTransactionPage;
