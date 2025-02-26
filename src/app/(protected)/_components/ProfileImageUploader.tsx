import React, { useRef } from "react";
import { Box, Avatar, Icon, Text, Button } from "@chakra-ui/react";
import { FaCamera } from "react-icons/fa6";

interface ProfileImageUploaderProps {
  filePreview: string | null;
  sessionData: any;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadProfileImage: () => void;
  isUploading: boolean;
  isShowUpload: boolean;
  fileError: string | null;
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  filePreview,
  sessionData,
  handleFileChange,
  uploadProfileImage,
  isUploading,
  isShowUpload,
  fileError,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      // setFileError(null);
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <Box
        position="relative"
        role="group"
        w="fit-content"
        cursor="pointer"
        onClick={handleButtonClick}
      >
        <Avatar
          size="2xl"
          name={sessionData?.user?.name}
          src={filePreview ?? sessionData?.user?.picture}
        />
        <Box
          position="absolute"
          bottom="2"
          right="50"
          left="50"
          bg="gray.600"
          rounded="full"
          p="6px"
          cursor="pointer"
          display="none"
          _groupHover={{ display: "block" }}
        >
          <Icon as={FaCamera} boxSize="15px" color="white" />
        </Box>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg"
          id="file-input"
        />
      </Box>

      <div className="flex flex-col justify-between gap-3">
        <Text fontSize={"1rem"} fontWeight={600} color="gray.700">
          Profile Image
        </Text>
        <Text fontSize={"14px"} fontWeight={400} color="gray.700">
          Min 400x400px, PNG or JPEG
        </Text>

        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={uploadProfileImage}
            isLoading={isUploading}
            loadingText="Uploading..."
            isDisabled={!isShowUpload || isUploading}
          >
            Upload
          </Button>
        </div>

        <p className="text-xs text-red-500">{fileError}</p>
      </div>
    </div>
  );
};
