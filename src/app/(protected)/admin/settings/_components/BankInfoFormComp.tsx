import requestClient from "@/lib/requestClient";
import { BankAccountDto, NextAuthUserSession, BankDto } from "@/types";
import { handleServerErrorMessage } from "@/utils";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Select,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { set, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getBankList,
  verifyBankAccount,
} from "@/app/(standalone)/widgets/applications/actions";
import { useSession } from "next-auth/react";

interface IFormInput {
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
}

interface SelectOption {
  label: string;
  value: number;
}

const formSchema = z.object({
  accountNumber: z
    .string()
    .nonempty("Account number cannot be empty.")
    .length(10, "Account number must be exactly 10 digits.")
    .regex(/^\d{10}$/, "Account number must contain only digits."),
  accountName: z.string().min(1, "Account name cannot be empty."),
  bankCode: z
    .string({ invalid_type_error: "Please select a bank." })
    .min(1, "Please select a valid bank."),
  bankName: z.string().nonempty(),
});

type FormInput = z.infer<typeof formSchema>;

export default function BankInfoFormComp() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInfoLoading, setIsInfoLoading] = useState(false);
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const [useBankDetails, setUserBankDetails] = useState(null);
  const [accountVerificationInProgress, startBankAccountVerification] =
    useTransition();
  const [accountVerificationError, setAccountVerificationError] = useState<
    string | null
  >(null);
  const [banks, setBanks] = useState<SelectOption[] | null>(null);

  const token = sessionData?.user?.token;

  const fetchTableData = useCallback(async () => {
    setIsInfoLoading(true);

    try {
      const response = await requestClient({ token: token }).get(
        "admin/wallet/bank-account"
      );
      if (response.status === 200) {
        setUserBankDetails(response?.data?.data);
        setValue("accountName", response?.data?.data.accountName);
        setValue("accountNumber", response?.data?.data.accountNumber);
        setValue("bankName", response?.data?.data.bankName);
        setValue("bankCode", response?.data?.data.bankCode);
      }
    } catch (error) {
      console.error(error);
    }
    setIsInfoLoading(false);
  }, [token]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    trigger,
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      bankName: "",
      accountName: "",
      accountNumber: "",
      bankCode: "",
    },
  });

  const accountNumber = watch("accountNumber");
  const bankCode = watch("bankCode");
  const bankName = watch("bankName");
  const accountName = watch("accountName");

  const handleGetBankList = async () => {
    try {
      const response = await getBankList(token);
      if (response.status === "error") {
        setBanks([]);
      } else {
        const bankList: BankDto[] = response.data;
        setBanks(
          bankList.map((bank) => ({
            label: bank.name,
            value: bank.code,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching bank list:", error);
      setBanks([]);
    }
  };

  const handleVerifyBankAccount = (accNumber: string, bCode: string) => {
    startBankAccountVerification(async () => {
      setAccountVerificationError(null);
      setValue("accountName", "");
      try {
        const { data, status, message } = await verifyBankAccount(token, {
          accountNumber: accNumber,
          bankCode: bCode,
        });
        if (status === "error") {
          setAccountVerificationError(message);
        } else {
          if (data.success) {
            setValue("accountName", data?.data?.accountName);
          } else {
            setAccountVerificationError(data?.message);
          }
        }
      } catch (error) {
        setAccountVerificationError("Verification failed");
      }
    });
  };

  // When account number reaches 10 digits and a bank is selected, verify account
  useEffect(() => {
    if (accountNumber && accountNumber.length === 10 && bankCode && bankName) {
      handleVerifyBankAccount(accountNumber, bankCode);
    } else {
      setValue("accountName", "");
    }
  }, [accountNumber, bankCode, bankName, setValue]);

  // Get Bank List on token change
  useEffect(() => {
    if (token) {
      handleGetBankList();
    }
  }, [token]);

  useEffect(() => {
    if (banks && bankCode) {
      const matchedBank = banks.find((b) => b.value === Number(bankCode));
      if (matchedBank) {
        setValue("bankName", matchedBank.label);
      }
    }
  }, [banks, bankCode, setValue]);

  const onSubmit: SubmitHandler<FormInput> = async (formData) => {
    try {
      setIsLoading(true);
      const response = await requestClient({
        token: sessionData.user.token,
      }).patch(`/admin/wallet/add-bank-account/${useBankDetails?.id}`, {
        ...formData,
      });

      if (response.status === 200) {
        toast.success("Bank Information successfully updated");
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:max-w-5xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="space-y-5 w-full flex justify-between mt-10 pb-3">
          <div>
            <h3 className="font-semibold text-lg">Bank Information</h3>
            <Text fontSize={"14px"} color={"gray.500"}>
              Manage your bank information and details for payout.
            </Text>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-white/70">
          <div className="space-y-4">
            {/* Account Number Field */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div>
                <FormLabel m={0}>Account Number</FormLabel>
                <Text fontSize="14px" color="gray.500">
                  Associated account number
                </Text>
              </div>
              <Skeleton isLoaded={!isInfoLoading}>
                <FormControl className="col-span-2">
                  <NumberInput
                    value={accountNumber || ""}
                    onChange={(val) => {
                      setValue("accountNumber", val);
                      trigger("accountNumber");
                    }}
                    inputMode="numeric"
                  >
                    <NumberInputField placeholder="0000000000" />
                  </NumberInput>
                  {errors.accountNumber && (
                    <Text fontSize="sm" color="red.500">
                      {errors.accountNumber.message}
                    </Text>
                  )}
                </FormControl>
              </Skeleton>
            </div>

            {/* Bank Selection Field */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div>
                <FormLabel m={0}>Bank</FormLabel>
                <Text fontSize="14px" color="gray.500">
                  Associated bank name
                </Text>
              </div>
              <Skeleton isLoaded={!isInfoLoading}>
                <FormControl
                  className="col-span-2"
                  isInvalid={!!errors.bankCode}
                >
                  <Select
                    placeholder="Choose Bank"
                    {...register("bankCode", {
                      required: "Please select a bank",
                    })}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      const selectedText =
                        e.target.options[e.target.selectedIndex].text;
                      setValue("bankCode", selectedValue);
                      setValue("bankName", selectedText);
                      trigger(["bankCode", "bankName"]);
                    }}
                    defaultValue={useBankDetails?.bankName}
                  >
                    {banks?.map((bank, index) => (
                      <option key={index} value={bank.value}>
                        {bank.label}
                      </option>
                    ))}
                  </Select>
                  {errors.bankCode && (
                    <Text fontSize="sm" color="red.500">
                      {errors.bankCode.message}
                    </Text>
                  )}
                </FormControl>
              </Skeleton>
            </div>

            {/* Account Name Field */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div>
                <FormLabel m={0}>Account Name</FormLabel>
                <Text fontSize="14px" color="gray.500">
                  Account name verified from bank
                </Text>
              </div>
              <Skeleton isLoaded={!isInfoLoading}>
                <FormControl
                  className="col-span-2"
                  isInvalid={!!errors.accountName || !!accountVerificationError}
                >
                  <Skeleton
                    isLoaded={!accountVerificationInProgress}
                    fadeDuration={0.5}
                    borderRadius="md"
                  >
                    <Text p={2} bg="gray.100" borderRadius="md">
                      {accountName || "Account name will appear here"}
                    </Text>
                    {accountVerificationError && (
                      <Text fontSize="sm" color="red.500">
                        {accountVerificationError}
                      </Text>
                    )}
                  </Skeleton>
                  {!accountName && errors.accountName && (
                    <Text fontSize="sm" color="red.500">
                      {errors.accountName.message}
                    </Text>
                  )}
                </FormControl>
              </Skeleton>
            </div>
          </div>

          <div className="flex justify-center !mt-8">
            <Button
              variant="solid"
              colorScheme="primary"
              isLoading={isLoading}
              loadingText="Submitting..."
              type="submit"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
