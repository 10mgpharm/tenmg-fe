'use client'
import { Button } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useRef, useState } from "react";

interface HiddenFileUploadProps {
  // setFileError: Dispatch<SetStateAction<string | null>>;
  setFilePreview: Dispatch<SetStateAction<string | null>>;
  setFile: Dispatch<SetStateAction<File | null>>;
}

export const HiddenFileUpload = ({ setFilePreview, setFile }: HiddenFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileError, setFileError] = useState<string | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      setFileError(null);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size must be less than 5MB");
        event.target.value = "";
        return;
      }

      if (!file.type.startsWith("image/")) {
        setFileError("Only image files are allowed");
        event.target.value = "";
        return;
      }

      setFile(file);

      const fileURL = URL.createObjectURL(file);

      setFilePreview(fileURL);

      console.log("File accepted:", file);
    }
  };

  return (
    <div>
      <Button variant="outline" size="sm" onClick={handleButtonClick}>
        Upload
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        id="file"
        name="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
      <p className="text-xs text-red-500">{fileError}</p>
    </div>
  );
};
