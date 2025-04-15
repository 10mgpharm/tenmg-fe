"use client";
import { Badge, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition, useEffect, useCallback } from "react";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { BiCaretLeft } from "react-icons/bi";
import { PiCaretLeftBold } from "react-icons/pi";
import { ApplicationDto, LoanRequest, NextAuthUserSession } from "@/types";
import { toast } from "react-toastify";
import { getStatusColorScheme, handleServerErrorMessage } from "@/utils";
import { formatAmount } from "@/utils/formatAmount";
import Loader from "@/app/(protected)/admin/_components/Loader";

// TODO: Make this page a reusable component
export default function LoanViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [loanData, setLoanData] = useState<LoanRequest | null>(null);
  const [isPending, startTransition] = useTransition();
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const sessionToken = sessionData?.user?.token;

  const fetchLoanDetails = useCallback(() => {
    startTransition(async () => {
      try {
        const response = await requestClient({ token: sessionToken }).get(
          `/lender/loan-applications/view/${params.id}`
        );
        if (response.status === 200) {
          setLoanData(response.data.data);
        }
      } catch (error: any) {
        toast.error("Error: ", handleServerErrorMessage(error));
        console.error(error);
      }
    });
  }, [sessionToken, params.id]);

  useEffect(() => {
    if (!sessionToken) return;
    fetchLoanDetails();
  }, [fetchLoanDetails, sessionToken]);

  const creditScoreValue =
    loanData?.customer?.score || 0;
  const creditScoreTotal =
    loanData?.customer?.scoreTotal || 0;

  const performingStatus =
    loanData?.customer?.lastEvaluationHistory?.status || "INITIATED";

  const category =
    loanData?.customer?.category || "N/A";

  const creditScoreResult =
    loanData?.customer?.lastEvaluationHistory &&
    loanData?.customer?.lastEvaluationHistory?.evaluationResult;

  const handleAccept = useCallback(
    async (id: string) => {
      if (!sessionToken) return;

      try {
        const response = await requestClient({ token: sessionToken }).post(
          "/lender/loan-applications",
          { applicationId: id, action: "approve" }
        );

        if (response.status === 200) {
          toast.success("Loan application approved successfully");
          fetchLoanDetails();
        } else {
          toast.error("Error approving loan application");
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Error approving loan application"
        );
        console.error(error);
      }
    },
    [sessionToken, fetchLoanDetails]
  );

  const handleIgnore = useCallback(
    async (id: string) => {
      if (!sessionToken) return;

      try {
        const response = await requestClient({ token: sessionToken }).post(
          "/lender/loan-applications",
          { applicationId: id, action: "decline" }
        );

        if (response.status === 200) {
          toast.success("Loan application declined successfully");
          fetchLoanDetails();
        } else {
          toast.error("Error declining loan application");
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Error declining loan application"
        );
        console.error(error);
      }
    },
    [sessionToken, fetchLoanDetails]
  );

  return (
    <div className="mx-10 my-4">
      {isPending && <Loader />}

      {!isPending && loanData && (
        <>
          <Button
            leftIcon={<PiCaretLeftBold />}
            colorScheme="primary"
            variant="unstyled"
            onClick={() => {
              router.push("/lenders/loan-application");
            }}
          >
            Back
          </Button>
          <>
            <div className="flex items-center justify-between w-full gap-4">
              <div>
                <h4 className="font-semibold">Application Details</h4>
                <p className="text-sm">
                  Overview of borrower’s loan details, including their
                  evaluation reference and credit score.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {loanData?.status === "APPROVED" ||
                loanData?.status === "EXPIRED" ? (
                  <Button
                    size="sm"
                    colorScheme={"primary"}
                    variant={"outline"}
                    onClick={() => {
                      router.push(
                        `/lenders/loan-application/evaluation/${loanData?.customer?.lastEvaluationHistory?.id}?evaluationId=${loanData?.customer?.lastEvaluationHistory?.id}`
                      );
                    }}
                  >
                    View Credit Score
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      colorScheme={"red"}
                      onClick={() => handleIgnore(params.id)}
                    >
                      Decline Offer
                    </Button>
                    <Button
                      size="sm"
                      colorScheme={"success"}
                      onClick={() => handleAccept(params.id)}
                    >
                      Accept Offer
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="w-full rounded-t-xl overflow-hidden my-5">
              <div className="bg-[#D1E9FF] px-5 py-3 ">
                <h4 className="font-semibold">Customer Information</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-5 py-3 bg-white">
                <div className="space-y-2">
                  <p className="text-sm">Borrower’s Name</p>
                  <h4 className="font-semibold text-sm">
                    {loanData?.customer?.name || "N/A"}
                  </h4>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">Email Address</p>
                  <h4 className="font-semibold text-sm">
                    {loanData?.customer?.email || "N/A"}
                  </h4>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">Reference ID</p>
                  <h4 className="font-semibold text-sm">
                    {loanData?.customer?.reference || "N/A"}
                  </h4>
                </div>
                {/* <div className="space-y-2">
                  <p className="text-sm">Vendor Information</p>
                  <h4 className="font-semibold text-sm">
                    {loanData?.business?.name || "N/A"}
                  </h4>
                </div> */}
                <div className="space-y-2">
                  <p className="text-sm">Status</p>
                  <Badge
                    colorScheme={getStatusColorScheme(loanData?.status)}
                    fontSize="10px"
                    px="2"
                    py="1"
                    borderRadius="xl"
                    variant={"solid"}
                  >
                    {loanData?.status || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>
          </>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
            <div className="rounded-t-xl overflow-hidden">
              <div className="bg-primary px-5 py-3 ">
                <h4 className="font-semibold text-white">
                  Loan Request Details
                </h4>
              </div>
              <div className="gap-4 px-5 py-3 bg-white space-y-3">
                <div className="space-y-0.5 my-2">
                  <p className="text-sm font-thin ">Loan Amount</p>
                  <h4 className="font-semibold text-sm">
                    {loanData?.requestedAmount
                      ? formatAmount(loanData?.requestedAmount)
                      : "0"}
                  </h4>
                </div>
                <div className="space-y-0.5 my-2">
                  <p className="text-sm font-thin ">Tenure</p>
                  <h4 className="font-semibold text-sm">
                    {loanData?.durationInMonths || "N/A"} Months
                  </h4>
                </div>
                <div className="space-y-0.5 my-2">
                  <p className="text-sm font-thin ">Instalment Amount:</p>
                  <h4 className="font-semibold text-sm">
                    {loanData?.interestAmount
                      ? formatAmount(loanData?.interestAmount)
                      : "0"}{" "}
                    monthly
                  </h4>
                </div>
                <div className="space-y-0.5 my-2">
                  <p className="text-sm font-thin ">Interest Applied:</p>
                  <h4 className="font-semibold text-sm">
                    {loanData?.interestRate
                      ? formatAmount(loanData?.interestRate)
                      : "0"}
                    %
                  </h4>
                </div>
              </div>
            </div>

            <div className="rounded-t-xl overflow-hidden">
              <div className="bg-primary px-5 py-3 flex items-center justify-between">
                <h4 className="font-semibold text-white">Credit Score</h4>
              </div>
              <div className="gap-4 px-5 py-3 bg-white space-y-3">
                <div className="space-y-0.5 my-2">
                  <p className="text-sm font-thin">Credit Score</p>
                  <h4 className="font-semibold text-sm">
                    {creditScoreValue}/{creditScoreTotal} (Category {category})
                  </h4>
                </div>
                <div className="space-y-0.5 my-2">
                  <p className="text-sm font-thin">Total Transaction Volume </p>
                  <h4 className="font-semibold text-sm">N500,000,000.00</h4>
                </div>
                <div className="space-y-0.5 my-2">
                  <p className="text-sm font-thin">
                    Average Transaction Amount:
                  </p>
                  <h4 className="font-semibold text-sm">N450,000.00</h4>
                </div>
                <div className="space-y-0.5 my-2">
                  <p className="text-sm font-thin">Performance Status:</p>
                  <h4 className="font-semibold text-sm">{performingStatus}</h4>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
