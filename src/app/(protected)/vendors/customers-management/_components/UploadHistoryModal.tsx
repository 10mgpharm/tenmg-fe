import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CiFileOn } from "react-icons/ci";
import { FiUploadCloud } from "react-icons/fi";
import { toast } from "react-toastify";

interface IFormInput {
  customerId: string;
}

const UploadHistoryModal = ({
  isOpen,
  onClose,
  fetchCustomerTnx,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  fetchCustomerTnx: () => void;
  id: string;
}) => {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadLoading, setIsUploadLoading] = useState<Boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer.files && dataTransfer.files.length > 0) {
      const droppedFile = dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleTnxHistoryUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    setIsUploadLoading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("customerId", id);
      formData.append("file", file);

      const axiosInstance = requestClient({ token });

      const response = await axiosInstance.post(
        `/vendor/txn_history/upload_and_evaluate`,
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
        toast.success(response.data.message);
        setFile(null); // Reset the file after successful upload
        setUploadProgress(0);
        fetchCustomerTnx();
        setIsUploadLoading(false);
      } else {
        console.error("Error uploading the file:");
        toast.error("Failed to upload the file. Please try again later.");
        setIsUploadLoading(false);
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
      toast.error("Failed to upload the file. Please try again later.");
      setIsUploadLoading(false);
    }
  };

  const fileName = "Transactions Batch One.pdf"; // Replace with dynamic value if needed
  const fileSize = "200 KB"; // Replace with dynamic value if needed

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size={"lg"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload File</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form className="space-y-5 mb-6 ">
            {/* <FormControl>
            <FormLabel>Customer by Name or ID</FormLabel>
            <Input 
            type="text" 
            placeholder="Eg. Jude Bellingham or MG-10932023"
            id='customerId'
            errorBorderColor="red.300"
            isInvalid={!!errors.customerId}
            _focus={{
                border: !!errors.customerId ? "red.300" : "border-gray-300",
              }}
              {...register("customerId", {
                required: true,
              })}
            />
          </FormControl> */}
            {!isUploadLoading ? (
              <div className="mb-8 ">
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
                      Select XlSX or CSV File to upload
                    </p>
                    <p className="text-sm font-normal text-center">
                      or drag and drop
                    </p>
                    <p className="text-xs font-normal text-center">
                      Minimum Size (5MB)
                    </p>
                  </div>
                </div>
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
                  zIndex={2} // Ensures content stays above the background
                >
                  {/* Icon and File Details */}
                  <Flex alignItems="center">
                    <Box p={2} bg={"blue.100"} borderRadius={"full"}>
                      <Icon as={CiFileOn} boxSize={6} color="blue.500" />
                    </Box>
                    <Box ml="3">
                      <Text fontSize="md">{fileName}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {fileSize} - {uploadProgress}% uploaded
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
            <Flex justifyContent={"center"} w={"full"}>
              {!file ? (
                <Button
                  variant="solid"
                  w={"full"}
                  onClick={onClose}
                  colorScheme="blue"
                >
                  Done
                </Button>
              ) : (
                <Button
                  bg="primary.500"
                  color={"white"}
                  width={"100%"}
                  onClick={handleTnxHistoryUpload}
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

export default UploadHistoryModal;
