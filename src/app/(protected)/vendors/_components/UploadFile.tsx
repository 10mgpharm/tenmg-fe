import React, { useState, useRef } from "react";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { FiUploadCloud } from "react-icons/fi";
import { toast } from "react-toastify";

interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxFileSize?: number;
  uploadLabel?: string;
  uploadSuccessMessage?: string;
}

const UploadFile: React.FC<FileUploadProps> = ({
  onUpload,
  accept = ".pdf, .doc, .docx, .csv, .xlsx, .xls",
  maxFileSize = 10 * 1024 * 1024,
  uploadLabel = "Click to upload or drag and drop",
  uploadSuccessMessage = "File uploaded successfully!",
}) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      if (selectedFile.size > maxFileSize) {
        toast.error(
          `File size exceeds the ${(maxFileSize / 1024 / 1024).toFixed(
            2
          )}MB limit. Please upload a smaller file.`
        );
        setFile(null);
      } else {
        setFile(selectedFile);
        onUpload(selectedFile);
        toast.info(uploadSuccessMessage);
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.size > maxFileSize) {
        toast.error(
          `File size exceeds the ${(maxFileSize / 1024 / 1024).toFixed(
            2
          )}MB limit. Please upload a smaller file.`
        );
        setFile(null);
      } else {
        setFile(droppedFile);
        onUpload(droppedFile);
        toast.info(uploadSuccessMessage);
      }
    }
  };

  return (
    <Box className="space-y-5 mb-6">
      <div className="mb-8">
        <div
          className="relative p-4"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex flex-col gap-2 cursor-pointer">
            <div className="bg-gray-50 p-2 rounded-full mx-auto max-w-max mb-4">
              <FiUploadCloud className="w-6 h-6 text-gray-700" />
            </div>
            {file ? (
              <>
                <Text fontSize="md" textAlign="center">
                  {file.name}
                </Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  {(file.size / 1024).toFixed(2)} KB
                </Text>
              </>
            ) : (
              <>
                <p className="text-sm font-normal text-center">
                  <span className="text-primary-500">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-sm font-normal text-center">{uploadLabel}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};

export default UploadFile;
