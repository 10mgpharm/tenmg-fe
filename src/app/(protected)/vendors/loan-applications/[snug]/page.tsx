"use client";
import {
  Divider,
  Flex,
  Stack,
  Text,
  extendTheme,
  SimpleGrid,
  useDisclosure,
  Button,
  Badge,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { LoanRequest, NextAuthUserSession } from "@/types";
import Loader from "@/app/(protected)/admin/_components/Loader";
import { PiCaretLeftBold } from "react-icons/pi";
import { getStatusColorScheme } from "@/utils";
import { formatAmount } from "@/utils/formatAmount";

const Page = ({ params }: { params: { snug: string } }) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loanData, setLoanData] = useState<LoanRequest | null>(null);

  const fetchLoanApplicationById = useCallback(
    async (id: string) => {
      setIsLoading(true);

      try {
        const response = await requestClient({ token: token }).get(
          `/vendor/loan-applications/view/${id}`
        );
        setLoanData(response.data.data);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    },
    [token]
  );

  useEffect(() => {
    if (!token) return;
    fetchLoanApplicationById(params.snug);
  }, [fetchLoanApplicationById, params.snug, token]);

  console.log(loanData);

  const creditScoreValue =
    loanData?.customer?.lastEvaluationHistory?.creditScore?.scoreValue || 0;
  const creditScoreTotal =
    loanData?.customer?.lastEvaluationHistory?.creditScore?.scoreTotal || 0;

  const performingStatus =
    loanData?.customer?.lastEvaluationHistory?.status || "INITIATED";

  const category =
    loanData?.customer?.lastEvaluationHistory?.creditScore?.category || "N/A";

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-8">
      <Button
        leftIcon={<PiCaretLeftBold />}
        colorScheme="primary"
        variant="unstyled"
        onClick={() => {
          router.push("/vendors/loan-applications");
        }}
      >
        Back
      </Button>

      <div className="flex items-center justify-between w-full gap-4">
        <div>
          <h4 className="font-semibold">Application Details</h4>
          <p className="text-sm">
            Overview of borrower’s loan details, including their evaluation
            reference and credit score.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            colorScheme={"primary"}
            variant={"outline"}
            onClick={() => {
              router.push(
                `/vendors/loan-applications/evaluation/${loanData?.customer?.lastEvaluationHistory?.id}?evaluationId=${loanData?.customer?.lastEvaluationHistory?.id}`
              );
            }}
          >
            View Credit Score
          </Button>
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
          <div className="space-y-2">
            <p className="text-sm">Vendor Information</p>
            <h4 className="font-semibold text-sm">
              {loanData?.business?.name || "N/A"}
            </h4>
          </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
        <div className="rounded-t-xl overflow-hidden">
          <div className="bg-primary px-5 py-3 ">
            <h4 className="font-semibold text-white">Loan Request Details</h4>
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
              <h4 className="font-semibold text-sm">6 Months</h4>
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
              <p className="text-sm font-thin">Average Transaction Amount:</p>
              <h4 className="font-semibold text-sm">N450,000.00</h4>
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
};

export default Page;
