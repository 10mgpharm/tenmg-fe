"use client";

import React, { useState, useRef, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Box,
  Text,
  Flex,
  CircularProgress,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Progress,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { FiUploadCloud, FiMoreHorizontal } from "react-icons/fi";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import DateComponent from "../suppliers/products/_components/DateComponent";
import { BusinessStatus } from "@/constants";
import moment from "moment";
import { MdClose } from "react-icons/md";
import { FaFileWord } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import pdfFileIcon from "@public/assets/images/file_fomat_icon.png";
import reviewDocIcon from "@public/assets/images/review_ongoing.png";
import successIcon from "@public/assets/images/licence_success.png";
import { dateToString } from "@/utils/formatDate";

interface IFormInput {
  licenseNumber: string;
  expiryDate: Date | null;
  cacDocument: File | null;
}

type BusinessLicense = {
  expiryDate: string;
  licenseFile: string;
  licenseNumber: string;
  licenseVerificationStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
};

interface LicenseUploadProps {
  endpoint: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const LicenseUpload = ({ endpoint }: LicenseUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [businessLicense, setBusinessLicense] = useState<BusinessLicense>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLicenseLoading, setIsLicenseLoading] = useState(false);

  const [localUploadProgress, setLocalUploadProgress] = useState(0);
  const [isLocalUploading, setIsLocalUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const fileExtension = file?.name?.split(".").pop()?.toLowerCase();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error(
          "File size exceeds the 10MB limit. Please upload a smaller file."
        );
        setFile(null);
        setValue("cacDocument", null);
      } else {
        setFile(selectedFile);
        setValue("cacDocument", selectedFile);
        simulateLocalUpload();
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.size > MAX_FILE_SIZE) {
        toast.error(
          "File size exceeds the 10MB limit. Please upload a smaller file."
        );
        setFile(null);
        setValue("cacDocument", null);
      } else {
        setFile(droppedFile);
        setValue("cacDocument", droppedFile);
        simulateLocalUpload();
      }
    }
  };

  const simulateLocalUpload = () => {
    // Reset and start simulating local upload progress
    setLocalUploadProgress(0);
    setIsLocalUploading(true);

    const interval = setInterval(() => {
      setLocalUploadProgress((prev) => {
        const nextVal = prev + 10;
        if (nextVal >= 100) {
          clearInterval(interval);
          setIsLocalUploading(false);
          return 100;
        }
        return nextVal;
      });
    }, 200);
  };

  const onCancelUpload = () => {
    setFile(null);
    setValue("cacDocument", null);
    setLocalUploadProgress(0);
  };

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      const response = await requestClient({
        token: sessionData.user.token,
      }).patch(`${endpoint}/settings/license/withdraw`);

      if (response.status === 200) {
        toast.success(response.data.message);

        // update session here
        await session.update({
          ...sessionData,
          user: {
            ...sessionData.user,
            businessStatus: BusinessStatus.PENDING_VERIFICATION,
          },
        });

        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(`Withdrawal failed: ${errorMessage}`);
    }
  };

  const onSubmit = async (value: IFormInput) => {
    if (!file || localUploadProgress < 100) {
      toast.error("Please wait until the file finishes uploading locally.");
      return;
    }

    const date = new Date(value.expiryDate);
    const formattedDate = dateToString(date);

    const formData = new FormData();
    formData.append("licenseNumber", value.licenseNumber);
    formData.append("expiryDate", formattedDate);
    if (value.cacDocument) {
      formData.append("cacDocument", value.cacDocument);
    } else {
      console.log("No CAC document selected.");
    }

    try {
      setIsLoading(true);
      const response = await requestClient({
        token: sessionData.user.token,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).post(`${endpoint}/settings/license`, formData);

      if (response.status === 200) {
        toast.success(response.data.message);

        // update session here
        await session.update({
          ...sessionData,
          user: {
            ...sessionData.user,
            businessStatus: BusinessStatus.PENDING_APPROVAL,
          },
        });

        const {
          expiryDate,
          licenseFile,
          licenseNumber,
          licenseVerificationStatus,
        } = response.data?.data;

        setBusinessLicense({
          expiryDate,
          licenseFile,
          licenseNumber,
          licenseVerificationStatus,
        });

        setIsLoading(false);
      } else {
        toast.error(`License upload failed: ${response.data.message}`);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleServerErrorMessage(error);
      toast.error(`License upload failed: ${errorMessage}`);
    }
  };

  useEffect(() => {
    const fetchLicense = async () => {
      setIsLicenseLoading(true);
      try {
        const response = await requestClient({
          token: sessionData.user.token,
        }).get(`${endpoint}/settings/license`);
        setIsLicenseLoading(false);

        if (response.status === 200) {
          const {
            expiryDate,
            licenseFile,
            licenseNumber,
            licenseVerificationStatus,
          } = response.data?.data;
          setBusinessLicense({
            expiryDate,
            licenseFile,
            licenseNumber,
            licenseVerificationStatus,
          });
        }
      } catch (error) {
        setIsLicenseLoading(false);
        const errorMessage = handleServerErrorMessage(error);
        toast.error(`License fetch failed: ${errorMessage}`);
      }
    };
    if (sessionData?.user?.token) fetchLicense();
  }, [sessionData?.user?.token, endpoint]);

  if (sessionData?.user?.businessStatus === BusinessStatus.PENDING_APPROVAL) {
    return (
      <Box className="max-w-2xl bg-white p-10 rounded-md border-2 border-gray-200 flex flex-col space-y-5 items-center justify-center w-full">
        <Image
          src={reviewDocIcon.src}
          alt="review"
          width="120px"
          height="120px"
        />
        <Text className="font-semibold text-2xl">
          Document Upload Review Ongoing
        </Text>
        <Text className="text-center font-normal text-gray-600">
          Your document is currently being reviewed by the admin, we’ll send you
          a mail once the document is approved or rejected
        </Text>

        <Box>
          <Button
            type="submit"
            backgroundColor="error.600"
            _hover="error.700"
            w="full"
            onClick={handleWithdraw}
            isDisabled={isLoading}
            isLoading={isLoading}
            loadingText="Withdrawing..."
          >
            Withdraw Submission
          </Button>
        </Box>
        {isLicenseLoading && (
          <Flex
            direction={"column"}
            gap={5}
            className="animate-pulse"
            alignSelf="flex-start"
          >
            <Text className="text-left text-sm font-medium text-gray-500 bg-gray-500 w-full h-5" />
            <Text className="text-left text-sm font-medium text-gray-500 bg-gray-500 w-full h-5" />
            <Text className="text-left text-sm font-medium text-gray-500 bg-gray-500 w-9/12 h-5" />
          </Flex>
        )}
        {!isLicenseLoading && (
          <Flex direction={"column"} gap={5} alignSelf="flex-start">
            <Text className="text-left text-sm font-medium text-gray-500">
              CAC Document:{" "}
              <a
                target="_blank"
                href={businessLicense?.licenseFile}
                className="font-bold cursor-pointer underline"
              >
                View Document
              </a>
            </Text>
            <Text className="text-left text-sm font-medium text-gray-500">
              License Number:{" "}
              <span className="font-bold">
                {businessLicense?.licenseNumber}
              </span>
            </Text>
            <Text className="text-left text-sm font-medium text-gray-500">
              Expiry Date:{" "}
              <span className="font-bold">
                {businessLicense?.expiryDate
                  ? moment(businessLicense?.expiryDate)?.format("MMMM Do YYYY")
                  : "N/A"}
              </span>
            </Text>
          </Flex>
        )}
      </Box>
    );
  }

  if (sessionData?.user?.businessStatus === BusinessStatus.VERIFIED) {
    return (
      <Box className="max-w-2xl bg-white p-10 rounded-md border-2 border-gray-200 flex flex-col space-y-5 items-center justify-center w-full">
        {isLicenseLoading && (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        )}
        {!isLicenseLoading && (
          <>
            <Image
              src={successIcon.src}
              alt="review"
              width="120px"
              height="120px"
            />
            <Text className="font-semibold text-2xl">Document Approved</Text>
            <Text className="text-center font-normal text-gray-600">
              Your document with license number{" "}
              <span className="font-bold text-base text-primary-500">
                {businessLicense?.licenseNumber}
              </span>
              , expiring on{" "}
              <span className="font-bold text-base text-primary-500">
                {" "}
                {businessLicense?.expiryDate
                  ? moment(businessLicense?.expiryDate)?.format("MMMM Do YYYY")
                  : "N/A"}
              </span>
              , has been approved.
            </Text>
            <Box>
              <Button
                colorScheme="blue"
                w="full"
                onClick={() => {
                  window.open(businessLicense?.licenseFile, "_blank");
                }}
              >
                View Document
              </Button>
            </Box>
          </>
        )}
      </Box>
    );
  }

  const fileActionsMenu = () => {
    if (file && localUploadProgress === 100 && !isLocalUploading) {
      const fileURL = URL.createObjectURL(file);
      return (
        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            px={2}
            justifyContent="center"
            alignContent="center"
            alignItems="center"
          >
            <FiMoreHorizontal />
          </MenuButton>
          <MenuList fontWeight="medium">
            <MenuItem
              mb={2}
              onClick={() => {
                window.open(fileURL, "_blank");
              }}
            >
              View Document
            </MenuItem>
            <MenuItem color="error.600" onClick={onCancelUpload}>
              Remove Document
            </MenuItem>
          </MenuList>
        </Menu>
      );
    }
    return null;
  };

  const renderFileUploadSection = () => {
    // If no file selected or not uploading, show the initial upload area
    if (!file) {
      return (
        <Box
          className="border border-gray-300 relative p-10 rounded-md"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            handleDrop(e);
          }}
          cursor="pointer"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf, .doc, .docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <Box display="flex" flexDirection="column" gap={2}>
            <Box bg="gray.50" p={2} rounded="full" mx="auto" mb={4}>
              <FiUploadCloud className="w-6 h-6 text-gray-700" />
            </Box>
            <Text fontSize="sm" textAlign="center">
              <span className="font-semibold text-primary-500">
                Click to upload
              </span>{" "}
              or drag and drop
            </Text>
            <Text fontSize="xs" color="gray.500" textAlign="center">
              PDF, DOC or DOCX. Maximum size of 10MB
            </Text>
          </Box>
        </Box>
      );
    }

    // If file is selected is "locally uploading"
    if (file && (isLocalUploading || localUploadProgress < 100)) {
      return (
        <Box
          borderRadius="md"
          border="1px solid"
          borderColor="gray.300"
          padding="10px"
          py={4}
          mt={4}
          width="100%"
          bg="white"
        >
          <Flex alignItems="center" justifyContent="space-between" w="100%">
            <Flex gap={2} alignItems="center" wordBreak="break-word">
              {fileExtension === "pdf" ? (
                <Image
                  src={pdfFileIcon.src}
                  width="40px"
                  height="40px"
                  alt="pdf"
                />
              ) : (
                <Icon as={FaFileWord} color="primary.500" boxSize={8} />
              )}

              <Box display="flex" flexDirection="column" fontSize="sm">
                <Text fontWeight="medium" mb={1} pr={4}>
                  {file?.name}
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight="normal"
                  className="text-[#525866]"
                >
                  {file?.size && (file.size / 1024).toFixed(2)} KB.{" "}
                  <CircularProgress
                    value={localUploadProgress}
                    size="20px"
                    color="error.500"
                  />{" "}
                  <span className="text-[#0A0D14]">Uploading…</span>
                </Text>
              </Box>
            </Flex>

            <Icon
              as={MdClose}
              cursor="pointer"
              onClick={onCancelUpload}
              boxSize={5}
              color="gray.600"
            />
          </Flex>

          <Box mt={4}>
            <Progress
              value={localUploadProgress}
              size="sm"
              borderRadius="sm"
              bg="gray.200"
              colorScheme="red"
            />
          </Box>
        </Box>
      );
    }

    // If local upload is complete
    if (file && localUploadProgress === 100 && !isLocalUploading) {
      return (
        <Box
          position="relative"
          border="1px solid #CBD5E0"
          padding="10px"
          borderRadius="md"
          width="100%"
          py={4}
          mt={4}
        >
          <Flex justifyContent="space-between" w="100%">
            <Flex alignItems="center" wordBreak="break-word">
              {fileExtension === "pdf" ? (
                <Image
                  src={pdfFileIcon.src}
                  width="40px"
                  height="40px"
                  alt="pdf"
                />
              ) : (
                <Icon as={FaFileWord} color="primary.500" boxSize={8} />
              )}

              <Box ml="3">
                <Text fontSize="sm" fontWeight="medium" mb={1} pr={4}>
                  {file?.name}
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight="normal"
                  className="text-[#525866]"
                >
                  {file?.size && (file.size / 1024).toFixed(2)} KB.{" "}
                  <Icon as={FaCheckCircle} boxSize={4} color="green.400" />{" "}
                  <span className="text-[#0A0D14]">Uploaded</span>
                </Text>
              </Box>
            </Flex>
            {fileActionsMenu()}
          </Flex>
        </Box>
      );
    }
  };

  return (
    <>
      <Box className="max-w-2xl bg-white p-10 rounded-md border-2 border-gray-200">
        {isLicenseLoading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 mb-6"
            encType="multipart/form-data"
          >
            {/* License Number */}
            <FormControl isInvalid={!!errors.licenseNumber}>
              <FormLabel>License Number</FormLabel>
              <Input
                type="text"
                placeholder="Enter License Number"
                {...register("licenseNumber", {
                  required: "License number is required.",
                })}
                disabled={isLoading}
              />
              <FormErrorMessage>
                {errors.licenseNumber?.message}
              </FormErrorMessage>
            </FormControl>

            {/* Expiry Date */}
            <FormControl isInvalid={!!errors.expiryDate}>
              <FormLabel>Expiry Date</FormLabel>
              <Controller
                name="expiryDate"
                control={control}
                rules={{ required: "Expiry date is required" }}
                render={({ field }) => (
                  <DateComponent
                    startDate={field.value}
                    setStartDate={field.onChange}
                  />
                )}
              />
              <FormErrorMessage>{errors.expiryDate?.message}</FormErrorMessage>
            </FormControl>

            {/* CAC Document Upload */}
            <FormControl isInvalid={!!errors.cacDocument} className="mb-8">
              <FormLabel>CAC Document</FormLabel>
              <Controller
                name="cacDocument"
                control={control}
                rules={{
                  required: "CAC Document is required",
                }}
                render={() => renderFileUploadSection()}
              />
              <FormErrorMessage>{errors.cacDocument?.message}</FormErrorMessage>
            </FormControl>

            {/* Submit Button */}
            <Button
              type="submit"
              colorScheme="blue"
              w="full"
              isDisabled={
                isLoading ||
                isLocalUploading ||
                localUploadProgress < 100 ||
                !file
              }
              isLoading={isLoading}
              loadingText="Submitting"
            >
              Submit
            </Button>
          </form>
        )}
      </Box>
    </>
  );
};

export default LicenseUpload;
