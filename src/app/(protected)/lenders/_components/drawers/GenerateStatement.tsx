import React, { useState, useRef } from "react";
import OperationLayout from "../OperationLayout";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import GenerateDateRange from "../GenerateDateRange";
import GenerateIcon from "@public/assets/images/generate-image.png";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { downloadExcel } from "@/utils/downloadTemplate";

interface IFormInput {
  amount: number;
}

interface GenerateStatementProps {
  isOpen: boolean;
  onClose: () => void;
}

const GenerateStatement = ({ isOpen, onClose }: GenerateStatementProps) => {
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const sessionToken = sessionData?.user?.token;

  const [step, setStep] = useState(1);
  const [dateError, setDateError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statementData, setStatementData] = useState<any>(null);
  const dateRangeRef = useRef<any>(null);

  const nextStep = () => setStep((prev) => prev + 1);

  const handleClose = () => {
    reset();
    setStep(1);
    onClose();
    setDateError("");
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);
    if (dateRangeRef.current?.getDateError()) {
      setDateError(dateRangeRef.current.getDateError());
      setLoading(false);
      return;
    }

    setDateError("");

    const { startDate, endDate } = dateRangeRef.current?.getDateRange()!;

    try {
      const response = await requestClient({
        token: sessionToken,
      }).get(
        `/lender/dashboard/generate-statement?dateFrom=${startDate}&dateTo=${endDate}`,
        {
          responseType: "arraybuffer", // Key change: request binary data
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      if (response.status === 200) {
        setStatementData(response.data);
        nextStep();
      } else {
        toast.error(`Error generating statement`);
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage || "Error generating statement");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    downloadExcel(statementData, "Generate Statement - response");
    handleClose();
  };

  const {
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IFormInput>({ mode: "onChange" });

  return (
    <OperationLayout
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 1 ? "Generate Statement" : "Account Statement Generated"}
      description={
        step === 1
          ? "Choose a date range to view your account statement."
          : "Your account statement is now ready for your review. Also check your email for a copy."
      }
    >
      {step === 1 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5 text-gray mb-10">
            <FormControl isInvalid={!!dateError} mb={6}>
              <GenerateDateRange ref={dateRangeRef} />
              {dateError && <FormErrorMessage>{dateError}</FormErrorMessage>}
            </FormControl>
            <Button
              size="lg"
              w="full"
              type="submit"
              isLoading={loading}
              loadingText="Generating..."
            >
              Generate Statement
            </Button>
          </div>
        </form>
      )}
      {step === 2 && (
        <Box>
          <Stack spacing={4} align="center">
            <Image
              src={GenerateIcon.src}
              alt="Success"
              width={320}
              height={320}
            />
          </Stack>

          <Button size="lg" w="full" onClick={handleDownload} mt={10}>
            Save to Device
          </Button>
        </Box>
      )}
    </OperationLayout>
  );
};

export default GenerateStatement;
