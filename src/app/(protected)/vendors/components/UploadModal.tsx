import {
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  List,
  ListItem,
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
import { Controller, useForm } from "react-hook-form";
import { handleServerErrorMessage } from "@/utils";

interface UploadModalProps {
  isOpen: boolean;
  isDownloadTemplate?: boolean;
  uploadEndpoint: string;
  acceptedFileTypes?: string;
  maxFileSizeMB?: number;
  templateName?: string;
  isSearch?: boolean;
  searchTitle?: string;
  searchData?: string[];
  onClose: () => void;
  handleDownload?: () => void;
  reloadData?: () => void;
}

const UploadModal = ({
  isOpen,
  onClose,
  handleDownload,
  reloadData,
  uploadEndpoint,
  acceptedFileTypes = ".csv, .xlsx, .xls",
  maxFileSizeMB = 1,
  templateName = "Upload Template.xls",
  isDownloadTemplate = false,
  isSearch = false,
  searchTitle = "Customer by Name or ID",
  searchData = [],
}: UploadModalProps) => {
  const [isUploadLoading, setIsUploadLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const acceptedFileExtensions = acceptedFileTypes
    .replace(/\s/g, "")
    .split(",");

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { file: null, search: "" },
    mode: "onChange",
  });

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer.files && dataTransfer.files.length > 0) {
      const droppedFile = dataTransfer.files[0];
      setValue("file", droppedFile);
    }
  };

  const handleClick = () => {
    document.getElementById("file_upload")?.click();
  };

  const handleUploadFile = async (data: { file: File; search: string }) => {
    const file = data.file;

    setIsUploadLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const axiosInstance = requestClient({ token });

      const response = await axiosInstance.post(uploadEndpoint, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        },
      });

      if (response.status === 200) {
        toast.success("File uploaded successfully!");
        setUploadProgress(0);
        if (reloadData) reloadData();
        reset();
      } else {
        toast.error("Failed to upload the file. Please try again later.");
      }
    } catch (error) {
      const errorMessage = handleServerErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsUploadLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    if (value.length > 0) {
      const filteredSuggestions = searchData.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(
        filteredSuggestions.length > 0
          ? filteredSuggestions
          : ["No matches found"]
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (value: string) => {
    setValue("search", value);
    setSuggestions([]);
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload File</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            className="space-y-5 mb-6"
            onSubmit={handleSubmit(handleUploadFile)}
          >
            {isSearch && (
              <Box mb={4}>
                <Text fontWeight="medium" pb={2}>
                  {searchTitle}
                </Text>
                <Controller
                  name="search"
                  control={control}
                  rules={{
                    required: isSearch ? "Customer Name/ID is required" : false,
                  }}
                  render={({ field }) => (
                    <FormControl isInvalid={!!errors.search}>
                      <Input
                        placeholder="Eg. Jude Bellingham or MG-10932023"
                        {...field}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          field.onChange(e.target.value);
                          handleInputChange(e.target.value);
                        }}
                      />
                      {suggestions.length > 0 && (
                        <List mt={2} border="1px solid" borderColor="gray.200">
                          {suggestions.map((item, index) => (
                            <ListItem
                              key={index}
                              px={3}
                              py={1}
                              cursor="pointer"
                              _hover={{ bg: "gray.100" }}
                              onClick={() => {
                                handleSuggestionClick(item);
                              }}
                            >
                              {item}
                            </ListItem>
                          ))}
                        </List>
                      )}
                      {errors.search && (
                        <FormErrorMessage>
                          {errors.search.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  )}
                />
              </Box>
            )}

            {!isUploadLoading ? (
              <div className="mb-8">
                <Controller
                  name="file"
                  control={control}
                  rules={{
                    required: "Please select a file to upload.",
                    validate: {
                      fileSize: (value: File) =>
                        (value && value.size / 1024 / 1024 <= maxFileSizeMB) ||
                        `File size exceeds the maximum limit of ${maxFileSizeMB}MB.`,
                      fileType: (value: File) => {
                        if (!value) return true;
                        const extension = `.${value.name
                          .split(".")
                          .pop()
                          ?.toLowerCase()}`;
                        return (
                          acceptedFileExtensions.includes(extension) ||
                          "Unsupported file format"
                        );
                      },
                    },
                  }}
                  render={({ field }) => (
                    <FormControl isInvalid={!!errors.file}>
                      <div
                        className="border border-gray-500 border-dashed relative p-10 rounded-md"
                        onClick={handleClick}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          id="file_upload"
                          name="file"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                          }}
                          accept={acceptedFileTypes}
                          className="hidden"
                        />
                        <div className="flex flex-col gap-2 cursor-pointer">
                          <div className="bg-gray-50 p-2 rounded-full mx-auto max-w-max mb-4">
                            <FiUploadCloud className="w-6 h-6 text-gray-700" />
                          </div>
                          <p className="text-center">Select a File to upload</p>
                          <p className="text-sm font-normal text-center">
                            or drag and drop
                          </p>
                        </div>
                      </div>
                    </FormControl>
                  )}
                />

                {watch("file") && (
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Selected file: {watch("file")?.name}
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
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  position="relative"
                  zIndex={2}
                >
                  <Flex alignItems="center">
                    <Box p={2} bg={"blue.100"} borderRadius={"full"}>
                      <Icon as={CiFileOn} boxSize={6} color="blue.500" />
                    </Box>
                    <Box ml="3">
                      <Text fontSize="md">{watch("file")?.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {watch("file")?.size &&
                          `${(watch("file").size / 1024).toFixed(2)} KB`}{" "}
                        - {uploadProgress}% uploaded
                      </Text>
                    </Box>
                  </Flex>
                  <CircularProgress
                    value={uploadProgress}
                    size="30px"
                    color="blue.500"
                  />
                </Flex>
              </Box>
            )}

            {/* Download Template */}
            {isDownloadTemplate && (
              <div className="border border-dashed relative p-4 rounded-md bg-warning-50 border-warning-300 mb-8">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-primary-500 font-semibold flex items-center gap-2 mb-2">
                    <Box p={2} bg={"blue.100"} borderRadius={"full"}>
                      <Icon as={CiFileOn} boxSize={6} color="blue.500" />
                    </Box>{" "}
                    {templateName}
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
                <p className="text-xs mb-2">
                  Supports only {acceptedFileTypes}
                </p>
                <p className="text-xs">Maximum size of {maxFileSizeMB}MB</p>
              </div>
            )}

            <Flex justifyContent={"center"} w={"full"}>
              <Button
                type="submit"
                variant="outline"
                isLoading={isUploadLoading}
                loadingText="Uploading"
                isDisabled={!watch("file")}
              >
                Upload
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UploadModal;
