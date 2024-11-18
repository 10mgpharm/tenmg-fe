import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { CiFileOn } from "react-icons/ci";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";

interface UploadModelProps {
  isOpen: boolean;
  onClose: () => void;
  handleDownload: () => void;
  reloadCustomers: () => void; // Function to reload customer data in the parent component
}

const UploadModel = ({
  isOpen,
  onClose,
  handleDownload,
  reloadCustomers,
}: UploadModelProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadLoading, setIsUploadLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer.files && dataTransfer.files.length > 0) {
      const droppedFile = dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadCustomers = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    setIsUploadLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const axiosInstance = requestClient({ token });

      const response = await axiosInstance.post(
        `/vendor/customers/import`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const totalLength = progressEvent.total;
            if (totalLength !== undefined) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / totalLength
              );
              setUploadProgress(progress);
            }
          },
        }
      );

      if (response.status === 200) {
        toast.success("File uploaded successfully!");
        setFile(null); // Reset the file after successful upload
        setUploadProgress(0);
        reloadCustomers(); // Reload customer data after successful upload
      } else {
        toast.error("Failed to upload the file. Please try again later.");
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
      toast.error("Failed to upload the file. Please try again later.");
    } finally {
      setIsUploadLoading(false);
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Bulk Customer File</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form className="space-y-5 mb-6">
            {!isUploadLoading ? (
              <div className="mb-8">
                <div
                  className="border border-dashed relative p-4 rounded-md"
                  onClick={handleClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="csv_upload"
                    ref={fileInputRef}
                    name="csv"
                    onChange={handleChange}
                    accept=".csv, .xlsx, .xls"
                    className="hidden"
                  />
                  <div className="flex flex-col gap-2 cursor-pointer">
                    <div className="bg-gray-50 p-2 rounded-full mx-auto max-w-max mb-4">
                      <FiUploadCloud className="w-6 h-6 text-gray-700" />
                    </div>
                    <p className="text-center">
                      Select a XLS/XLSX File to upload
                    </p>
                    <p className="text-sm font-normal text-center">
                      or drag and drop
                    </p>
                  </div>
                </div>
                {file && (
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Selected file: {file.name}
                  </Text>
                )}
              </div>
            ) : (
              <Box
                position="relative"
                border="1px dashed #CBD5E0"
                padding="10px"
                borderRadius="md"
                width="100%"
                py={4}
              >
                {/* Background box that grows according to uploadPercentage */}
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  height="100%"
                  width={`${uploadProgress}%`}
                  backgroundColor="#EDF2F7"
                  borderRadius="md"
                  zIndex={1}
                />

                {/* Foreground content */}
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  position="relative"
                  zIndex={2}
                >
                  {/* Icon and File Details */}
                  <Flex alignItems="center">
                    <Box p={2} bg={"blue.100"} borderRadius={"full"}>
                      <Icon as={CiFileOn} boxSize={6} color="blue.500" />
                    </Box>
                    <Box ml="3">
                      <Text fontSize="md">{file?.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {file?.size && `${(file.size / 1024).toFixed(2)} KB`} -{" "}
                        {uploadProgress}% uploaded
                      </Text>
                    </Box>
                  </Flex>

                  {/* Circular Progress */}
                  <CircularProgress
                    value={uploadProgress}
                    size="30px"
                    color="blue.500"
                  />
                </Flex>
              </Box>
            )}

            <div className="border border-dashed relative p-4 rounded-md bg-warning-50 border-warning-300 mb-8">
              <div className="flex items-center justify-between">
                <p className="text-sm text-primary-500 font-semibold flex items-center gap-2 mb-2">
                  <Box p={2} bg={"blue.100"} borderRadius={"full"}>
                    <Icon as={CiFileOn} boxSize={6} color="blue.500" />
                  </Box>{" "}
                  Bulk Customer Upload Template.xls
                </p>
                <Button
                  variant="outline"
                  color="primary.500"
                  size={"sm"}
                  onClick={handleDownload}
                >
                  Download Template
                </Button>
              </div>
              <p className="text-xs mb-2">Supports only xls file</p>
              <p className="text-xs">Maximum size of 1MB</p>
            </div>
            <Flex justifyContent={"center"} w={"full"}>
              {!file ? (
                <Button variant="solid" colorScheme="blue" onClick={onClose}>
                  Done
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleUploadCustomers}
                  isLoading={isUploadLoading}
                  loadingText="Uploading"
                >
                  Upload
                </Button>
              )}
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UploadModel;
