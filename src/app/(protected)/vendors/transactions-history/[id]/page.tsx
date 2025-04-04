"use client";
import {
  Box,
  Button,
  Flex,
  HStack,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import TransactionSummary from "../_components/TransactionSummary";
import Records from "../_components/Records";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession, SingleTransactionData } from "@/types";
import BreakdownRecords from "../_components/BreakdownRecord";
import { formatAmountString, handleServerErrorMessage } from "@/utils";
import { downloadCsv } from "@/utils/downloadTemplate";
import { toast } from "react-toastify";

const SingleTransactionPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const session = useSession();
  const searchParams = useSearchParams();

  const evaluationId = searchParams.get('evaluationId');
  const [isDownloading, setIsDownloading] = useState(false);

  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const sessionData = session?.data as NextAuthUserSession;
  const [tnxHistoryData, setTnxHistorysData] =
    useState<SingleTransactionData | null>(null);
  const token = sessionData?.user?.token;

  const fetchCustomerTnx = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        `vendor/txn_history/creditscore-breakdown/${evaluationId}`
      );
      if (response.status === 200) {
        setTnxHistorysData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, evaluationId]);

  const downloadCustomerTnx = useCallback(async () => {
    setIsDownloading(true);
    try {
      const response = await requestClient({ token: token }).post(
        `vendor/txn_history/download/${params.id}`
      );

      if (response.status === 200) {
        const data = response.data;
        if (!data) {
          toast.error("No file data found");
        }
        downloadCsv(data, "transactions.csv");
      }
      setIsDownloading(false);
    } catch (error) {
      toast.error(handleServerErrorMessage(error));
      setIsDownloading(false);
    }
  }, [token, params.id]);

  useEffect(() => {
    if (!token) return;
    fetchCustomerTnx();
  }, [fetchCustomerTnx, token]);

  return (
    <div className="p-8">
      {loading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      ) : 
      tnxHistoryData === null ?
      <div className="">
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
        <p className="mt-16 text-center font-semibold text-2xl text-gray-400">No evaluation result</p>
      </div>
      :(
        <Box>
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
          <Flex
            justify={"space-between"}
            align={"center"}
            mt={4}
            flexWrap="wrap"
            gap={2}
          >
            <Box maxW="lg">
              <h3 className="font-semibold text-xl">
                Reference No: {tnxHistoryData?.identifier}{" "}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                This provides a detailed breakdown of the customer’s evaluation
                reference, credit score, purchase and credit patterns.
              </p>
            </Box>
            <Flex
              gap={2}
              align={"center"}
              flexDir={{ base: "column", md: "row" }}
              w={{ base: "full", md: "auto" }}
            >
              <Button
                variant={"outline"}
                height={"34px"}
                width={{ base: "100%", md: "auto" }}
                onClick={downloadCustomerTnx}
                isLoading={isDownloading}
                isDisabled={isDownloading}
              >
                Download Transaction
              </Button>
              <Button
                as={Link}
                href={`/vendors/transactions-history/${params.id}/records`}
                bg="primary.600"
                color="white"
                height="34px"
                width={{ base: "100%", md: "auto" }}
                _hover={{ bg: "primary.700" }}
              >
                View Transaction History
              </Button>
            </Flex>
          </Flex>
          <div className="grid grid-cols-6 gap-5 mt-5">
            <div className="col-span-2">
              <div className="space-y-7">
                <div className="border rounded-md">
                  <div className="border-t-md p-4 bg-gray-100">
                    <p className="font-medium">Customer Information</p>
                  </div>
                  <div className="space-y-3 p-4 pb-10">
                    <div className="">
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-sm font-medium text-gray-700">
                        {tnxHistoryData?.customer.name}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-700">
                        {tnxHistoryData?.customer?.email}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-sm text-gray-500">Evaluation ID</p>
                      <p className="text-sm font-medium text-gray-700">
                        {tnxHistoryData?.identifier}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-sm text-gray-500">Customer ID</p>
                      <p className="text-sm font-medium text-gray-700">
                        {tnxHistoryData?.customer?.identifier}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-sm text-gray-500">Vendor</p>
                      <p className="text-sm font-medium text-gray-700">
                        {tnxHistoryData?.vendor?.name}
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
                      <p className="text-gray-500">
                        Average Transaction Volume
                      </p>
                      <h2 className="text-2xl font-semibold">
                        ₦
                        {formatAmountString(
                          tnxHistoryData?.evaluation?.purchasePattern
                            ?.averageTransactionVolume
                        )}
                      </h2>
                    </div>
                  </div>
                  <div className="border rounded-md p-6">
                    <div className="space-y-2">
                      <p className="text-gray-500">Total Transactions Volume</p>
                      <h2 className="text-2xl font-semibold">
                        ₦
                        {formatAmountString(
                          tnxHistoryData?.evaluation?.purchasePattern
                            ?.totalTransactionVolume
                        )}
                      </h2>
                    </div>
                  </div>
                  <div className="border rounded-md p-6">
                    <div className="space-y-2">
                      <p className="text-gray-500">
                        Total Months in Transaction History
                      </p>
                      <h2 className="text-2xl font-semibold">
                        {`${tnxHistoryData?.evaluation?.purchasePattern?.noOfTransactingMonths} Months`}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-2.5">
                  <div className="border flex items-center gap-5 py-8 px-6 rounded-md">
                    <div className="space-y-3 w-1/3">
                      <h3 className="font-semibold">Credit Score</h3>
                      <div className="space-y-1.5">
                        <p className="text-sm text-gray-500">Score Category</p>
                        <p className="text-xl font-semibold text-gray-800">
                          {tnxHistoryData?.affordability?.category ?? "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm text-gray-500">Score Value</p>
                        <p className="text-xl font-semibold text-gray-800">
                          {`${tnxHistoryData?.creditScoreResult?.scoreValue}/${tnxHistoryData?.creditScoreResult?.scoreTotal}`}
                        </p>
                      </div>
                    </div>
                    <div style={{ width: 140, height: 140 }}>
                      <CircularProgressbar
                        value={Math.round(
                          tnxHistoryData?.creditScoreResult?.scorePercent
                        )}
                        text={
                          `${Math.round(
                            tnxHistoryData?.creditScoreResult?.scorePercent
                          )}%` || "0%"
                        }
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
                          ₦
                          {formatAmountString(
                            tnxHistoryData?.affordability?.baseAmount
                          )}
                        </h3>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Max Amount</p>
                        <h3 className="text-lg font-semibold text-gray-700">
                          ₦
                          {formatAmountString(
                            tnxHistoryData?.affordability?.maxAmount
                          )}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-6">
              {tnxHistoryData && (
                <TransactionSummary tnxHistoryData={tnxHistoryData} />
              )}
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
              <Records tnxHistoryData={tnxHistoryData} />
              <BreakdownRecords
                isOpen={isOpen}
                onClose={onClose}
                tnxHistoryData={tnxHistoryData}
              />
            </div>
          </div>
        </Box>
      )}
    </div>
  );
};

export default SingleTransactionPage;
