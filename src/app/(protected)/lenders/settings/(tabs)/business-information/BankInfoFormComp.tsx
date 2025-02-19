import requestClient from "@/lib/requestClient";
import { BankAccountDto, NextAuthUserSession } from "@/types";
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
import React, { useEffect, useRef, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BankDto } from "@/types";
import {
  createBankAccount,
  getBankList,
  verifyBankAccount,
} from "@/app/(standalone)/widgets/applications/actions";

interface Props {
  sessionData: NextAuthUserSession;
  defaultBankDetail: BankAccountDto;
}
interface IFormInput {
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bvn: string;
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
  bvn: z
    .string()
    .nonempty("BVN cannot be empty.")
    .length(10, "BVN must be exactly 10 digits.")
    .regex(/^\d{10}$/, "BVN must contain only digits."),
});

type FormInput = z.infer<typeof formSchema>;

export default function BankInfoFormComp({
  sessionData,
  defaultBankDetail,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [accountVerificationInProgress, startBankAccountVerification] =
    useTransition();
  const [accountVerificationError, setAccountVerificationError] = useState<
    string | null
  >(null);
  const [banks, setBanks] = useState<SelectOption[] | null>(null);
  const [defaultBankAccount, setDefaultBankAccount] =
    useState<BankAccountDto>(defaultBankDetail);

  const token = sessionData?.user?.token;

  console.log("Banck Account", defaultBankAccount);

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
      bvn: "",
    },
  });

  const accountNumber = watch("accountNumber");
  const bankCode = watch("bankCode");
  const bankName = watch("bankName");
  const accountName = watch("accountName");

  const accountNumberInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (accountNumber && accountNumber.length === 10 && bankCode && bankName) {
      handleVerifyBankAccount(accountNumber, bankCode);
    } else {
      setValue("accountName", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountNumber, bankCode]);

  useEffect(() => {
    if (token) {
      handleGetBankList();
    }
  }, [token]);

  useEffect(() => {
    if (accountNumberInputRef.current) {
      accountNumberInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (defaultBankDetail) {
      setDefaultBankAccount(defaultBankAccount);
    }
  }, [defaultBankDetail]);

  useEffect(() => {
    if (defaultBankAccount) {
      setValue("accountName", defaultBankAccount.accountName);
      setValue("accountNumber", defaultBankAccount.accountNumber);
      setValue("bankCode", defaultBankAccount.bankCode);
      setValue("bankName", defaultBankAccount.bankName);
    }
  }, [defaultBankAccount, setValue]);

  const onSubmit: SubmitHandler<FormInput> = async (formData) => {
    try {
      setIsLoading(true);
      const response = await requestClient({
        token: sessionData.user.token,
      }).patch("/lender/settings/business-account", {
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
    <div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5 w-full flex justify-between p-5">
          <div>
            <h3 className="font-semibold text-lg">Bank Information</h3>
            <p className="text-sm text-slate-300">
              Manage your bank information and other information for payout
            </p>
          </div>
          <Button
            size="sm"
            variant="solid"
            colorScheme="primary"
            isLoading={isLoading}
            type="submit"
          >
            Save Changes
          </Button>
        </div>
        <div className="p-5 rounded-lg bg-white/70 border border-slate-300 space-y-4">
          {/* Account Number */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div>
              <FormLabel>Account Number</FormLabel>
            </div>
            <FormControl className="col-span-2">
              <NumberInput
                value={accountNumber || ""}
                onChange={(val) => {
                  setValue("accountNumber", val);
                  trigger("accountNumber");
                }}
                inputMode="numeric"
              >
                <NumberInputField
                  ref={accountNumberInputRef}
                  placeholder="0000000000"
                />
              </NumberInput>
              {errors.accountNumber && (
                <Text fontSize="sm" color="red.500">
                  {errors.accountNumber.message}
                </Text>
              )}
            </FormControl>
          </div>

          {/* Bank Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div>
              <FormLabel>Bank</FormLabel>
            </div>
            <FormControl className="col-span-2" isInvalid={!!errors.bankCode}>
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
          </div>

          {/* Account Name */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div>
              <FormLabel>Account Name</FormLabel>
            </div>
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
          </div>

          {/* BVN */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div>
              <FormLabel>BVN</FormLabel>
            </div>
            <FormControl className="col-span-2">
              <NumberInput
                value={watch("bvn") || ""}
                onChange={(val) => {
                  setValue("bvn", val);
                  trigger("bvn");
                }}
                inputMode="numeric"
              >
                <NumberInputField placeholder="0000000000" />
              </NumberInput>
              {errors.bvn && (
                <Text fontSize="sm" color="red.500">
                  {errors.bvn.message}
                </Text>
              )}
            </FormControl>
          </div>
        </div>
      </form>
    </div>
  );
}
