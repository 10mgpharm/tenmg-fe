import React, { useState, useCallback, useEffect } from "react";
import { Badge, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { PiCaretLeftBold } from "react-icons/pi";
import { LoanRequest, NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import { getStatusColorScheme } from "@/utils";
import { formatAmount } from "@/utils/formatAmount";
import { formatAmountString } from "@/utils";
import Loader from "@/app/(protected)/admin/_components/Loader";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

export interface LoanApplicationViewProps {
  id: string;
  sessionToken: string;
  userRole: "lender" | "admin" | "vendor";
  backUrl: string;
  onRefresh?: () => void;
}

export default function LoanApplicationView({
  id,
  sessionToken,
  userRole,
  backUrl,
  onRefresh,
}: LoanApplicationViewProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loanData, setLoanData] = useState<LoanRequest | null>(null);

  const getEndpoint = useCallback(() => {
    switch (userRole) {
      case "lender":
        return `/lender/loan-applications/view/${id}`;
      case "admin":
        return `/admin/loan-application/${id}`;
      case "vendor":
        return `/vendor/loan-applications/view/${id}`;
      default:
        return "";
    }
  }, [userRole, id]);

  const fetchLoanDetails = useCallback(async () => {
    if (!sessionToken) return;

    setIsLoading(true);
    try {
      const response = await requestClient({ token: sessionToken }).get(
        getEndpoint()
      );
      if (response.status === 200) {
        setLoanData(response.data.data);
      }
    } catch (error: any) {
      toast.error("Error: " + handleServerErrorMessage(error));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionToken, getEndpoint]);

  useEffect(() => {
    fetchLoanDetails();
  }, [fetchLoanDetails]);

  // Handle approve/decline actions for lenders
  const handleAction = useCallback(
    async (action: "approve" | "decline") => {
      if (!sessionToken) return;

      try {
        const response = await requestClient({ token: sessionToken }).post(
          "/lender/loan-applications",
          { applicationId: id, action }
        );

        if (response.status === 200) {
          toast.success(
            `Loan application ${action === "approve" ? "approved" : "declined"
            } successfully`
          );
          if (action === "decline") {
            router.back();
          }
          fetchLoanDetails();
          if (onRefresh) onRefresh();
        } else {
          toast.error(
            `Error ${action === "approve" ? "approving" : "declining"
            } loan application`
          );
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
          `Error ${action === "approve" ? "approving" : "declining"
          } loan application`
        );
        console.error(error);
      }
    },
    [sessionToken, id, fetchLoanDetails, onRefresh, router]
  );

  const creditScoreValue =
    loanData?.customer?.score ||
    loanData?.customer?.lastEvaluationHistory?.creditScore?.scoreValue ||
    0;

  const creditScoreTotal =
    loanData?.customer?.scoreTotal ||
    loanData?.customer?.lastEvaluationHistory?.creditScore?.scoreTotal ||
    0;

  const performingStatus =
    loanData?.customer?.lastEvaluationHistory?.status || "INITIATED";

  const category =
    loanData?.customer?.category ||
    loanData?.customer?.lastEvaluationHistory?.creditScore?.category ||
    "N/A";

  let parsedEvaluationResult = null;

  const evaluationResult =
    loanData?.customer?.lastEvaluationHistory?.evaluationResult;
  try {
    if (evaluationResult && typeof evaluationResult === "string") {
      parsedEvaluationResult = JSON.parse(evaluationResult);
    } else if (evaluationResult && typeof evaluationResult === "object") {
      parsedEvaluationResult = evaluationResult;
    }
  } catch (error) {
    console.error("Error parsing evaluation result:", error);
  }

  const getEvaluationPath = () => {
    const evaluationId = loanData?.customer?.lastEvaluationHistory?.id;
    if (!evaluationId) return "";

    switch (userRole) {
      case "lender":
        return `/lenders/loan-application/evaluation/${evaluationId}?evaluationId=${evaluationId}`;
      case "admin":
        return `/admin/loan-application/evaluation/${evaluationId}?evaluationId=${evaluationId}`;
      case "vendor":
        return `/vendors/loan-applications/evaluation/${evaluationId}?evaluationId=${evaluationId}`;
      default:
        return "";
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!loanData) {
    return <div className="p-8">No loan data found</div>;
  }

  return (
    <div className={userRole === "lender" ? "mx-10 my-4" : "p-8"}>
      <Button
        leftIcon={<PiCaretLeftBold />}
        colorScheme="primary"
        variant="unstyled"
        onClick={() => router.push(backUrl)}
      >
        Back
      </Button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-4">
        <div>
          <h4 className="font-semibold">Application Details</h4>
          <p className="text-sm">
            Overview of borrower&apos;s loan details, including their evaluation
            reference and credit score.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            colorScheme="primary"
            variant="outline"
            onClick={() => router.push(getEvaluationPath())}
          >
            View Credit Score
          </Button>

          {userRole === "lender" &&
            loanData?.status !== "APPROVED" &&
            loanData?.status !== "EXPIRED" && (
              <>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleAction("decline")}
                >
                  Decline Offer
                </Button>
                <Button
                  size="sm"
                  colorScheme="success"
                  onClick={() => handleAction("approve")}
                >
                  Accept Offer
                </Button>
              </>
            )}
        </div>
      </div>

      <div className="w-full rounded-t-xl overflow-hidden my-5">
        <div className="bg-[#D1E9FF] px-5 py-3">
          <h4 className="font-semibold">Customer Information</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-5 py-3 bg-white">
          <div className="space-y-2">
            <p className="text-sm">Borrower&apos;s Name</p>
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
            <p className="text-sm">Application ID</p>
            <h4 className="font-semibold text-sm">
              {loanData?.identifier || "N/A"}
            </h4>
          </div>
          {userRole === "admin" && (
            <div className="space-y-2">
              <p className="text-sm">Vendor Information</p>
              <h4 className="font-semibold text-sm">
                {loanData?.business?.name || "N/A"}
              </h4>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm">Status</p>
            <Badge
              colorScheme={getStatusColorScheme(loanData?.status)}
              fontSize="10px"
              px="2"
              py="1"
              borderRadius="xl"
              variant="solid"
            >
              {loanData?.status || "N/A"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
        <div className="rounded-t-xl overflow-hidden">
          <div className="bg-primary px-5 py-3">
            <h4 className="font-semibold text-white">Loan Request Details</h4>
          </div>
          <div className="gap-4 px-5 py-3 bg-white space-y-3">
            <div className="space-y-0.5 my-2">
              <p className="text-sm font-thin">Loan Amount</p>
              <h4 className="font-semibold text-sm">
                {userRole === "vendor" ? "₦" : ""}
                {loanData?.requestedAmount
                  ? userRole === "vendor"
                    ? formatAmountString(loanData?.requestedAmount)
                    : formatAmount(loanData?.requestedAmount)
                  : "0"}
              </h4>
            </div>
            <div className="space-y-0.5 my-2">
              <p className="text-sm font-thin">Tenure</p>
              <h4 className="font-semibold text-sm">
                {loanData?.durationInMonths || "N/A"} Months
              </h4>
            </div>
            <div className="space-y-0.5 my-2">
              <p className="text-sm font-thin">Instalment Amount:</p>
              <h4 className="font-semibold text-sm">
                ₦
                {loanData?.interestAmount
                  ? formatAmountString(loanData?.interestAmount)
                  : "0"}{" "}
                monthly
              </h4>
            </div>
            <div className="space-y-0.5 my-2">
              <p className="text-sm font-thin">Interest Applied:</p>
              <h4 className="font-semibold text-sm">
                ₦
                {loanData?.interestRate
                  ? formatAmountString(loanData?.interestRate)
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
              <p className="text-sm font-thin">Total Transaction Volume</p>
              <h4 className="font-semibold text-sm">
                {parsedEvaluationResult ? (
                  <>
                    ₦
                    {formatAmountString(
                      parsedEvaluationResult?.purchasePattern
                        ?.totalTransactionVolume
                    )}
                  </>
                ) : (
                  "N0"
                )}
              </h4>
            </div>
            <div className="space-y-0.5 my-2">
              <p className="text-sm font-thin">Average Transaction Amount:</p>
              <h4 className="font-semibold text-sm">
                {parsedEvaluationResult ? (
                  <>
                    ₦
                    {formatAmountString(
                      parsedEvaluationResult?.purchasePattern
                        ?.averageTransactionVolume
                    )}
                  </>
                ) : (
                  "₦0"
                )}
              </h4>
            </div>
            <div className="space-y-0.5 my-2">
              <p className="text-sm font-thin">Performance Status:</p>
              <h4 className="font-semibold text-sm">{performingStatus}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
